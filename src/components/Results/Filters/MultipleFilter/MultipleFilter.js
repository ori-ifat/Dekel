import React from 'react'
import { string, object, bool, array } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import filter from 'lodash/filter'
//import find from 'lodash/find'
import remove from 'lodash/remove'
//import forEach from 'lodash/forEach'
import take from 'lodash/take'
import {doFilter} from 'common/utils/filter'
//import CSSModules from 'react-css-modules'
import  './MultipleFilter.scss'

const req = require.context('common/style/icons/', false)
const editSrc = req('./icon_edit.svg').default

export default
@translate()
//@inject('searchStore')
@inject('routingStore')
@observer
class MultipleFilter extends React.Component {
  /* component for multiple values filter selection */

  static propTypes = {
    type: string,
    items: array,
    label: string,
    title: string,
    selectAll: bool,
    store: object
  }

  state = {
    open: false //use state to allow prevState implementation on componentDidUpdate
  }

  @observable open = false
  @observable type = ''
  @observable items = []
  @observable selected = []
  @observable itemLabels = []
  @observable label = ''

  /*
  componentWillMount() {
    this.init(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps)
  }*/

  componentDidMount() {
    this.init(this.props)
  }
  
  componentDidUpdate(prevProps, prevState) {
    //console.log(prevProps);
    if (!prevProps.items || prevProps.items.length === 0 || prevState.open !== this.state.open) { 
      this.init(this.props)
    }
  }

  init = (props) => {
    const {type, items, label} = props
    this.type = type
    this.label = label
    this.items = items || []
    this.sortChecked(items)
  }

  sortChecked = (items) => {
    //place checked items on top:
    const checked = filter(items, item => {
      return this.selected.includes(item.id)
    }) //<- selected items
    const unchecked = filter(items, item => {
      return !this.selected.includes(item.id)
    })  //<- the rest
    //concat:
    this.items = [...checked, ...unchecked]
  }  

  openModal = () => {
    this.setState({open: true})
  }

  closeModal = () => {
    this.setState({open: false})
  }

  cleanFilter = () => {
    const { store } = this.props
    const field = this.type
    this.selected.clear()
    this.itemLabels.clear()
    remove(store.filters, filter => filter.field === field)
    this.label = ''
    store.selectedFilters[field] = ''
    store.fromRoute = true  //raise route flag
    store.loadNextResults()
  }

  doFilter = () => {
    //commit filters
    const { store, t } = this.props
    const field = this.type
    doFilter(store, field, this.selected, this.itemLabels, true, this.closeModal, t('filter.more'))
  }

  filterItems = e => {
    //filter the checkboxes by text field value
    const {items} = this.props
    const reduced = filter(items, item => {
      return item.name.indexOf(e.target.value) > -1
    }, this)
    this.items = reduced
  }

  onCheck = e => {
    //checkbox check\uncheck event
    if (e.target.checked) {
      if (!this.selected.includes(e.target.value)) {
        this.selected.push(parseInt(e.target.value))
        this.itemLabels.push(e.target.name)
      }
    }
    else {
      remove(this.selected, id => {
        return id === parseInt(e.target.value)
      })
      remove(this.itemLabels, name => {
        return name === e.target.name
      })
    }
    //console.log(toJS(this.selected))
  }

  onCheckAll = checked => {
    if (checked) {
      this.items.map((item => {
        const id = item.id
        const name = item.name
        if (!this.selected.includes(id)) {
          this.selected.push(id)
          this.itemLabels.push(name)
        }
      }), this)
    }
    else {
      this.selected.clear()
      this.itemLabels.clear()
    }
  }

  render() {
    const {open} = this.state
    const {title, selectAll, t} = this.props
    const tileStyle = this.type != 'class' ? {marginBottom: '3px'} : {}
    return(
      <div styleName="cb-wrapper">

        {open &&
          <div className="reveal-overlay"  style={{display: 'block'}}>
            <div className="reveal" styleName="multiple-selection" style={{display: 'block'}}>
              <div styleName="">
                <h2>{title}
                  {selectAll &&
                    <div styleName="selectAll_links">
                      <a onClick={() => this.onCheckAll(true)}>{t('filter.selectAll')}</a><span styleName="sep">|</span>
                      <a onClick={() => this.onCheckAll(false)}>{t('filter.clearAll')}</a>
                    </div>
                  }
                </h2>
                <input type="text" placeholder={t('filter.search')} onChange={this.filterItems} />
                {this.type == 'class' && <div>


                </div>}
                <div style={{height: '300px', overflow: 'auto'}}>
                  {
                    this.items && this.items.map(((item, index) => {
                      const id = item.id
                      const name = item.name
                      return <div styleName="checkbox" key={index}>
                        <label styleName="cb-label">
                          <input type="checkbox"
                            styleName="checkbox"
                            checked={this.selected.includes(id)}
                            name={name}
                            value={id}
                            onChange={this.onCheck}
                          />
                          <span>{name}</span></label>
                      </div>}), this
                    )
                  }
                </div>
                <div styleName="selected">
                  {
                    this.itemLabels && take(this.itemLabels, 2).map((item, index) =>
                      <div key={index} styleName="selected-tile" style={tileStyle}>{item}</div>
                    )
                  }
                  {
                    this.itemLabels && this.itemLabels.length > 2 &&
                      <div styleName="selected-tile">{`${t('filter.more')} ${this.itemLabels.length - 2}`}</div>
                  }
                </div>
                <div styleName="button-container">
                  <a  styleName="button-cancel" onClick={this.closeModal}>{t('filter.cancel')}</a>
                  <a className="button" styleName="button-submit" onClick={this.doFilter}>{t('filter.choose')}</a>
                </div>
              </div>
            </div>
          </div>
        }
        <>
          <div styleName="title-container">
            <h4 onClick={this.openModal} styleName="filter-title">{title}</h4>            
            <a styleName="edit-link" onClick={this.openModal}><img src={editSrc} alt="" />{t('filter.edit')}</a>
            <a styleName="edit-link" onClick={this.cleanFilter}>{t('filter.clean')}</a>
          </div>
          { (!this.label || this.label == '') ?
          <div onClick={this.openModal} style={{paddingTop: '7px'}}>
            <span style={{cursor: 'pointer'}}>{title}</span>
          </div> : <div style={{paddingTop: '7px'}} onClick={this.openModal}>{ this.label }</div> }
        </>

      </div>
    )
  }
}
