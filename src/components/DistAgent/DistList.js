import React, {Component, PropTypes} from 'react'
import find from 'lodash/find'
import ResultsItem from 'common/components/ResultsItem'
//import CSSModules from 'react-css-modules'
import  './distagent.scss'

const DistList = ({catResults, checkedItems, allowCheck, onCheck, onFav}) => {
  return <div>
    {catResults.map((cat, index) => {
      return <div key={index}>
        <div styleName="cat">{cat.tendertype}</div>
        {
          cat.items.map((item, index) => {
            const found = find(checkedItems, chk => {
              return chk.tenderID == item.tenderID
            })
            const checked = found ? found.checked : false
            const fav = found ? found.isFavorite : item.isFavorite

            return <ResultsItem
              key={index}
              item={item}
              onCheck={allowCheck ? onCheck : undefined}
              onFav={onFav}
              checked={checked}
              fav={fav}
            />
          })
        }
      </div>
    })}
  </div>
}

export default DistList