import { action, computed, observable, toJS } from 'mobx'
import isObject from 'lodash/isObject'
import map from 'lodash/map'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import find from 'lodash/find'
import moment from 'moment'
import {extractLabel} from 'common/utils/util'
import {/*search*/ fetchResultsPage, fetchFilters, getClasses } from 'common/services/apiService'
import {getDefaultFilter} from 'common/utils/filter'

const serializeTags = ({id, name, resType}) => {
  return resType.indexOf('_partial') > -1 ? {
    id: name,
    type: resType,
    text: name
  } : {
    id,
    type: resType,
    text: name
  }
}

class Search {
/*
  constructor() {
    console.log('new searchStore')
  }
*/
  @observable filters = []; //chosen filters from filters component
  @observable availableFilters = [];  //all relevant filters;
  @observable classes = [];  //all available classes
  @observable selectedFilters = {};   //labels for the filters component
  @observable tags = [];
  @observable sort = 'InputDate'
  @observable fromRoute = false
  @observable initialDate = true
  @observable resultsLoading = false
  @observable filtersLoading = false
  @observable classesLoading = false
  @observable hasMoreResults = true
  @observable request = {};
  @observable requestFilters = {};
  @observable results = []
  @observable searchError = null
  @observable filtersError = null
  @observable lastResultsPage = 0
  @observable resultsPageSize = 10
  @observable resultsCount = 0

  @computed
  get serializedTags() {
    let tags = toJS(this.tags)
    tags = map(tags, serializeTags)
    return JSON.stringify(tags)
  }

  //[{field:%20"TenderID",isAscending:%20true}]
  @computed
  get serializedSort() {
    let sort = toJS(this.sort)
    sort = [{field: sort, isAscending: (this.sort == 'PresentationDate')}]  //implement sort direction - from ui
    return JSON.stringify(sort)
  }

  @computed
  get serializedFilters() {
    const tags = toJS(this.tags)
    let filters = toJS(this.filters)
    //add date filter: if it did not exist already on this.filters, or as 'daysBack' on this.tags
    const reduced = filter(filters, filter => {
      return filter.field == 'inputDate' || filter.field == 'presentationDate' || filter.field == 'resultDate'
    })
    const reducedTags = filter(tags, tag => {
      return tag.resType == 'daysBack'
    })
    if ((reduced.length == 0 && reducedTags.length == 0) || (tags.length == 0 && reduced.length == 0)){ //(tags.length == 0 && filters.length == 0)) {
      //const filter = getDefaultFilter(tags.length == 0 && filters.length == 0)
      const filter = getDefaultFilter(tags.length == 0)
      filters = [...filters, filter]
    }
    return filters
  }

  @action.bound
  applySort(sort) {
    if (['PresentationDate', 'InputDate'].includes(sort)) {
      this.sort = sort
    } else {
      //implement error handle
      console.error('[searchStore]applySort', 'unknown sort value')
    }
  }

  @action.bound
  applyFilters(queryFilters) {
    const filters = JSON.parse(decodeURIComponent(queryFilters))
    if (isObject(filters)) {
      this.filters.replace(filters)
    } else {
      //implement error handle
      console.error('[searchStore]applyFilters', 'could not load filters from query')
    }
  }

  @action.bound
  applyTags(queryTags, minified = true) {
    let tags
    if (minified) {
      //get tags from json
      tags = decodeURIComponent(queryTags).replace(/"I"/g, '"id"').replace(/"N"/g, '"name"').replace(/"R"/g, '"resType"').replace(/"s"/g, '"class"').replace(/"f"/g, '"fatherClass"').replace(/"O"/g, '"orderBy"').replace(/"U"/g, '"uniqueID"')
      tags = JSON.parse(tags)
      //note: fixTags relys on this.classes. if this.classes will be empty, this will not work
      //applied a fix for that matter - see Results.js - wait for loadSubSubjects2
      this.fixTags(tags)
    }
    else {
      tags = JSON.parse(decodeURIComponent(queryTags))
      if (isObject(tags)) {
        this.tags.replace(tags)
      } else {
        //implement error handle
        console.error('[searchStore]applyTags', 'could not load tags from query')
      }
    }
  }

  @action.bound
  fixTags(tags) {
    //iterate on tags, and for classes, extract name from the classes array by id
    forEach(tags, tag => {
      if (tag.resType === 'fatherClass') {
        //find the name on the subSubjects array
        const found = find(this.classes, item => {
          return item.fatherClassID == tag.id
        })
        if (found) {
          //set the name property to the current tag
          Reflect.set(tag, 'name', found.fatherClassName)
        }
      }
      else if (tag.resType === 'class') {
        this.classes.map(fatherClass => {
          const found = find(fatherClass.classes, item => {
            return item.classID == tag.id
          })
          if (found) {
            //set the name property to the current tag
            Reflect.set(tag, 'name', found.className)
          }
        })
      }
    })
    if (isObject(tags)) {
      this.tags.replace(tags)
    } else {
      //implement error handle
      console.error('[searchStore]applyTags', 'could not load tags from query')
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
      if (this.fromRoute) {
        this.clearResults() //this will allow opacity loader to show prev results until new ones appear
      }
      const searchParams = {
        tags: this.serializedTags,
        filters: this.serializedFilters,  //toJS(this.filters),
        page: this.lastResultsPage + 1,
        pageSize: this.resultsPageSize,
        sort: this.serializedSort
      }

      try {
        //this.request = await search(searchParams)
        this.request = await fetchResultsPage(searchParams)
      }
      catch(e) {
        //an error occured on search
        this.searchError = {
          message: `[loadNextResults] search error: ${e.message} http status code ${e.error.status}`,
          statusCode: e.error.status
        }
      }

      if (this.searchError == null) {
        //if no errors occured, continue:
        //const {resultsPage: {data, total}, filtersMeta} = this.request
        const {data, total} = this.request
        if (data.length > 0) {
          this.lastResultsPage++
        }
        console.info('[loadNextResults]', this.lastResultsPage)
        this.results = [...this.results, ...data.map(d => ({ ...d, key: d.tenderID }))]
        //this.availableFilters = filtersMeta  //no drilldown - from tags only
        this.resultsCount = total
        this.hasMoreResults = data.length > 0 && this.results.length < this.resultsCount
      }
      else {
        //error handle.
        console.error(this.searchError) //a flag has been raised. implement what to do with it
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
      const tags = toJS(this.tags)
      let filters = []  //no drilldown - from tags only     
      //add date filter always (start empty anyway)
      //const filter = getDefaultFilter(tags.length == 0 && filters.length == 0)
      const filter = getDefaultFilter(tags.length == 0)
      filters = [filter]

      const searchParams = {
        tags: this.serializedTags,
        filters,
        sort: this.serializedSort
      }

      try {
        this.requestFilters = await fetchFilters(searchParams)
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

  @action.bound
  async loadSubSubjects() {
    if (!this.classesLoading) {
      this.classesLoading = true
      let searchError = null

      try {
        this.classes = await getClasses()
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
  async loadSubSubjects2() {
    //same as above with promise - to enable loading before all other async actions begin
    if (this.classes.length > 0) {
      return Promise.resolve()
    }
    let searchError = null
    return new Promise((resolve, reject) => {
      getClasses().then(res => {
        this.classes = res
        searchError = null
        console.info('[loadSubSubjects]')
        resolve()
      }).catch(error => {
        //console.log('error', error)
        searchError = {
          message: `[loadSubSubjects] search error: ${e.message} http status code ${e.error.status}`,
          statusCode: e.error.status
        }
        this.classes = []
        reject(error)   //bubble the error up - will result catch() in callee
      })
    })
  }
}

export const searchStore = new Search()
