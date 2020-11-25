import React from 'react'
import { object } from 'prop-types'
import { /*inject,*/ observer } from 'mobx-react'
import {observable} from 'mobx'
import { translate } from 'react-polyglot'
//import remove from 'lodash/remove'
import find from 'lodash/find'
import {doFilter} from 'common/utils/filter'
//import CSSModules from 'react-css-modules'
import  './SingleCheckFilter.scss'

export default 
@translate()
//@inject('searchStore')
@observer
class SingleCheckFilter extends React.Component {

  static propTypes = {
    items: object,
    store: object
  }

  @observable checked = false
  searching = false

  componentDidMount() {
    const {items, store} = this.props
    this.items = items
    this.isChecked(store.filters)
  }

  componentWillReceiveProps(nextProps) {
    const {items, store} = nextProps
    this.items = items
    this.isChecked(store.filters)
  }

  isChecked = (filters) => {
    //get relevant detailLevel filter (if any)
    const found = find(filters, filter => {
      return filter.field == 'hasResult'
    })
    if (found) {
      this.checked = found.values[0] === 1
    }  
  }

  doFilter = () => {
    const { store } = this.props
    doFilter(store, 'hasResult', [this.checked ? 1 : 0])
  }

  onCheck = e => {
    this.checked = e.target.checked    
    //solve performance problem: raise search flag and setTimeout for filter commit action
    if (!this.searching) {
      this.searching = true
      setTimeout(() => {
        this.searching = false
        //commit:
        this.doFilter()
      }, 200)
    }
  }

  render() {
    const {store, store: {resultsLoading}, t} = this.props
    const divStyle = resultsLoading && store.fromRoute ? 'loading' : ''
    return(
      <div styleName="tender_type">
        <h4>{t('filter.singleCheckTitle')}</h4>
        {/*!store.resultsLoading &&*/
          <div styleName={divStyle} style={{paddingBottom: '20px'}}>
            
            <div className="checkbox">
              <input type="checkbox"
                className="checkbox"
                checked={this.checked}
                name="hasResult"
                value="1"
                onChange={this.onCheck}
              />
              <span styleName="cb-label">{t('filter.singleCheckTitle')}</span>
            </div>
              
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
