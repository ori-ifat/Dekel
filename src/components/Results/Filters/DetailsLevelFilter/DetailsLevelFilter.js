import React from 'react'
import { object } from 'prop-types'
import { /*inject,*/ observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
//import filter from 'lodash/filter'
import remove from 'lodash/remove'
import find from 'lodash/find'
import {doFilter} from 'common/utils/filter'
//import CSSModules from 'react-css-modules'
import  './DetailsLevelFilter.scss'

export default 
@translate()
//@inject('searchStore')
@observer
class DetailsLevelFilter extends React.Component {

  static propTypes = {
    items: object,
    store: object
  }

  @observable items = []
  @observable selected = []
  searching = false

  componentDidMount() {
    //console.log('mount');    
    const {items, store} = this.props
    this.items = items
    this.addSelected(store.filters, true)
  }

  componentWillReceiveProps(nextProps) {
    //console.log('props');
    const {items, store} = nextProps
    this.items = items
    this.addSelected(store.filters)
  }

  addSelected = (filters, selectAll = false) => {
    // ** selectAll is a flag to allow adding all items to selected for initial search.
    //get relevant detailLevel filter (if any)
    const detailLevels = find(filters, filter => {
      return filter.field == 'detailslevel'
    })
    //iterate on items. add to selected the ones that were already filtered (or all, if none was) -
    //to check relevant on open\after filter action
    this.items && this.items.map(item => {
      //if (!this.selected.includes(item.detailLevelID) &&
      //  (detailLevels == undefined || detailLevels.values.includes(item.detailLevelID))) {
      if (!this.selected.includes(item.detailLevelID) && (detailLevels && detailLevels.values.includes(item.detailLevelID) || selectAll)) {
        this.selected.push(item.detailLevelID)
      }
    })
  }

  doFilter = () => {
    const { store } = this.props
    doFilter(store, 'detailslevel', this.selected)
  }

  onCheck = e => {
    if (e.target.checked) {
      if (!this.selected.includes(e.target.value)) {
        this.selected.push(parseInt(e.target.value))
      }
    }
    else {
      remove(this.selected, id => {
        return id === parseInt(e.target.value)
      })
    }
    //console.log(toJS(this.selected))
    //solve performance problem: raise search flag and setTimeout for filter commit action
    if (!this.searching) {
      this.searching = true
      setTimeout(() => {
        this.searching = false
        //commit:
        this.doFilter()
      }, 1000)
    }
  }

  render() {
    const {store, store: {resultsLoading}, t} = this.props
    const divStyle = resultsLoading && store.fromRoute ? 'loading' : ''
    return(
      <div styleName="tender_type">
        <h4>{t('filter.tenderTypeTitle')}</h4>
        {/*!store.resultsLoading &&*/
          <div styleName={divStyle} style={{paddingBottom: '20px'}}>
            {
              this.items && this.items.map(((item, index) =>
                <div className="checkbox" key={index}>
                  <input type="checkbox"
                    className="checkbox"
                    checked={this.selected.includes(item.detailLevelID)}
                    name={item.detailLevelName}
                    value={item.detailLevelID}
                    onChange={this.onCheck}
                  />
                  <span styleName="cb-label">{item.detailLevelName}</span>
                </div>), this
              )
            }
          </div>
        }
        {store.resultsLoading &&  //mask the checkboxes when loading - for opacity loader
          <div styleName="loading-mask">
            &nbsp;
          </div>
        }
      </div>
    )
  }
}
