import React from 'react'
import {Select} from 'antd'

const DateCombo = ({chooseDateField, t}) => {
  const { Option } = Select
  return <Select defaultValue="inputDate" bordered={false} >
    <Option value="inputDate" onClick={() => chooseDateField('inputDate')}>{t('filter.inputDate')}</Option>
    <Option value="presentationDate" onClick={() => chooseDateField('presentationDate')}>{t('filter.presentationDate')}</Option>
    <Option value="resultDate" onClick={() => chooseDateField('resultDate')}>{t('filter.resultDate')}</Option>
  </Select>
}

export default DateCombo