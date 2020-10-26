import React from 'react'
import { object, func, bool } from 'prop-types'
import { observer } from 'mobx-react'
import { translate } from 'react-polyglot'
//import CSSModules from 'react-css-modules'
import  './List.scss'
import InfiniteScroll from 'react-infinite-scroller'
import ResultsItem from 'common/components/ResultsItem'
import Loading from 'common/components/Loading/Loading'
import find from 'lodash/find'

export default
@translate()
@observer
class List extends React.Component {

  static propTypes = {
    store: object,
    loadMore: func,
    onCheck: func,
    onFav: func,
    checkedItems: object,
    isTable: bool
  }

  render() {
    const { t, store, loadMore, isTable, checkedItems } = this.props
    const { resultsPageSize, resultsLoading, results, hasMoreResults } = store
    //console.log('hasMoreResults', hasMoreResults)
    const items = results.map((item, index) => {
      const found = find(this.props.checkedItems, chk => {
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
        isTable={isTable}
      />
    }, this)

    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={hasMoreResults}
        loader={<Loading key={1}/>}
      >
        {items}
      </InfiniteScroll>
    )
  }
}
