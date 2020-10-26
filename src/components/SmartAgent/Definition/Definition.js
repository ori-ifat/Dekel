import React, {Component} from 'react'
import { array, object, func, bool } from 'prop-types'
import { inject, observer } from 'mobx-react'
import { observable, toJS } from 'mobx'
import { translate } from 'react-polyglot'
import find from 'lodash/find'
import Select from 'react-select'
import Loading from 'common/components/Loading/Loading'
//import CSSModules from 'react-css-modules'
import  './Definition.scss'

export default
@translate()
@inject('smartAgentStore')
@observer
class Definition extends Component {

  static propTypes = {
    isNew: bool,
    query: object,
    allQueries: array,
    onError: func,
    onSave: func,
    onClear: func,
    onDelete: func
  }

  @observable selectedValues = null
  @observable words = ''
  @observable edit = false

  componentWillMount() {
    this.initComponent(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.initComponent(nextProps)
  }

  initComponent = (props) => {
    const {isNew} = props
    if (!isNew) {
      const {query: {classID, className, searchWords}} = props
      //initialize the <Select> with the selected value:
      const query = {
        classID: classID,
        className
      }
      this.selectedValues = query
      //set the words
      this.words = searchWords
    }
  }

  updateField = e => {
    this.words = e.target.value
  }

  onChange = values => {
    this.selectedValues = values
  }

  onInputKeyDown = (e) => {
    if (e.keyCode === 13) {
      //e.preventDefault()  //fucks up the search.
      e.stopPropagation()
    }
  }

  onEdit = () => {
    this.edit = true
  }

  onSave = () => {
    const {isNew, onError, onSave, onClear, query, allQueries} = this.props
    if (this.selectedValues || (this.selectedValues == null && this.words != '')) {
      onClear()
      const found = find(allQueries, current => {
        return this.selectedValues && current.classID == this.selectedValues.classID
      })
      if (found && isNew) {
        onError(true)
      }
      else {
        const classID = this.selectedValues != null ? this.selectedValues.classID : null
        const className = this.selectedValues != null ? this.selectedValues.className : null
        const newQuery = {
          classID,
          className,
          searchWords: this.words || ''
        }
        onSave(query, newQuery)
        this.edit = false
        this.selectedValues = null
        this.words = ''
      }
    }
    else {
      onError()
    }
  }

  onCancel = () => {
    const {onClear} = this.props
    onClear()
    this.edit = false
  }

  onDelete = () => {
    const {onDelete, query} = this.props
    onDelete(query)
  }

  render() {
    //const selectedValues = toJS(this.selectedValues)  //for multiple option - an array
    const {smartAgentStore, query, isNew, t} = this.props
    const options = smartAgentStore.classes
    //console.log('query', toJS(query));
    
    return (
      <div styleName="line" >
        {this.edit ?
          <div className="grid-x">

            {!smartAgentStore.classesLoading &&
              <div styleName="fields" className="medium-3 cell">
                <Select
                  styleName="branch"
                  className="search-select"
                  menuContainerStyle={{overflowY: 'visible', height: '200px'}}
                  name="searchbox"
                  placeholder={t('agent.placeHolder')}
                  noResultsText={null}
                  searchPromptText=""
                  rtl={true}
                  multi={false}
                  cache={false}
                  clearable={false}
                  options={toJS(options)}
                  onChange={this.onChange}
                  onInputKeyDown={this.onInputKeyDown}
                  value={this.selectedValues}
                  labelKey={'className'}
                  valueKey={'classID'}
                />
              </div>
            }
            <div styleName="fields" className="medium-7 cell">
              <input type="text" name="words" styleName="word-input" defaultValue={this.words} onChange={this.updateField} />
            </div>
            <div styleName="links" className="medium-2 cell">
              <a onClick={this.onCancel}>{t('agent.cancel')}</a>&nbsp;
              <a onClick={this.onSave}>{t('agent.save')}</a>
            </div>

            {smartAgentStore.classesLoading && <Loading />}
          </div>
          :
          isNew ?
            <a styleName="add" onClick={() => this.edit = true}>{t('agent.add')}</a>
            :
            <div className="grid-x">
              <div styleName="fields" className="medium-3 cell">
                <span>{query.className}</span>
              </div>
              <div styleName="fields" className="medium-7 cell">
                {query.searchWords}
              </div>
              <div styleName="links" className="medium-2 cell">
                <a onClick={this.onEdit}>{t('agent.edit')}</a>
                <a onClick={this.onDelete}>{t('agent.delete')}</a>
              </div>

            </div>
        }
      </div>
    )
  }
}
