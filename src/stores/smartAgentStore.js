import { action, computed, observable, toJS } from 'mobx'
import {getAgentSettings, getSubSubjects, updateAgentSettings, isIfatUser, agentEstimate, testLucene} from 'common/services/apiService'

class SmartAgent {
  @observable resultsLoading = false
  @observable request = {};
  @observable results = {}
  @observable searchError = null
  @observable classesLoading = false
  @observable classes = []
  @observable settingsLoading = false
  @observable settingsData = -1
  @observable isIfat = {};
  @observable ifatUser = false
  @observable userDataLoading = false
  @observable estimatedDataLoading = false
  @observable estimation = {}
  @observable estimatedCount = -1
  @observable textDataLoading = false
  @observable textReq = {}
  @observable text = ''

  @action.bound
  async loadAgentSettings() {
    if (!this.resultsLoading) {
      this.resultsLoading = true
      this.searchError = null

      try {
        this.request = await getAgentSettings()
      }
      catch(e) {
        //an error occured on search
        this.searchError = {
          message: `[loadAgentSettings] search error: ${e.message} http status code ${e.error.status}`,
          statusCode: e.error.status
        }
      }

      if (this.searchError == null) {
        console.info('[loadAgentSettings]')
        this.results = this.request
      }
      else {
        console.error(this.searchError)
        this.results = {}
      }
      this.resultsLoading = false
    }
  }

  @action.bound
  async loadSubSubjects() {
    if (!this.classesLoading) {
      this.classesLoading = true
      let searchError = null

      try {
        this.classes = await getSubSubjects()
      }
      catch(e) {
        //an error occured on search
        searchError = {
          message: `[loadSubSubjects] search error: ${e.message} http status code ${e.error.status}`,
          statusCode: e.error.status
        }
      }

      if (searchError == null) {
        console.info('[loadSubSubjects]')
      }
      else {
        console.error(searchError)
        this.classes = []
      }
      this.classesLoading = false
    }
  }

  @action.bound
  async updateSettings(settings) {
    if (!this.settingsLoading) {
      this.settingsLoading = true
      let searchError = null

      try {
        this.settingsData = await updateAgentSettings(settings)
      }
      catch(e) {
        //an error occured on search
        searchError = {
          message: `[updateSettings] search error: ${e.message} http status code ${e.error.status}`,
          statusCode: e.error.status
        }
      }

      if (searchError == null) {
        console.info('[updateSettings]', this.settingsData)
      }
      else {
        console.error(searchError)
      }
      this.settingsLoading = false
    }
  }

  @action.bound
  async checkUser() {
    if (!this.userDataLoading) {
      this.userDataLoading = true
      let error = false

      try {
        this.isIfat = await isIfatUser()
      }
      catch(e) {
        //an error occured on search
        console.error(`[checkUser] search error: ${e.message} http status code ${e.error.status}`)
        error = true
      }

      if (!error) {
        console.info('[checkUser]')
        this.ifatUser = this.isIfat
      }
      else {
        this.ifatUser = false
      }
      this.userDataLoading = false
    }
  }

  @action.bound
  async checkEstimation(settings) {
    if (!this.estimatedDataLoading) {
      this.estimatedDataLoading = true
      this.estimatedCount = -1
      let error = false

      try {
        this.estimation = await agentEstimate(settings)
      }
      catch(e) {
        //an error occured on search
        console.error(`[checkEstimation] search error: ${e.message} http status code ${e.error.status}`)
        error = true
      }

      if (!error) {
        console.info('[checkEstimation]')
        this.estimatedCount = this.estimation.count
      }
      else {
        this.estimatedCount = -1
      }
      this.estimatedDataLoading = false
    }
  }

  @action.bound
  async compareText(word, compareTo) {
    if (!this.textDataLoading) {
      this.textDataLoading = true
      this.text = ''
      let error = false

      try {
        this.textReq = await testLucene(word, compareTo)
      }
      catch(e) {
        //an error occured on search
        console.error(`[compareText] search error: ${e.message} http status code ${e.error.status}`)
        error = true
      }

      if (!error) {
        console.info('[compareText]')
        this.text = this.textReq.text
      }
      else {
        this.text = ''
      }
      this.textDataLoading = false
    }
  }

}

export const smartAgentStore = new SmartAgent()
