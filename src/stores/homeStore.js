import { action, computed, observable, toJS } from 'mobx'
import {getMainSubjects, getAllSubjects, getSampleTenders} from 'common/services/apiService'

class Home {
  @observable resultsLoading = false
  @observable request = {};
  @observable requestSamp = {};
  @observable catResults = []
  @observable subCatResults = []
  @observable sampleTenders = []
  @observable resultsCount = 0

  @action.bound
  async loadCatResults() {
    if (!this.resultsLoading) {
      this.resultsLoading = true
      let error = null  //if needed, make an observable
      try {
        this.request = await getMainSubjects()
      }
      catch(e) {
        //an error occured on search
        console.error(`[loadCatResults] search error: ${e.message} http status code ${e.error.status}`)
        error = e.message
      }

      if (error == null) {
        const data = this.request
        this.catResults = [...data.map(d => ({ ...d, key: d.subsubjectId }))]
        //console.log(toJS(this.catResults))
      }
      else {
        this.catResults = []
      }
      this.resultsLoading = false
    }
  }

  @action.bound
  async loadSubCatResults() {
    if (!this.resultsLoading) {
      this.resultsLoading = true
      let error = null  //if needed, make an observable
      try {
        this.request = await getAllSubjects()
      }
      catch(e) {
        //an error occured on search
        console.error(`[loadSubCatResults] search error: ${e.message} http status code ${e.error.status}`)
        error = e.message
      }

      if (error == null) {
        const data = this.request
        this.subCatResults = [...data.map(d => ({ ...d, key: d.subsubjectId }))]
      }
      else {
        this.subCatResults = []
      }
      this.resultsLoading = false
    }
  }

  @action.bound
  async loadSampleTenders() {

    let error = null  //if needed, make an observable
    try {
      this.requestSamp = await getSampleTenders()
    }
    catch(e) {
      //an error occured on search
      console.error(`[loadSampleTenders] search error: ${e.message} http status code ${e.error.status}`)
      error = e.message
    }

    if (error == null) {
      const data = this.requestSamp
      this.sampleTenders = [...data.map(d => ({ ...d, key: d.infoId }))]
    }
    else {
      this.sampleTenders = []
    }    
  }

}

export const homeStore = new Home()
