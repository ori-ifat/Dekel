import { action, computed, observable, toJS } from 'mobx'
import {getAgentResults, fetchAgentFilters /*, getLastTenders, getBanners, getMoreTenders*/} from 'common/services/apiService'
import {getDefaultFilter} from 'common/utils/filter'
import {extractLabel} from 'common/utils/util'
import isObject from 'lodash/isObject'
import filter from 'lodash/filter'

class Main {
  @observable resultsLoading = false
  @observable request = {};
  @observable results = []
  @observable requestMore = {};
  @observable resultsMore = []
  @observable lastResultsPage = 0
  @observable resultsPageSize = 10
  @observable resultsCount = 0
  @observable hasMoreResults = true
  @observable banner = {};
  @observable fromRoute = false
  @observable filters = []; //chosen filters from filters component
  @observable availableFilters = [];  //all relevant filters;
  @observable selectedFilters = {};   //labels for the filters component
  @observable filtersLoading = false
  @observable requestFilters = {};
  @observable filtersError = null
  @observable initialDate = true

  @computed
  get serializedFilters() {    
    let filters = toJS(this.filters)
    //add date filter: if it did not exist already on this.filters, or as 'daysBack' on this.tags
    const reduced = filter(filters, filter => {
      return filter.field == 'inputDate' || filter.field == 'presentationDate' || filter.field == 'resultDate'
    })    
    if (reduced.length == 0){      
      const filter = getDefaultFilter(false)
      filters = [...filters, filter]
    }
    return filters
  }

  @action.bound
  applyFilters(queryFilters) {
    const filters = JSON.parse(decodeURIComponent(queryFilters))
    if (isObject(filters)) {
      this.filters.replace(filters)
    } else {
      //implement error handle
      console.error('[mainStore]applyFilters', 'could not load filters from query')
    }
  }

  @action.bound
  setSelectedFilters(label, value, more) {
    /* set the selectedFilters object - a state-like object for the filter container.
      need that because the entire object is recreated upon filter commit action */
    switch (label) {
    //case 'subsubject':
    case 'class':
      Reflect.deleteProperty(this.selectedFilters, 'classes')   //note equals to delete this.selectedFilters.prop ...
      const classes = extractLabel(value, more)
      this.selectedFilters.classes = classes
      break
    case 'publisher':
      Reflect.deleteProperty(this.selectedFilters, 'publishers')
      const publishers = extractLabel(value, more)
      this.selectedFilters.publishers = publishers
      break
    case 'area':
      Reflect.deleteProperty(this.selectedFilters, 'areas')
      const areas = extractLabel(value, more)
      this.selectedFilters.areas = areas
      break
    case 'dateField':
      Reflect.deleteProperty(this.selectedFilters, 'dateField')
      this.selectedFilters.dateField = value
      break
    case 'inputDate':
    case 'presentationDate':
    case 'resultDate':
      Reflect.deleteProperty(this.selectedFilters, 'date')
      this.selectedFilters.date = { [label]: value }
      break
    case 'searchText':
      Reflect.deleteProperty(this.selectedFilters, 'searchText')
      this.selectedFilters.searchText = value
      break
    }
  }

  @action.bound
  clearFilterLabels(keepDates = false) {
    //this.selectedFilters = {}
    if (keepDates) {
      const labels = toJS(this.selectedFilters)      
      let dateFilter, dateField
      for (const key in labels) {
        if (key == 'date') {
          dateFilter = labels[key]
        }
        else if (key == 'dateField') {
          dateField = labels[key]
        }        
      }
      this.selectedFilters = {}
      if (dateFilter) {
        this.selectedFilters.date = dateFilter
        this.selectedFilters.dateField = dateField
      }
    }
    else {
      this.selectedFilters = {}
    }
  }

  @action.bound
  clearFilters() {
    const filters = toJS(this.filters)
    const dateFilter = find(filters, filter => {
      return filter.field == 'inputDate' || filter.field == 'presentationDate' || filter.field == 'resultDate'
    })
    this.filters.clear()
    if (dateFilter) {
      this.filters.push(dateFilter)
    }
  }

  /*@action.bound
  async loadAgentResults() {
    if (!this.resultsLoading) {
      this.resultsLoading = true
      const lastSeenTenderID = -1  //future implementation - get lastSeenTenderID of logged customer
      let error = null  //if needed, make an observable
      try {
        this.request = await getLastTenders(lastSeenTenderID)
      }
      catch(e) {
        //an error occured on search
        const status = e.error ? e.error.status : -1
        console.error(`[loadAgentResults] search error: ${e.message} http status code ${status}`)
        error = e.message
      }

      if (error == null) {
        const data = this.request

        this.results = [...data.map(d => ({ ...d, key: d.tenderID }))]
        this.resultsCount = data.length
      }
      else {
        this.results = []
        this.resultsCount = 0
      }
      this.resultsLoading = false
    }
  }*/

  @action.bound
  clearResults() {
    this.results.clear()
    this.lastResultsPage = 0
    this.hasMoreResults = true
    this.resultsCount = 0
  }

  @action.bound
  async loadNextResults() {
    if (!this.resultsLoading) {
      this.resultsLoading = true
      let searchError = null

      if (this.fromRoute) {
        this.clearResults() //this will allow opacity loader to show prev results until new ones appear
      }

      const searchParams = {
        page: this.lastResultsPage + 1,
        pageSize: this.resultsPageSize,
        filters: this.serializedFilters
      }

      try {
        this.request = await getAgentResults(searchParams)
      }
      catch(e) {
        //an error occured on search
        const status = e.error ? e.error.status : -1
        searchError = {
          message: `[loadNextResults] search error: ${e.message} http status code ${status}`,
          statusCode: status
        }
      }

      if (searchError == null) {
        //if no errors occured, continue:
        //const {resultsPage: {data, total}, filtersMeta} = this.request
        const {data, total} = this.request
        //if (total > 0 && data && data.length > 0) {
        /*if (!(data.length == 0 || data.length < this.resultsPageSize)) { //use that because total returns 0
          this.lastResultsPage++
        }*/
        if (data.length > 0) {
          this.lastResultsPage++
        }
        console.info('[loadNextResults]', this.lastResultsPage, this.hasMoreResults)
        if (data) {
          this.results = [...this.results, ...data.map(d => ({ ...d, key: d.tenderID }))]
          //this.resultsCount = total   //total returns 0 from that api
          this.resultsCount = total //data.length
          this.hasMoreResults = data.length > 0 && this.results.length < this.resultsCount
          //this.hasMoreResults = !(data.length == 0 || data.length < this.resultsPageSize) //use that because total returns 0,
        }
        else {
          this.resultsCount = 0
          this.hasMoreResults = false
        }        
      }
      else {
        //error handle.
        console.error(searchError) //a flag has been raised. implement what to do with it
        //set as there is no data (actually there is none...)
        this.results = []
        //this.availableFilters = []
        this.resultsCount = 0
        this.hasMoreResults = false
      }
      this.resultsLoading = false
      this.fromRoute = false  //reset route flag
    }
  }

  @action.bound
  async loadNextFilters() {
    if (!this.filtersLoading) {
      this.filtersLoading = true
      this.filtersError = null      
      const filters = []
      //add date filter always (start empty anyway)      
      const filter = getDefaultFilter(false)
      filters.push(filter)

      try {
        this.requestFilters = await fetchAgentFilters({filters})
      }
      catch(e) {
        //an error occured on search
        this.filtersError = {
          message: `[loadNextFilters] filter search error: ${e.message} http status code ${e.error.status}`,
          statusCode: e.error.status
        }
      }

      if (this.filtersError == null) {
        console.info('[loadNextFilters]')
        this.availableFilters = this.requestFilters
      }
      else {
        console.error(this.filtersError) //a flag has been raised. implement what to do with it
        this.availableFilters = []
      }
      this.filtersLoading = false
    }
  }

  /*@action.bound
  async getBanner() {
    this.banner = await getBanners()
  }*/

  /*@action.bound
  async loadMoreTenders() {
    this.resultsLoading = true
    this.requestMore = await getMoreTenders()

    const data = this.requestMore
    this.resultsMore = [...data.map(d => ({ ...d, key: d.tenderID }))]
    this.resultsLoading = false
  }*/
}

export const mainStore = new Main()
