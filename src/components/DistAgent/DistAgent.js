import React, {Component} from 'react'
import { withRouter } from 'react-router'
import { whenRouted } from 'common/utils/withRouteHooks'
import { func } from 'prop-types'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import {translate} from 'react-polyglot'
import { distAgentStore } from 'stores'
import DistList from './DistList'
import NoData from 'components/NoData'
import NotLogged from 'common/components/NotLogged'
//import LoginDialog from 'common/components/LoginDialog'
import Loading from 'common/components/Loading/Loading'
import findIndex from 'lodash/findIndex'
//import CSSModules from 'react-css-modules'
import  './distagent.scss'

@withRouter
@whenRouted(({ params: { uid, type } }) => {
  distAgentStore.clearResults()
  distAgentStore.loadNextResults(uid, type)
})
@translate()
@inject('accountStore')
@inject('distAgentStore')
@inject('recordStore')

@observer
export default class DistAgent extends Component {

  static propTypes = {
    onCheck: func,
    onFav: func
  }

  @observable allowCheck = false

  componentWillMount() {
    //const { match: {params: { uid }} } = this.props
    //console.log(uid)
    //temp patch: redirect to old site page
    //location.href = `http://info.tenders.co.il/DistAgent/DistAgent.aspx?uid=${uid}`
    const {showNotification, match: { params: { uid, type } }} = this.props
    showNotification(true)
    if (type && type == 'Mail') {
      this.allowCheck = true   //if 'type' param was sent, show checkboxes
    }
  }


  render() {
    const {accountStore, distAgentStore, distAgentStore: {results, resultsLoading, resultsCount}, match: { params: { type } }, t} = this.props
    const {onCheck, onFav, recordStore: {checkedItems}} = this.props
    const fixedRes = fixedResults(resultsLoading, results)
    //console.log(fixedRes)

    return (
      <div style={{marginTop: '50px'}}>
        {resultsLoading && <Loading />}
        {/*!accountStore.profile && !resultsLoading && type == 'Mail' && <LoginDialog onCancel={f => f} />*/}
        {resultsCount == 0 && !resultsLoading && <NoData error={distAgentStore.searchError} />}
        {resultsCount > 0 && !resultsLoading &&
          <div>
            <div className="row">
              <div className="large-12 columns">
                <h1 styleName="title">{t('distagent.titlePart1')} <span styleName="num">{resultsCount}</span> {t('distagent.titlePart2')}</h1>
              </div>
            </div>
            <div className="row">
              <div className="columns large-12">
                <hr />
                <DistList
                  catResults={fixedRes}
                  checkedItems={checkedItems}
                  allowCheck={this.allowCheck}
                  onCheck={onCheck}
                  onFav={onFav}
                />
              </div>
            </div>
          </div>
        }
      </div>)
  }
}

const fixedResults = (loading, results) => {
  /* add tendertype to the results - create a new array with 'cat' and items */
  //create a new array
  const arrRes = []
  if (!loading) {
    //iterate over results for tendertype
    if (results && results.length > 0) {
      results.map((res) => {
        const index = findIndex(arrRes, item => item.tendertype == res.TenderType)
        if (index == -1) {
          arrRes.push({tendertype: res.TenderType, items: [res]})
        }
        else {
          arrRes[index].items.push(res)
        }
      })
    }
  }
  return arrRes
}
