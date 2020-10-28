import React from 'react'
import './TableHeader.scss'

const TableHeader = ({t}) => {
  return <div styleName="table_h">    
    <div styleName="checkbox"></div>
    <div styleName="cell_item title"><span styleName="cell-item">{t('results.tableTitle')}</span></div>
    <div styleName="cell_item publisher"><span styleName="cell-item">{t('results.publisher')}</span></div>
    <div styleName="cell_item info"><span styleName="cell-item">{t('results.number')}</span></div>    
    <div styleName="cell_item info"><span styleName="cell-item">{t('results.classes')}</span></div>
    <div styleName="cell_item info"><span styleName="cell-item">{t('results.detailsLevel')}</span></div>
    <div styleName="cell_item info"><span styleName="cell-item">{t('results.tour')}</span></div>
    <div styleName="cell_item info"><span styleName="cell-item">{t('results.presentation')}</span></div>
    <div styleName="cell_item info-small"></div>
  </div>
}

export default TableHeader