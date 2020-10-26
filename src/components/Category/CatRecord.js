import React, {Component, PropTypes} from 'react'
//import CSSModules from 'react-css-modules'
import  '../../common/components/ResultsItem/ResultsItem.scss'

const CatRecord = ({date, title, subSubject}) => {

  return (
    <div styleName="tender_summery" >
      <div className="grid-x">
        <div className="medium-9 cell">
          <div styleName="tender_txt_wraper">
            <h3 styleName="item-title">{title}</h3>
            <div styleName="tender_meta">
              <span>{date}</span>
              <span styleName="divider">•</span>
              <span>{subSubject}</span>
            </div>
          </div>
        </div>
        <div className="medium-3 cell">

        </div>
      </div>
    </div>
  )
}

export default CatRecord
