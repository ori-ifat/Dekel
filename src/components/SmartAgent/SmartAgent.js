import React, {Component} from 'react'
import { inject, observer } from 'mobx-react'
import { observable, toJS} from 'mobx'
import {translate} from 'react-polyglot'
import moment from 'moment'
import remove from 'lodash/remove'
import find from 'lodash/find'
import sortBy from 'lodash/sortBy'
import SearchInput from 'common/components/SearchInput'
import ClassesFilter from 'common/components/ClassesFilter'
import {checkEmail, checkPhone} from 'common/utils/validation'
import {publishTender, clearCache} from 'common/services/apiService'
import Definition from './Definition'
import NotLogged from 'common/components/NotLogged'
import ReactTooltip from 'react-tooltip'
import { Select } from 'antd'

import  './smartAgent.scss'

const { Option } = Select

export default
@translate()
@inject('searchStore')
@inject('accountStore')
@inject('smartAgentStore')
@observer
class SmartAgent extends Component {

  @observable sent = false
  @observable status = ''
  @observable definitionError = false
  @observable email = ''
  @observable phone = ''
  @observable frequencies = []
  @observable classes = []
  @observable newClasses = []
  @observable areas = []
  @observable contacts = []
  @observable word = ''
  @observable searchWords = ''
  @observable compareTo = ''
  @observable classLabels = ''
  //@observable alsoResult = 0
  @observable results = 1

  componentWillMount() {
    const {smartAgentStore, showNotification} = this.props
    smartAgentStore.loadAgentSettings().then(() => {
      this.frequencies = smartAgentStore.results.frequencies.filter(frequency => frequency.frequencySelected == 1)
      this.areas = smartAgentStore.results.areas.filter(area => area.areaSelected == 1)
      this.classes = smartAgentStore.results.classes
      //this.alsoResult = smartAgentStore.results.alsoResult
      this.results = smartAgentStore.results.results
      this.contacts = smartAgentStore.results.contacts
      this.email = smartAgentStore.results.contacts.length > 0 ? smartAgentStore.results.contacts[0].email : ''
      this.phone = smartAgentStore.results.contacts.length > 0 ? smartAgentStore.results.contacts[0].cellular : ''
    })
    smartAgentStore.loadSubSubjects()
    smartAgentStore.checkUser()
    showNotification(true)
  }

  onInputChange = e => {
    switch (e.target.name) {
    case 'email':
      this.email = e.target.value
      break
    case 'phone':
      this.phone = e.target.value
      break
    }
    //console.log(this.email, this.phone)
  }

  onRadioCheck = e => {
    this.frequencies.clear()
    const val = e.target.value.split('_')
    this.frequencies.push({
      frequencyID: parseInt(val[0]),
      frequencyName: val[1],
      frequencySelected: 1
    })
    //console.log(toJS(this.frequencies))
  }

  onCheck = e => {
    if(e.target.checked){
      const found = find(this.areas, area => {
        return area.areaID === parseInt(e.target.value)
      })
      if (!found) {
        this.areas.push({
          areaID: parseInt(e.target.value),
          areaName: e.target.name,
          areaSelected: 1
        })
      }
    }
    else {
      remove(this.areas, area => {
        return area.areaID === parseInt(e.target.value)
      })
    }
    //console.log(toJS(this.areas))
  }
 
  handleChange = (value) => {
    //console.log(`selected ${value}`);
    this.results = value
  }

  onSelectClasses = (classes, labels, more) => {
    //console.log('onSelectClasses', toJS(classes), labels);
    this.newClasses = classes
    const label = labels.length > 2 ? `${labels.slice(0, 2).join(',')  } ${more} ${labels.length - 2}` : labels.join(',')
    //console.log('label', label)
    this.classLabels = label
  }

  /*onCheckResult = e => {
    this.alsoResult = e.target.checked ? 1 : 0
  }*/

  onQuerySave = (query, newQuery) => {
    if (query) this.onDelete(query)
    this.classes.push(newQuery)
    this.classes = sortBy(this.classes, query => {      
      return query.classesName
    })
    //console.log(toJS(this.classes))
  }

  saveQueries = () => {
    //console.log(this.newClasses);
    const classes = this.newClasses.map(clsItem => {
      const item = {
        classID: clsItem.id,
        className: clsItem.name, 
        searchWords: this.searchWords
      }
      return item
    })
    this.classes = [...this.classes, ...classes]
    //console.log('new', toJS(this.classes))
  }

  onSave = () => {
    const {smartAgentStore, t} = this.props
    this.sent = false
    this.status = ''
    this.definitionError = false
    let errors = ''
    /*  //allow save without mail or phone
    if (this.email == '' && this.phone == '') {
      errors += `${t('agent.enterEmailOrPhone')}; `
    }*/
    if (!checkEmail(this.email, true)) {
      errors += `${t('agent.emailNotValid')}; `
    }
    else if (!checkPhone(this.phone, true)) {
      errors += `${t('agent.phoneNotValid')}; `
    }

    if (errors != '') {
      this.status = errors
    }
    else {
      //send data
      const data = {        
        classes: toJS(this.classes),
        areas: toJS(this.areas),
        frequencies: toJS(this.frequencies),
        results: this.results, //alsoResult: this.alsoResult,
        cellulars: toJS(this.phone) || '',
        emails: toJS(this.email) || ''
      }
      //console.log(data)
      smartAgentStore.updateSettings(data)
        .then(res => {
          //show a message
          clearCache()
          this.sent = true
          this.status = t('agent.sentSuccessfully')
          console.log(res, this.sent, this.status)
        })
    }
  }

  onDelete = (query) => {
    const found = find(this.classes, current => {
      return current.classID == query.classID
      //&& current.SearchWords == query.SearchWords
    })

    if (found) {
      remove(this.classes, current => {
        return current.classID == query.classID
        //&& current.SearchWords == query.SearchWords
      })
    }
    //console.log(toJS(this.classes))
  }

  onError = (isDuplicate) => {
    const {t} = this.props
    //init:
    this.sent = false
    this.status = ''
    this.definitionError = true
    if (!isDuplicate) {
      this.status = t('agent.cannotSaveDefinition')
    }
    else {
      this.status = t('agent.duplicateDefinition')
    }
  }

  clearErrors = () => {
    this.sent = false
    this.status = ''
  }

  checkCounts = () => {
    const {smartAgentStore} = this.props
    const data = {      
      classes: toJS(this.classes),
      areas: toJS(this.areas),
      frequencies: toJS(this.frequencies),
      results: this.results, //alsoResult: this.alsoResult,
      cellulars: toJS(this.phone) || '',
      emails: toJS(this.email) || ''
    }
    //console.log(data)
    smartAgentStore.checkEstimation(data) /*
      .then(res => {
        //show a message
        this.estimationCount = res
      })*/
  }

  updateField = e => {
    e.target.name === 'word' ? this.word = e.target.value : 
    e.target.name === 'searchWords' ? this.searchWords = e.target.value :
    this.compareTo = e.target.value
  }

  compareText = () => {
    const {smartAgentStore} = this.props
    smartAgentStore.compareText(this.word, this.compareTo)
  }

  render() {
    const {searchStore, accountStore: {profile}, smartAgentStore: {resultsLoading, results, query, ifatUser, estimatedCount, text}, t} = this.props
    const style = this.sent ? 'sent' : 'errors'
    const defaultEmail = results && results.contacts && results.contacts.length > 0 ? results.contacts[0].email : ''
    const defaultPhone = results && results.contacts && results.contacts.length > 0 ? results.contacts[0].cellular : ''
    const toolTipData = ifatUser ? '' : t('agent.readOnly')    
    
    return (
      <div>
        <div styleName="search-div" >
          <SearchInput />
        </div>
        <div className="row" styleName="title-container">
          <div className="column large-12">
            <h1 styleName="title" data-tip={toolTipData}>{t('agent.title')}</h1>
          </div>
        </div>
        <div className="row">
          <div className="column large-12">
            {profile ?
              <div styleName="wrapper">
                {!resultsLoading &&
                <div>
                  <div className="grid-x">
                    <div styleName="ttl_container" className="medium-3 cell">
                      <h4>{t('agent.reminderTime')}</h4>
                    </div>
                    <div styleName="agent_content" className="medium-9 cell">
                      {results.frequencies.map((frequency, index) =>
                        <div key={index}>
                          <input type="radio"
                            name="Frequencies"
                            value={`${frequency.frequencyID}_${frequency.frequencyName}`}
                            defaultChecked={frequency.frequencySelected}
                            onClick={this.onRadioCheck}
                          />
                          {frequency.frequencyName}
                        </div>)
                      }
                    </div>
                  </div>

                  <div className="grid-x">
                    <div styleName="ttl_container" className="medium-3 cell">
                      <h4>{t('agent.destination')}</h4>
                    </div>
                    <div styleName="agent_content" className="medium-9 cell">
                      <span>{t('agent.email')}:</span>
                      <input type="email"
                        name="email"
                        styleName="input-value"
                        onChange={this.onInputChange}
                        defaultValue={defaultEmail}
                      />
                      <span>{t('agent.phone')}:</span>
                      <input type="text"
                        name="phone"
                        styleName="input-value"
                        onChange={this.onInputChange}
                        defaultValue={defaultPhone}
                      />
                    </div>
                  </div>

                  <div className="grid-x">
                    <div styleName="ttl_container" className="medium-3 cell">
                      <h4>{t('agent.queries')}</h4>
                    </div>

                    <div styleName="queries" className="medium-9 cell" >
                      <div className="grid-x">
                        <div className="medium-3 cell">
                          <ClassesFilter
                            items={toJS(searchStore.classes)}
                            label={this.classLabels}
                            isAgent={true}
                            onSelect={this.onSelectClasses}
                            store={searchStore}
                          /> 
                        </div>
                        <div className="medium-5 cell">
                          <input 
                            type="text" 
                            name="searchWords" 
                            styleName="word-input" 
                            value={this.searchWords} 
                            onChange={this.updateField}
                            placeholder={t('agent.wordsPlaceHolder')}
                          />
                        </div>
                        <div className="medium-4 cell">
                          <button 
                            className="left" 
                            styleName="button-submit" 
                            onClick={this.saveQueries} 
                            style={{marginRight: '25px'}}
                          >{t('agent.definitionSubmit')}</button>
                        </div>
                      </div>
                      <div className="grid-x" style={{paddingTop: '30px'}}>
                        <div className="medium-4 cell">
                          <h4>{t('agent.branch')}</h4>
                        </div>
                        <div className="medium-8 cell">
                          <h4>{t('agent.words')}</h4>
                        </div>
                      </div>
                    {this.classes.map((query, index) => 
                      <div styleName="line" key={index}>
                        <div className="grid-x">
                          <div className="medium-4 cell" styleName="fields" >
                            <span>{query.className}</span>
                          </div>
                          <div className="medium-4 cell" styleName="fields" >
                            {query.searchWords} 
                          </div>
                          <div className="medium-4 cell" styleName="links">
                            <a onClick={() => this.onDelete(query)}>{t('agent.delete')}</a>
                          </div>
                        </div>
                      </div>)
                      }
                      
                      
                      {/*<div className="grid-x">
                        <div className="medium-3 cell">
                          <h4>{t('agent.branch')}</h4>
                        </div>
                        <div className="medium-9 cell">
                          <h4>{t('agent.words')}</h4>
                        </div>
                      </div>

                      {this.classes.map((query, index) =>
                        <Definition
                          key={index}
                          query={query}
                          allQueries={toJS(this.classes)}
                          onError={this.onError}
                          onSave={this.onQuerySave}
                          onDelete={this.onDelete}
                          onClear={this.clearErrors}
                        />)
                      }
                      <Definition
                        isNew={true}
                        query={null}
                        allQueries={toJS(this.classes)}
                        onError={this.onError}
                        onSave={this.onQuerySave}
                        onDelete={this.onDelete}
                        onClear={this.clearErrors}
                      />*/}
                      {this.status != '' && this.definitionError &&
                        <div className="callout alert" styleName={style} style={{width: '100%'}}>
                          <p styleName={style} dangerouslySetInnerHTML={{__html: this.status}}></p>
                        </div>
                      }
                    </div>
                  </div>

                  <div className="grid-x">
                    <div styleName="ttl_container" className="medium-3 cell">
                      <h4>{t('agent.areas')}</h4>
                    </div>

                    <div styleName="agent_content" className="medium-9 cell">
                      {results.areas.map((area, index) =>
                        <div key={index}>
                          <input type="checkbox"
                            className="checkbox_tender"
                            name={area.areaName}
                            defaultChecked={area.areaSelected}
                            value={area.areaID}
                            onChange={this.onCheck}
                          />
                          <span styleName="cb-label">{area.areaName}</span>
                        </div>)
                      }
                    </div>
                  </div>

                  <div className="grid-x">
                    <div styleName="ttl_container" className="medium-3 cell">
                      <h4>{t('agent.results')}</h4>
                    </div>

                    <div styleName="agent_content" className="medium-9 cell">
                    <Select value={this.results} style={{ width: '120px' }} onChange={this.handleChange}>
                      <Option value={0}>{t('agent.noResult')}</Option>
                      <Option value={1}>{t('agent.withResult')}</Option>
                      <Option value={2}>{t('agent.onlyResult')}</Option>
                    </Select>
                      {/*<input type="checkbox"
                        className="checkbox_tender"
                        name="alsoResult"
                        checked={this.alsoResult === 1}
                        value="1"
                        onChange={this.onCheckResult}
                      />
                    <span styleName="cb-label">{t('agent.alsoResult')}</span>*/}
                    </div>
                  </div>
                  {ifatUser &&
                    <div className="grid-x">
                      <div styleName="ttl_container" className="medium-3 cell">
                        <h4>{t('agent.estimate')}</h4>
                      </div>

                      <div styleName="agent_content" className="medium-9 cell">
                        <button className="left" styleName="button-submit" onClick={this.checkCounts}>{t('agent.submitCounts')}</button>
                        {estimatedCount > -1 && <div styleName="estimation">{t('agent.estimatedCount', {estimatedCount})}</div>}
                      </div>
                    </div>
                  }
                  {ifatUser &&
                    <div className="grid-x">
                      <div styleName="ttl_container" className="medium-3 cell">
                        <h4>{t('agent.checkWords')}</h4>
                      </div>

                      <div styleName="agent_content" className="medium-9 cell">
                        {t('agent.word')}<input type="text" name="word" onChange={this.updateField} />
                        {t('agent.compareTo')}<textarea name="compare" onChange={this.updateField} />
                        <button className="left" styleName="button-submit" onClick={this.compareText}>{t('agent.submitText')}</button>
                        {text != '' && <div styleName="text-compare" dangerouslySetInnerHTML={{__html: text}}></div>}
                      </div>
                    </div>
                  }
                  {ifatUser &&
                    <div styleName="btn_container">
                      {this.status != '' &&
                        <div className="callout alert" styleName={style}>
                          <p styleName={style} dangerouslySetInnerHTML={{__html: this.status}}></p>
                        </div>
                      }
                      <button className="left" styleName="button-submit" onClick={this.onSave}>{t('agent.submit')}</button>
                    </div>
                  }
                  {!ifatUser && <div styleName="block"></div>}
                  <ReactTooltip />
                </div>
                }
              </div>
              :
              <NotLogged />
            }
          </div>
        </div>
      </div>
    )
  }
}
