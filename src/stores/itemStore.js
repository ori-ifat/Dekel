import { action, computed, observable, toJS } from 'mobx'
import { getTender } from 'common/services/apiService'

class Item {
  @observable resultsLoading = false
  @observable item = {};
  @observable searchError = null

  @action.bound
  async loadTender(tenderID, mode) {
    return new Promise((resolve, reject) => {
      getTender(tenderID, mode).then(item => {
        this.item = item
        this.searchError = null
        console.info('[loadTender]', tenderID)
        resolve()
      }).catch(error => {
        //console.log('error', error)
        this.searchError = {
          message: `[loadTender] error: ${error.message ? error.message : ''}`,
          statusCode: error.error && error.error.status ? error.error.status : -1
        }
        this.item = {}
        reject(error)   //bubble the error up - will result catch() in callee
      })
    })
  }

  /*  //caused problems when redirected from LoginDialog
  @action.bound
  async loadTender_(tenderID) {
    if (!this.resultsLoading) {
      this.resultsLoading = true
      try {
        this.item = await getTender(tenderID)
      }
      catch(e) {
        //an error occured on search
        this.searchError = {
          message: `[loadTender] error: ${e.message} http status code ${e.error && e.error.status ? e.error.status : -1}`,
          statusCode: e.error && e.error.status ? e.error.status : -1
        }
      }

      if (this.searchError == null) {
        console.info('[loadTender]', tenderID)
      }
      else {
        console.error(toJS(this.searchError))
        this.item = {}
      }
      this.resultsLoading = false
    }
  }*/
}

export const itemStore = new Item()
