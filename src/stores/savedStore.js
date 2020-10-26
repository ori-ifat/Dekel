import { action, computed, observable, toJS } from 'mobx'
import { mySearches, saveSearch, unSaveSearch, delSearch } from 'common/services/apiService'

class Saved {
  @observable resultsLoading = false
  @observable saving = false
  @observable unsaving = false
  @observable deleting = false
  @observable searches = [];
  @observable searchError = null

  @action.bound
  async loadSavedSearches() {
    if (!this.resultsLoading) {
      this.resultsLoading = true
      this.searchError = null
      try {
        this.searches = await mySearches()
      }
      catch(e) {
        //an error occured on search
        this.searchError = {
          message: `[loadSavedSearches] error: ${e.message} http status code ${e.error.status}`,
          statusCode: e.error.status
        }
      }

      if (this.searchError == null) {
        console.info('[loadSavedSearches]')
      }
      else {
        console.error(toJS(this.searchError))
        this.searches = []
      }
      this.resultsLoading = false
    }
  }

  @action.bound
  async saveSearch(searchID) {
    if (!this.saving) {
      this.saving = true
      let saveError = null
      try {
        await saveSearch(searchID)
      }
      catch(e) {
        //an error occured on search
        const status = e.error ? e.error.status : -1
        saveError = {
          message: `[saveSearch] error: ${e.message} http status code ${status}`,
          statusCode: status
        }
      }

      if (saveError == null) {
        console.info('[saveSearch]')
      }
      else {
        console.error(saveError)
      }
      this.saving = false
    }
  }

  @action.bound
  async unSaveSearch(searchID) {
    if (!this.unsaving) {
      this.unsaving = true
      let saveError = null
      try {
        await unSaveSearch(searchID)
      }
      catch(e) {
        //an error occured on search
        const status = e.error ? e.error.status : -1
        saveError = {
          message: `[unSaveSearch] error: ${e.message} http status code ${status}`,
          statusCode: status
        }
      }

      if (saveError == null) {
        console.info('[unSaveSearch]')
      }
      else {
        console.error(saveError)
      }
      this.unsaving = false
    }
  }


  @action.bound
  async deleteSearch(searchID) {
    if (!this.deleting) {
      this.deleting = true
      let delError = null
      try {
        await delSearch(searchID)
      }
      catch(e) {
        //an error occured on search
        const status = e.error ? e.error.status : -1
        delError = {
          message: `[deleteSearch] error: ${e.message} http status code ${status}`,
          statusCode: status
        }
      }

      if (delError == null) {
        console.info('[deleteSearch]')
      }
      else {
        console.error(delError)
      }
      this.deleting = false
    }
  }
}

export const savedStore = new Saved()
