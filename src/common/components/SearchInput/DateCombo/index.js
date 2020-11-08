import React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import Select from 'react-select'
import './DateCombo.scss'

/*
const DateCombo = ({chooseDateField, t}) => {
  
  return <ul className="dropdown menu align-left sort" styleName="sort" id="dateCombo" data-dropdown-menu data-disable-hover="true" data-click-open="true">
    <li>      
      <ul className="menu">                 
        <li><a onClick={() => chooseDateField('inputDate')}>{t('filter.inputDate')}</a></li>
        <li><a onClick={() => chooseDateField('presentationDate')}>{t('filter.presentationDate')}</a></li>
        <li><a onClick={() => chooseDateField('resultDate')}>{t('filter.resultDate')}</a></li>
      </ul>
    </li>
  </ul>
}*/
export default @observer class DateCombo extends React.Component {

  @observable value = {key: 'תאריך פרסום', value: 'inputDate'}

  onChange = values => {
    console.log(values);
    this.value = values
    const {chooseDateField} = this.props
    chooseDateField(values.value)
  }

  onInputKeyDown = (e) => {
    if (e.keyCode === 13) {
      //e.preventDefault()  //fucks up the search.
      e.stopPropagation()
    }
  }

  render() {
    const {t} = this.props
    const options = [{key: t('filter.inputDate'), value: 'inputDate' },
      {key: t('filter.presentationDate'), value: 'presentationDate' },
      {key: t('filter.resultDate'), value: 'resultDate' }]
    return  <Select
      styleName="branch"
      className="single-select"
      name="searchbox"
      placeholder={t('agent.placeHolder')}
      noResultsText={null}
      searchPromptText=""
      rtl={true}
      multi={false}
      cache={false}
      clearable={false}
      searchable={false}
      options={options}
      onChange={this.onChange}
      onInputKeyDown={this.onInputKeyDown}
      value={this.value}
      labelKey={'key'}
      valueKey={'value'}
    />
  }
}