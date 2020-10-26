import { action, computed, observable, toJS } from 'mobx'
import {getFavorites} from 'common/services/apiService'

class Favorites {
  @observable resultsLoading = false
  @observable request = {};
  @observable results = []
  @observable searchError = null
  @observable lastResultsPage = 0
  @observable resultsPageSize = 10
  @observable resultsCount = 0
  @observable hasMoreResults = false

  @action.bound
  clearResults() {
    this.results.clear()
    this.searchError = null
    this.lastResultsPage = 0
    this.hasMoreResults = true
    this.resultsCount = 0
  }

  @action.bound
  async loadNextResults() {
    if (!this.resultsLoading) {
      this.resultsLoading = true
      this.searchError = null
      const searchParams = {
        page: this.lastResultsPage + 1,
        pageSize: this.resultsPageSize  //implement sort if needed
      }

      try {
        this.request = await getFavorites(searchParams)
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
        if (data.length > 0) {
          this.lastResultsPage++
        }
        console.info('[loadNextResults]', this.lastResultsPage)
        this.results = [...this.results, ...data.map(d => ({ ...d, key: d.tenderID }))]
        this.resultsCount = total
        this.hasMoreResults = data.length > 0 && this.results.length < this.resultsCount
      }
      else {
        console.error(this.searchError)
        this.results = []
        this.resultsCount = 0
        this.hasMoreResults = false
      }
      this.resultsLoading = false
    }
  }
}

export const favoritesStore = new Favorites()
