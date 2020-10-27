import React from 'react'
import { inject, observer } from 'mobx-react'
import { translate } from 'react-polyglot'
//import CSSModules from 'react-css-modules'
import  './ResultsActions.scss'
import FoundationHelper from 'lib/FoundationHelper'

const req = require.context('common/style/icons/', false)
const idleSrc = req('./card_idle.svg').default
const selectedSrc = req('./card_selected.svg').default
const tblIdleSrc = req('./table_idle.svg').default
const tblSelectedSrc = req('./table_selected.svg').default
//import {card_idle} from 'common/style/icons/card_idle.svg'

export default
@translate()
@inject('searchStore')
@inject('routingStore')
@observer
class ResultsActions extends React.Component {

  state = {
    sort: 'InputDate'
  }

  componentDidMount() {
    const { searchStore } = this.props
    this.setState({ sort: searchStore.sort })
    setTimeout(() => {
      //allow element to be created.
      FoundationHelper.initElement('sort')
    }, 200)
  }

  changeSort = (sort) => {
    const { searchStore, routingStore } = this.props
    const payload = JSON.stringify(searchStore.tags)
    const filters = JSON.stringify(searchStore.filters)
    routingStore.push(`/results/${sort}/${payload}/${filters}`)
  }

  render() {
    const { changeView, isTable, t } = this.props
    const { sort } = this.state
    const sortBy = sort && sort == 'InputDate' ? t('results.inputDate') : t('results.presentationDate')

    return (
      <div styleName="select_all">
        <div className="grid-x">
          <div className="medium-6 cell">
            {/*<div styleName="checkbox">
              <input type="checkbox" />
              <label>{t('results.selectAll')}</label>
            </div>*/}
            <div styleName="view-by">
              <a onClick={changeView}><img src={isTable ? idleSrc : selectedSrc} /></a>
              <a onClick={changeView} style={{paddingRight: '4px'}}><img src={isTable ? tblSelectedSrc : tblIdleSrc} /></a>
            </div>
          </div>
          <div className="medium-6 cell">
            <ul className="dropdown menu align-left sort" styleName="sort" id="sort" data-dropdown-menu data-disable-hover="true" data-click-open="true">
              <li>
                <a href="#">{t('results.sortBy')}: {sortBy}</a>
                <ul className="menu">
                  <li><a onClick={() => this.changeSort('InputDate')}>{t('results.inputDate')}</a></li>
                  <li><a onClick={() => this.changeSort('PresentationDate')}>{t('results.presentationDate')}</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
