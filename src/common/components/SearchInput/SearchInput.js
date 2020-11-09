import React, {Component} from 'react'
import { array, bool } from 'prop-types'
import  './SearchInput.scss'
import {translate} from 'react-polyglot'
import {inject, observer} from 'mobx-react'
import Select from 'react-select'
//import AsyncSelect from 'react-select/async'  //react-select v3^
import ClassesFilter from 'common/components/ClassesFilter'
import SavedSearches from './SavedSearches'
import {observable, toJS} from 'mobx'
import forEach from 'lodash/forEach'
import remove from 'lodash/remove'
import {autocomplete} from 'common/services/apiService'
import enhanceWithClickOutside from 'react-click-outside'

import DateFilter from 'components/Results/Filters/DateFilter'
import DateButtons from 'components/Results/Filters/DateButtons'
import DateCombo from './DateCombo'
import { getDefaultDates } from 'common/utils/filter'

const req = require.context('common/style/icons/', false)
const search_go = req('./search_go.svg').default

export default 
@translate()
@inject('routingStore')
@inject('searchStore')
@inject('mainStore')
@inject('recordStore')
@enhanceWithClickOutside
@observer
class SearchInput extends Component {
  static propTypes = {
    tags: array,
    isMain: bool
  }

  @observable selectedValues =[]
  @observable showSaved = false
  @observable dateField = 'inputDate'
  
  componentWillMount() {
    const {searchStore, tags} = this.props
    if (tags) this.selectedValues = tags
    this.showSaved = false
    searchStore.loadSubSubjects()
  }

  componentWillReceiveProps(nextProps) {
    const {tags} = nextProps
    this.showSaved = false
    if (tags) this.selectedValues = tags
  }

  handleClickOutside() {
    //console.log('handleClickOutside')
    this.showSaved = false
  }

  onChange = values => {
    this.selectedValues = values
    setTimeout(() => {
      this.onSearch()
    }, 150)
  }

  getOptions = (input) => {
    input = input.trim()
    return autocomplete(input).then((options) => {
      //console.log('res', options)
      if (!options) {
        return
      }
      return { options }
      //return options  //return array for react-select v3^
    })
  }

  filterOptions = (options, filterString, values) => {
    if (!filterString) {
      return []
    }
    //that function will remove values that were already selected on previous action - to eliminate duplicates
    return options.filter(option => !values.find(value => value.id + value.resType + value.name === option.id + option.resType + option.name))
  }

  optionRenderer = (item) => {
    //can be used to override the options design
    let {resType, name} = item
    const {t} = this.props

    resType = (resType)
      ? t(`search.${resType}`)
      : null

    return <div>
      <span>{name}</span>
      <span className="type">{resType}</span>
    </div>

  }

  onFocus = () => {
    if (this.selectedValues.length == 0) this.showSaved = true
  }
  /*
  onBlur = () => {
    this.showSaved = false
  }*/

  onInputKeyDown = (e) => {
    if(this.showSaved) this.showSaved = false
    if (e.keyCode === 13) {
      //ori s setTimeout to solve a bug, when search is committed before Select actually chose an item ...
      //e.preventDefault()  //fucks up the search.
      e.stopPropagation()
      setTimeout(() => {
        this.onSearch()
      }, 150) //to allow action to complete
    }
  }

  onSearch = () => {
    const { routingStore } = this.props
    const sort = 'InputDate'  //default sort. note, means that on every search action, sort will reset here
    /* remove the subSubjectName - to shorten url */
    //create a shallow copy of selectedValues - to avoid unneeded recursive operation upon change...
    const copied = this.selectedValues.slice()
    forEach(this.selectedValues, value => {
      //remove the current from the copied array
      remove(copied, val => val.uniqueID == value.uniqueID)
      //create a shallow copy of current tag - so original selectedValues will not change
      const tag = Object.assign({}, value)
      if (value.resType == 'subsubject') {
        //remove the name property
        Reflect.deleteProperty(tag, 'name')
      }
      else {
        //just encode
        //tag.Name = encodeURIComponent(tag.Name)
      }
      //add back to the copied array
      copied.push(tag)
    })
    //revert back to copied
    this.selectedValues = copied
    let payload = JSON.stringify(this.selectedValues)
    //minify the url:
    payload = payload.replace(/"id"/g, '"I"').replace(/"name"/g, '"N"').replace(/"resType"/g, '"R"').replace(/"class"/g, '"s"').replace(/"orderBy"/g, '"O"').replace(/"uniqueID"/g, '"U"')
    //note: on new search, filters should be empty
    routingStore.push(`/results/${sort}/${encodeURIComponent(payload)}/[]`)
    //routingStore.push(`/results/${sort}/${payload}/[]`)   //without full encode, stange bug occurs on items with quotes on the name
  }

  onSearchClick = () => {
    const {searchStore, recordStore} = this.props
    const sort = 'inputDate'  //default sort - see above
    const tags = JSON.stringify(this.selectedValues)
    searchStore.applySort(sort)
    searchStore.applyTags(tags, false)
    searchStore.clearFilterLabels()
    searchStore.applyFilters('[]')
    recordStore.cleanChecked()
    //searchStore.clearResults()
    searchStore.fromRoute = true  //raise route flag - behave same as on route
    searchStore.initialDate = true //raise initial date flag - for last month label
    searchStore.loadNextResults()
    searchStore.loadNextFilters()
  }

  onClear = () => {
    const { routingStore } = this.props
    const sort = 'inputDate'  //default sort.
    routingStore.push(`/results/${sort}/[]/[]`)
  }

  chooseDateField = field => {
    this.dateField = field
    //set the date field name
    const { searchStore, mainStore, isMain, t } = this.props
    const store = isMain ? mainStore : searchStore
    store.setSelectedFilters('dateField', this.dateField, t('filter.more'))
  }


  render() {
    const selectedValues = toJS(this.selectedValues)
    const {searchStore, mainStore, isMain, searchStore: {selectedFilters}, t} = this.props
    const filterStore = isMain ? mainStore : searchStore
    const dateField = selectedFilters ? selectedFilters.dateField || 'inputDate' : 'inputDate'
    const defaultDates = getDefaultDates(this.selectedValues)
    const dateValues = selectedFilters && selectedFilters.date ? selectedFilters.date[dateField] || defaultDates : defaultDates

    return (
      <div styleName="cont">
        <div className="row">
          <div className="medium-12 columns">
            <div styleName="main_wrapper">

              <div id="searchbox_wrapper" styleName="search_continer">
                <Select.Async
                  styleName="select-searchbox"
                  className="search-select"
                  name="searchbox"
                  placeholder={t('search.placeHolder')}
                  autoFocus={(this.selectedValues.length > 0)}
                  noResultsText={null}
                  searchPromptText=""
                  multi={true}
                  cache={false}
                  clearable={false}
                  loadOptions={this.getOptions}
                  optionRenderer={this.optionRenderer}
                  onChange={this.onChange}
                  onFocus={this.onFocus}
                  onInputKeyDown={this.onInputKeyDown}
                  filterOptions={this.filterOptions}
                  value={selectedValues}
                  labelKey={'name'}
                  valueKey={'uniqueID'}
                />
                {this.showSaved &&
                  <SavedSearches />
                }
              </div>

              <div styleName="date_continer">
                <div styleName="selector">
                  <DateCombo chooseDateField={this.chooseDateField} t={t} />
                </div>
                <div styleName="picker" >
                  <DateFilter
                    dateField={this.dateField}
                    chooseDateField={this.chooseDateField}
                    dateValues={dateValues}
                    store={searchStore}
                  />                
                </div>
              </div>
              <a styleName="search_btn" onClick={this.onSearchClick}><img src={search_go} styleName="search-arrow" /></a>
            </div>
            <div styleName="links_continer">
              <div styleName="reset_container">
                <div styleName="subsubjects">
                  <ClassesFilter
                    items={toJS(searchStore.classes)}
                    isTag={true}
                    store={searchStore}
                  />
                </div>
                <div styleName="clear_s">
                  <a onClick={this.onClear}>{t('search.cleanSearch')}</a>
                </div>
              </div>
              <div styleName="date_buttons">
                <DateButtons
                  dateField={this.dateField}
                  chooseDateField={this.chooseDateField}
                  store={filterStore}
                />
              </div>

            </div>
          </div>
        </div>
      </div>

    )
  }
}
