import React from 'react'
import { object, func, array } from 'prop-types'
import { observer } from 'mobx-react'
import ResultsItem from 'common/components/ResultsItem'
import find from 'lodash/find'
//import CSSModules from 'react-css-modules'
import  './MainList.scss'


@observer
export default class MainList extends React.Component {
  static propTypes = {
    item: object,
    onCheck: func,
    onFav: func,
    checkedItems: object
  }

  render() {
    const { items, checkedItems, t } = this.props

    return (
      <div style={{marginBottom: '30px'}}>
        {items.map((item, index) => {
          const { checkedItems } = this.props
          const found = find(checkedItems, chk => {
            return chk.tenderID == item.tenderID
          })
          const checked = found ? found.checked : false
          const fav = found ? found.isFavorite : item.isFavorite

          return <ResultsItem
            key={index}
            item={item}
            onCheck={this.props.onCheck}
            onFav={this.props.onFav}
            checked={checked}
            fav={fav}
          />
        }, this)}
      </div>
    )
  }
}
