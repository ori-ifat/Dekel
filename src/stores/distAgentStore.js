import { action, computed, observable, toJS } from 'mobx'
import { agentMail, agentMark } from 'common/services/apiService'

class DistAgent {
  @observable resultsLoading = false
  @observable request = {};
  @observable results = []
  @observable searchError = null
  @observable resultsCount = 0

  @action.bound
  clearResults() {
    this.results.clear()
    this.searchError = null
    this.resultsCount = 0
  }

  @action.bound
  async loadNextResults(id, type) {
    if (!this.resultsLoading) {
      this.resultsLoading = true
      this.searchError = null

      try {
        if (!type) {
          this.request = await agentMark(id)
        }
        else {
          this.request = await agentMail(id)
        }
      }
      catch(e) {
        //an error occured on search
        this.searchError = {
          message: `[loadNextResults] search error: ${e.message} http status code ${e.error.status}`,
          statusCode: e.error.status
        }
      }

      if (this.searchError == null) {
        const {data, total} = this.request
        console.info('[loadNextResults]')
        this.results = [...this.results, ...data.map(d => ({ ...d, key: d.tenderID }))]
        this.resultsCount = total
      }
      else {
        console.error(this.searchError)
        this.results = []
        this.resultsCount = 0
      }
      this.resultsLoading = false
    }
  }
}

export const distAgentStore = new DistAgent()
