import React from 'react'
import { number } from 'prop-types'
import { inject, observer } from 'mobx-react'
import { observable, toJS } from 'mobx'
import { translate } from 'react-polyglot'
import moment from 'moment'
import filter from 'lodash/filter'
import { getExtraCount } from 'common/services/apiService'
import { getDefaultFilter } from 'common/utils/filter'
//import CSSModules from 'react-css-modules'
import  './ExtraCount.scss'

@translate()
@inject('searchStore')

@observer
export default class ExtraCount extends React.Component {

  static propTypes = {
    total: number
  }

  @observable extraCount = 0
  @observable loading = false

  componentWillMount() {
    const { searchStore } = this.props
    this.loading = true
    const tags = toJS(searchStore.tags)
    let filters = []
    //add date filter always (start empty anyway)
    //const filter = getDefaultFilter(tags.length == 0 && filters.length == 0)
    const filter = getDefaultFilter(tags.length == 0)
    filters = [filter]

    getExtraCount(searchStore.serializedTags, filters).then(res => {
      this.extraCount = res
      this.loading = false
    })
  }

  render() {
    const { total, t } = this.props
    const count = this.extraCount
    //if extraCount equals to the total results count, hide the div
    const style = count == total || this.loading ? 'extra hide' : 'extra'
    return (
      <span styleName={style}>
        {t('results.extraData', {count})}
      </span>
    )
  }
}
