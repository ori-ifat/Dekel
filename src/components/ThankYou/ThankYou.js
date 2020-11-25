import React, {Component} from 'react'
import {inject /*,observer*/} from 'mobx-react'
import {translate} from 'react-polyglot'
//import SearchInput from 'common/components/SearchInput'
import DocumentMeta from 'react-document-meta'
import {getMetaData} from 'common/utils/meta'
import GTAG from 'common/utils/gtag'
//import CSSModules from 'react-css-modules'
import  './thankYou.scss'

@translate()
@inject('routingStore')

//@observer
export default class ThankYou extends Component {

  componentDidMount() {
    GTAG.sendEvent()
  }

  goToHome = () => {
    const { routingStore: { push } } = this.props
    push('/')   //redirect to home
  }

  render() {
    const {t} = this.props
    const meta = getMetaData(t('meta.homeTitle'), t('meta.homeDesc'), t('meta.homeKeywords'))
    return (
      <div>
        <DocumentMeta {...meta} />
        {/*<div className="row">
          <div className="column large-9 large-centered" style={{marginTop: '3rem'}}>
            <SearchInput isMain={true} />
          </div>
        </div>*/}
        <div className="row">
          <div className="column large-12" style={{marginTop: '5rem'}}>
            <div className="thankyou-page">
              <div styleName="wrapper" className="thankyou-page">
                <div styleName="sent">
                  <b>{t('contact.success')}</b><br />
                  <p>{t('contact.willCall')}</p>
                  <button className="left" styleName="button-submit" onClick={this.goToHome}>{t('contact.toHome')}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
