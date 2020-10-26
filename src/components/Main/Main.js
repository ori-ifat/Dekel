import React, {Component} from 'react'
import { object, func } from 'prop-types'
import SearchInput from 'common/components/SearchInput'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import { whenRouted } from 'common/utils/withRouteHooks'
import { withRouter } from 'react-router'
import { mainStore } from 'stores'
import { translate } from 'react-polyglot'
import MainTitle from './MainTitle'
//import MainList from './MainList'
import Filters from 'components/results/Filters'
import List from 'common/components/List'
import NotLogged from 'common/components/NotLogged'
import {fixTopMenu} from 'common/utils/topMenu'
import {accountStore} from 'stores'
//import CSSModules from 'react-css-modules'
import  './main.scss'

export default
@translate()
@withRouter
@whenRouted(() => {
  if (accountStore.profile) {
    mainStore.clearResults()
    mainStore.loadNextResults()
    //mainStore.getBanner()
    //mainStore.loadMoreTenders()
    mainStore.loadNextFilters()
  }
})
@inject('mainStore')
@inject('accountStore')
@inject('recordStore')

@observer
class Main extends Component {

  static propTypes = {
    onCheck: func,
    onFav: func
  }

  componentWillMount() {
    const {showNotification} = this.props
    showNotification(true)
    fixTopMenu()
  }

  render() {
    const { mainStore, mainStore: {resultsLoading}, accountStore: {profile}, t } = this.props
    const {onCheck, onFav} = this.props
    const {recordStore: {checkedItems}} = this.props

    return (
      <div>
        <div className="row">
          <div className="column large-12">
            <div styleName="search-div" >
              <SearchInput />
              {profile ?
                <div>
                  <MainTitle />
                  {/*!resultsLoading &&
                  <MainList
                    items={mainStore.results}
                    onCheck={onCheck}
                    onFav={onFav}
                    checkedItems={checkedItems}
                  />*/}
                  <div className="grid-container">
                    <div className="grid-x grid-padding-x">
                      <div className="cell large-3">
                        <Filters store={mainStore} />
                      </div>
                      <div className="cell large-9">
                        <List
                          store={mainStore}
                          loadMore={mainStore.loadNextResults}
                          onCheck={onCheck}
                          onFav={onFav}
                          checkedItems={checkedItems} />

                        {/*<Banner banner={toJS(mainStore.banner)} />
                      <br />
                      <h6 styleName="more-tenders-title">{t('main.moreTenders')}</h6>
                      <MainList
                        items={mainStore.resultsMore}
                        onFav={onFav}
                      />*/}
                      </div>
                    </div>
                  </div>
                </div>
                :
                <NotLogged />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const Banner = ({banner}) => (
  <div>
    <a href={banner.BannerHref} target="_blank">
      <img src={banner.BannerLink} alt={banner.BannerAlt} />
    </a>
  </div>
)
