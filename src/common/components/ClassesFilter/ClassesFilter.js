import React from 'react'
import { string, bool, array, func, object } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import filter from 'lodash/filter'
import find from 'lodash/find'
import remove from 'lodash/remove'
import take from 'lodash/take'
import {filterClasses, onFatherCheck, removeFather, removeChildren} from 'common/utils/filter'
import FatherLink  from './FatherLink'
import forEach from 'lodash/forEach'
import  './ClassesFilter.scss'

const req = require.context('common/style/icons/', false)
const editSrc = req('./icon_edit.svg').default

export default
@translate()
//@inject('searchStore')
@inject('routingStore')
@observer
 class ClassesFilter extends React.Component {
  /* component for multiple values filter\tag selection for classes */

  static propTypes = {
    items: array,
    label: string,
    isTag: bool,
    isAgent: bool,
    onSelect: func,
    store: object
  }

  state = {
    open: false //use state to allow prevState implementation on componentDidUpdate
  }
  
  @observable items = []
  @observable selected = []
  @observable itemLabels = []
  @observable label = ''

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
    const {items, label, isTag} = props
    this.items = items
    this.label = label
    //console.log('items', toJS(items));  
    if (isTag) { 
      this.onCheckAll(false)
      this.checkClasses('class')   //subsubject -> tag crap
      this.checkClasses('fatherClass') 
    }
    this.sortChecked(items)
  }

  //implementation is unclear... 
  sortChecked = (items) => {
    //place checked items on top:
    const checked = filter(items, item => {
      return this.inSelected(item.fatherClassID, 'fatherClass')
    }) //<- selected items
    const unchecked = filter(items, item => {
      return !this.inSelected(item.fatherClassID, 'fatherClass')
    })  //<- the rest
    //concat:
    this.items = [...checked, ...unchecked]
  }

  checkClasses = (type) => {
    //check if store filters contain class filter
    const {store, t} = this.props
    //console.log(toJS(store.tags));
    //find it on current filters
    const tags = filter(store.tags, tag => {
      return tag.resType == type
    })
    if (tags.length > 0) {
      //iterate on values
      tags.map(tag => {
        if (!this.inSelected(tag.id, type)) {
          //add id if it is not there
          this.selected.push({id: tag.id, type})          
          this.itemLabels.push({name: tag.name, type})
          
          let labels = ''
          this.itemLabels.map(label => {
            labels += `${label.name},`
          })
          //update the 'selectedFilters' object on wrapper            
          //update current label - somehow it is not affected
          this.label = labels.substr(0, labels.length - 1)          
        }
      })
    }
  }
  
  openModal = () => {    
    this.setState({open: true})
  }

  closeModal = () => {    
    this.setState({open: false})
  }

  cleanFilter = () => {
    const { store } = this.props
    this.selected.clear()
    this.itemLabels.clear()
    remove(store.filters, filter => filter.field === 'class' || filter.field === 'fatherClass')
    this.label = ''
    store.selectedFilters.classes = ''
    store.fromRoute = true  //raise route flag
    store.loadNextResults()
  }
  
  doFilter = () => {
    const { store, isTag, isAgent, onSelect, t } = this.props
    //get the label names, without types
    const labels = this.itemLabels.map(label => label.name)
    if (isTag) {
      //commit tag search.        
      //subsubject -> tag crap
      //subsubjects: act like a search, not like a filter ...
      const tags = this.selected.map((item, index) => {      
        return {I: item.id, R: item.type, U: parseFloat(`${item.id}.1`)}  //minified version
      })
      //route list SearchInput, to enable a new search
      const { routingStore } = this.props
      const sort = 'InputDate'  //default sort. note, means that on every search action, sort will reset here
      remove(store.tags, tag => {
        return tag.resType === 'class' || tag.resType === 'fatherClass'
      })
      const newTags = [...store.tags, ...tags]
      const payload = JSON.stringify(newTags)
      const filters = JSON.stringify([]) //...(store.filters)
      routingStore.push(`/results/${sort}/${payload}/${filters}`)
      this.closeModal()
    }
    else if (isAgent) {
      //find selected classes (should be only classes in this mode)
      const classes = filter(this.selected, item => item.type === 'class')
      forEach(classes, clsItem => {
        //fix the selected - add the name
        store.classes.map(fatherClass => {
          //find relevant on store classes
          const found = find(fatherClass.classes, item => {
            return item.classID === clsItem.id
          })
          if (found) {
            //set the name property to the current class item
            Reflect.set(clsItem, 'name', found.className)
          }
        })
      })
      //console.log('classes after', classes);
      onSelect(classes, labels, t('filter.more'))
      this.closeModal()
    }
    else {
      //commit filter action.
      //get the classes and fatherclasses
      const classes = filter(this.selected, item => item.type === 'class')
      const fatherClasses = filter(this.selected, item => item.type === 'fatherClass')
      //arrays for ids of classes and fatherclasses
      const classIDs = []
      const fatherClassIDs = []
      //iterate through classes and fatherclasses, and push selected ids to arrays
      classes.map(item => classIDs.push(item.id))
      fatherClasses.map(item => fatherClassIDs.push(item.id))
      //create new filters array
      const newFilters = []
      //each object in filters array has field and values properties. { field: 'fieldName', values: [array of values]}
      //add classes
      if (classIDs.length > 0) {
        newFilters.push({field: 'class', values: classIDs})
      }
      //add fatherclasses
      if (fatherClassIDs.length > 0) {
        newFilters.push({field: 'fatherClass', values: fatherClassIDs})
      }
      //do filter action
      filterClasses(store, newFilters, labels, this.closeModal, t('filter.more'))
    }
  }
  
  filterItems = e => {
    //filter the checkboxes by text field value
    const {items} = this.props
    //filter the fatherclasses and classes by name
    const reduced = filter(items, item => {
      if (item.fatherClassName.indexOf(e.target.value) > -1) {
        return true
      }
      else {
        const found = find(item.classes, child => child.className.indexOf(e.target.value) > -1)        
        return found !== undefined
      }
    }, this)
    //filter further - remove unnecessary classes from the fathers
    const reducedMore = reduced.map(item => {
        //create a shallow copy to avoid changing the real item (props items)
        const itemCopy = Object.assign({}, {...item})
        itemCopy.classes = filter(item.classes, child => child.className.indexOf(e.target.value) > -1)   
        return itemCopy
    }, this)
    this.items = reducedMore
  }
  
  inSelected = (id, type) => {
    const found = find(this.selected, item => item.id === id && item.type === type)
    return found !== undefined
  }
  
  onCheck = (e, type) => {
    //checkbox check\uncheck event
    if (e.target.checked) {
      if (!this.inSelected(e.target.value, type)) {
        this.selected.push({id: parseInt(e.target.value), type})
        this.itemLabels.push({name: e.target.name, type})
        //handle children - check all child classes
        //onFatherCheck(type, e.target.name, parseInt(e.target.value), 'add', 
        //  this.inSelected, this.items, this.selected, this.itemLabels)
      }

      if (type === 'class') {
        //find the father and uncheck it
        removeFather(this.items, e.target.value, this.inSelected, this.selected, this.itemLabels)
      }
      else {
        removeChildren(this.items, e.target.value, this.selected, this.itemLabels)
      }
    }
    else {      
      remove(this.selected, selectedItem => selectedItem.id === parseInt(e.target.value) && selectedItem.type === type)
      remove(this.itemLabels, label => label.name === e.target.name && label.type === type)  
      //handle children - remove all child classes
      //onFatherCheck(type, e.target.name,  parseInt(e.target.value), 'remove', 
      //  this.inSelected, this.items, this.selected, this.itemLabels)
      
      if (type === 'class') {
        //find the father and uncheck it
        removeFather(this.items, e.target.value, this.inSelected, this.selected, this.itemLabels)
      }
      else {
        //uncheck all children
        removeChildren(this.items, e.target.value, this.selected, this.itemLabels)
      }
    }
    //console.log(toJS(this.selected))
    //console.log(toJS(this.itemLabels))
  }  

  selectChildren = (checked, name, value) => {
    const action = checked ? 'add' : 'remove'
    if (checked) {
      //remove the father.
      remove(this.selected, selectedItem => selectedItem.id === parseInt(value) && selectedItem.type === 'fatherClass')
      remove(this.itemLabels, label => label.name === name && label.type === 'fatherClass')
    }
    onFatherCheck('fatherClass', name,  parseInt(value), action, 
      this.inSelected, this.items, this.selected, this.itemLabels)
  }
  
  onCheckAll = checked => {
    if (checked) {
      this.items.map((item => {
        //add the fatherClasses
        const id = item.fatherClassID
        const name = item.fatherClassName
        if (!this.inSelected(id, 'fatherClass')) {
          this.selected.push({id, type: 'fatherClass'})
          this.itemLabels.push({name, type: 'fatherClass'})
        }
        //add the child classes
        /*item.classes.map(classItem => {
          const id = classItem.classID
          const name = classItem.className
          if (!this.inSelected(id, 'class')) {
            this.selected.push({id, type: 'class'})
            this.itemLabels.push({name, type: 'class'})
          }
        })*/
      }), this)
    }
    else {
      this.selected.clear()
      this.itemLabels.clear()
    }
  }

  render() {
    const {isTag, isAgent, t} = this.props
    const {open} = this.state
    const title = t('filter.classesTitle')
    const tileStyle = {}
    return(
      <div styleName="cb-wrapper">

        { open &&
          <div className="reveal-overlay"  style={{display: 'block'}}>
            <div className="reveal" styleName="multiple-selection" style={{display: 'block'}}>
              <div styleName="">
                <h2>{title}
                  <div styleName="selectAll_links">
                    {!isAgent && <React.Fragment><a onClick={() => this.onCheckAll(true)}>{t('filter.selectAll')}</a><span styleName="sep">|</span></React.Fragment>}
                    <a onClick={() => this.onCheckAll(false)}>{t('filter.clearAll')}</a>
                  </div>
                </h2>
                <input type="text" placeholder={t('filter.search')} onChange={this.filterItems} />
                <div>
                </div>
                <div style={{height: '300px', overflow: 'auto'}}>
                  {
                    this.items.map(((item, index) => {
                      const id = item.fatherClassID
                      const name = item.fatherClassName
                      const isChecked = this.inSelected(id, 'fatherClass')
                      const classes = item.classes.map((classItem, index2) => {
                        const clsId = classItem.classID
                        const clsName = classItem.className
                        const isClsChecked = this.inSelected(clsId, 'class')
                        return <div styleName="checkbox" key={index2}>
                          <label styleName="cb-label">
                            <input type="checkbox"
                              styleName="checkbox"
                              checked={isClsChecked}
                              name={clsName}
                              value={clsId}
                              onChange={(e) => this.onCheck(e, 'class')}
                            />
                            <span>{clsName}</span></label></div>})
                      
                      return <div styleName="checkbox" key={index}>
                        <span style={{display: 'flex'}}>
                          <label styleName="cb-label" style={{color: '#ed1d24', fontWeight: 'bold'}}>
                            {!isAgent && <input type="checkbox"
                              styleName="checkbox"
                              checked={isChecked}
                              name={name}
                              value={id}
                              onChange={(e) => this.onCheck(e, 'fatherClass')}
                            />}
                            <span>{name}</span>
                          </label>
                          <FatherLink
                              key={`fk_${index}`}
                              isChecked={!isChecked}
                              name={name}
                              value={id}
                              onChange={this.selectChildren}
                            />
                        </span>
                        <div style={{marginRight: '17px'}}>{classes}</div>
                      </div>}), this
                    )
                  }
                </div>
                <div styleName="selected">
                  {
                    take(this.itemLabels, 2).map((item, index) =>
                      <div key={index} styleName="selected-tile" style={tileStyle}>{item.name}</div>
                    )
                  }
                  {
                    this.itemLabels.length > 2 &&
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
        {isTag ?
          <div>
            <a onClick={this.openModal}>{title}</a>
          </div>
          : 
          isAgent ?
          <div onClick={this.openModal} styleName="agent-label-container">            
            <a><img src={editSrc} alt="" />{title}</a>
            <span>{ this.label }</span>
          </div>
          :
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
        }
      </div>
    )
  }
}