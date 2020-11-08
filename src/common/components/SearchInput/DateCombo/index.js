import React from 'react'
import './DateCombo.scss'
//import {Select} from 'antd'

const DateCombo = ({chooseDateField, t}) => {
  /*const { Option } = Select
  return <Select defaultValue="inputDate" bordered={false} >
    <Option value="inputDate" onClick={() => chooseDateField('inputDate')}>{t('filter.inputDate')}</Option>
    <Option value="presentationDate" onClick={() => chooseDateField('presentationDate')}>{t('filter.presentationDate')}</Option>
    <Option value="resultDate" onClick={() => chooseDateField('resultDate')}>{t('filter.resultDate')}</Option>
  </Select>*/
  return <ul className="dropdown menu align-left sort" styleName="sort" id="dateCombo" data-dropdown-menu data-disable-hover="true" data-click-open="true">
    <li>      
      <ul className="menu">                 
        <li><a onClick={() => chooseDateField('inputDate')}>{t('filter.inputDate')}</a></li>
        <li><a onClick={() => chooseDateField('presentationDate')}>{t('filter.presentationDate')}</a></li>
        <li><a onClick={() => chooseDateField('resultDate')}>{t('filter.resultDate')}</a></li>
      </ul>
    </li>
  </ul>
}

export default DateCombo