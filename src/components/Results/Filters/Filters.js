import React from 'react'
import { object } from 'prop-types'
import { /*inject,*/ observer } from 'mobx-react'
import {/*observable,*/ toJS} from 'mobx'
import { translate } from 'react-polyglot'
//import { getDefaultDates } from 'common/utils/filter'
//import moment from 'moment'
import find from 'lodash/find'
import filter from 'lodash/filter'
import MultipleFilter from './MultipleFilter'
import ClassesFilter from 'common/components/ClassesFilter'
//import ComboFilter from './ComboFilter'
import DetailsLevelFilter from './DetailsLevelFilter'
//import DateFilter from './DateFilter'
//import DateButtons from './DateButtons'
import SingleCheckFilter from './SingleCheckFilter'
import SearchTextFilter from './SearchTextFilter'
import Loading from 'common/components/Loading/Loading'
//import CSSModules from 'react-css-modules'
import  './Filters.scss'

//@inject('searchStore')
export default 
@translate() 
@observer 
class Filters extends React.Component {
  
  static propTypes = {
    store: object
  }  

  //@observable dateField = 'inputDate'

  componentWillMount() {
    //console.log('filters mount')
  }

  componentWillReceiveProps(nextProps) {
    //console.log('filters receive')
    const {store} = this.props
    //only if not committed: create a new filter from class tags - to mark them on MultipleFilter
    if (store.filters.length == 0) {
      //get current tags and check if there are classes in it
      const tags = filter(store.tags, item => {
        return item.resType == 'class'
      })
      //iterate on tags:
      tags.map(tag => {
        //check if a class filter exists (may be from prev iteration)
        let filter = find(store.filters, item => {
          return item.field == 'class'
        })

        if (!filter) {
          //create new
          filter = {field: 'class', values: [tag.id]}
        }
        else {
          //concat to values
          if (!filter.values.includes(tag.id)) filter.values.push(tag.id)
        }
        //merge with current
        const newFilters = [Object.assign({}, store.filters, filter)]
        //apply newFilters
        const filters = JSON.stringify(newFilters)
        store.applyFilters(filters)
      })
    }
  }

  cleanFilters = () => {
    const {store} = this.props    
    store.clearFilters()
    store.clearFilterLabels(true)
    //store.clearResults()
    store.fromRoute = true  //raise route flag
    store.initialDate = true //for last month label...
    store.loadNextResults()
    store.loadNextFilters() //cached, but will allow filters to be unchecked on child components
  }

  /*chooseDateField = field => {
    this.dateField = field
    //set the date field name
    const { store, t } = this.props
    store.setSelectedFilters('dateField', this.dateField, t('filter.more'))
  }*/

  render() {
    const {store, store: {resultsLoading, filtersLoading, selectedFilters, tags}, t} = this.props
    //note: selectedFilters - should maintain the state of child filter components, after this component recreates;
    const classes = selectedFilters ? selectedFilters.classes : ''
    const publishers = selectedFilters ? selectedFilters.publishers : ''
    const areas = selectedFilters ? selectedFilters.areas : ''
    //const dateField = selectedFilters ? selectedFilters.dateField || 'inputDate' : 'inputDate'
    //const defaultDates = getDefaultDates(tags)
    //const dateValues = selectedFilters && selectedFilters.date ? selectedFilters.date[dateField] || defaultDates : defaultDates
    const text = selectedFilters ? selectedFilters.searchText : ''    
    const classItems = store.availableFilters && (store.availableFilters.fatherClasses || [])
    const publisherItems = store.availableFilters && store.availableFilters.publishers ? 
      simplifyData(store.availableFilters.publishers, 'publisherID', 'publisherName') : 
      []
    const areaItems = store.availableFilters && store.availableFilters.areas ? 
      simplifyData(store.availableFilters.areas, 'areaID', 'areaName') : 
      []
    //console.log('filters', toJS(store.availableFilters))
    return(
      <div styleName="filter_container">
        {/*<DateFilter
          dateField={this.dateField}
          chooseDateField={this.chooseDateField}
          dateValues={dateValues}
          store={store}
        />
        <DateButtons
          dateField={this.dateField}
          chooseDateField={this.chooseDateField}
          store={store}
        />*/}
        <Spacer />
        <div styleName="filter_ttl">
          <a styleName="clean" onClick={this.cleanFilters}>{t('filter.clean')}</a>
          <h4>{t('filter.title')}:</h4>
        </div>
        <hr />
        {filtersLoading && <Loading />}
        {!filtersLoading &&

          <div>
           
            <DetailsLevelFilter
              items={store.availableFilters.detailLevels}
              store={store}
            />
            <SingleCheckFilter 
              store={store}
            />
            <SearchTextFilter
              field="tender2numericclass"
              title={t('filter.numericClass')}
              text={text}
              store={store}
            />
            <Spacer />
            <Spacer />
            <MultipleFilter
              type="area"
              items={areaItems}
              label={areas}
              title={t('filter.areasTitle')}
              selectAll={true}
              store={store}
            />
            <Spacer />
            <MultipleFilter
              type="publisher"
              items={publisherItems}
              label={publishers}
              title={t('filter.publishersTitle')}
              selectAll={false}
              store={store}
            />
            <Spacer /> 
            <ClassesFilter
              items={toJS(classItems)}
              label={classes}
              store={store}
            />            
            <Spacer />
            <SearchTextFilter
              field="searchtext"
              title={t('filter.searchText')}
              text={text}
              store={store}
            />

          </div>
        }
      </div>
    )
  }
}

const Spacer = ({}) => {
  return <div style={{marginTop: '2rem'}}></div>
}

const simplifyData = (original, idProp, nameProp) => {
  return original.map(item => {
    return { id: item[idProp], name: item[nameProp] }
  })
}
