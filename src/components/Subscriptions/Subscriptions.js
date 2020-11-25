import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import Footer from 'common/components/Footer'
import DocumentMeta from 'react-document-meta'
import {getMetaData} from 'common/utils/meta'
//import CSSModules from 'react-css-modules'
import  './subscriptions.scss'

@translate()
@inject('routingStore')

@observer
export default class Subscriptions extends Component {

  @observable oneCatPartial = false
  @observable twoCatPartial = false
  @observable allCatPartial = false

  componentDidMount() {
    const {showNotification} = this.props
    showNotification(true)
  }

  showPartial = type => {
    switch (type) {
    case 'onecat':
      this.oneCatPartial = !this.oneCatPartial
      break
    case 'twocat':
      this.twoCatPartial = !this.twoCatPartial
      break
    case 'allcat':
      this.allCatPartial = !this.allCatPartial
      break
    default:

    }
  }

  register = () => {
    const {routingStore} = this.props
    routingStore.push('/contact')
  }

  render() {
    const {t} = this.props
    const oneCatPrice = this.oneCatPartial ? 155 : 129
    const twoCatPrice = this.twoCatPartial ? 190 : 159
    const allCatPrice = this.allCatPartial ? 290 : 240

    const oneCatLabel = this.oneCatPartial ? t('subscriptions.catConditionPartial') : t('subscriptions.catCondition')
    const oneCatLinkLabel = this.oneCatPartial ? t('subscriptions.showFull') : t('subscriptions.showPartial')

    const twoCatLabel = this.twoCatPartial ? t('subscriptions.catConditionPartial') : t('subscriptions.catCondition')
    const twoCatLinkLabel = this.twoCatPartial ? t('subscriptions.showFull') : t('subscriptions.showPartial')

    const allCatLabel = this.allCatPartial ? t('subscriptions.catConditionPartial') : t('subscriptions.catCondition')
    const allCatLinkLabel = this.allCatPartial ? t('subscriptions.showFull') : t('subscriptions.showPartial')

    const pageName = t('meta.subscriptions')
    const meta = getMetaData(t('meta.pageTitle', {pageName}), t('meta.pageDesc', {pageName}), t('meta.pageKW', {pageName}))

    return (
      <div>
        <DocumentMeta {...meta} />
        <div className="row" >

          <div className="large-12 columns" >
            <h1 styleName="main_ttl" >{t('subscriptions.title')}</h1>
            <hr styleName="divider" />
          </div>

        </div>
        <section styleName="pricing">
          <div className="row" >
            <div className="large-12 columns" >
              <div className="row collapse" >

                <div className="medium-4 small-12 columns" >
                  <div styleName="plan" >
                    <h2>{t('subscriptions.onecat')}</h2>

                    <div styleName="top_info" >
                      <p styleName="price"><span styleName="p_big">{oneCatPrice}</span> {t('subscriptions.catPrice')}</p>
                      <p className="text-center" >{oneCatLabel}</p>
                      <a styleName="show_full" onClick={() => this.showPartial('onecat')} >{oneCatLinkLabel}</a>
                    </div>

                    <div styleName="bottom_info" >
                      <p>{t('subscriptions.benefit1')}</p>
                      <p>{t('subscriptions.benefit2')}</p>
                      <p>{t('subscriptions.benefit3')}</p>
                      <p>{t('subscriptions.benefit4')}</p>
                      <p>{t('subscriptions.benefit5')}</p>
                      <p>{t('subscriptions.benefit6')}</p>
                      <p>{t('subscriptions.benefit7')}</p>
                      <p>{t('subscriptions.benefit8')}</p>
                    </div>
                    <p className="text-center">
                      <a className="button" styleName="signup_btn" onClick={this.register}>{t('subscriptions.register')}</a>
                    </p>

                  </div>
                </div>

                <div className="medium-4 small-12 columns" >
                  <div styleName="plan" >
                    <h2>{t('subscriptions.twocat')}</h2>

                    <div styleName="top_info" >
                      <p styleName="price"><span styleName="p_big" >{twoCatPrice}</span> {t('subscriptions.catPrice')}</p>
                      <p className="text-center" >{twoCatLabel}</p>
                      <a styleName="show_full" onClick={() => this.showPartial('twocat')} >{twoCatLinkLabel}</a>
                    </div>

                    <div styleName="bottom_info" >
                      <p>{t('subscriptions.benefit1')}</p>
                      <p>{t('subscriptions.benefit2')}</p>
                      <p>{t('subscriptions.benefit3')}</p>
                      <p>{t('subscriptions.benefit4')}</p>
                      <p>{t('subscriptions.benefit5')}</p>
                      <p>{t('subscriptions.benefit6')}</p>
                      <p>{t('subscriptions.benefit7')}</p>
                      <p>{t('subscriptions.benefit8')}</p>
                    </div>
                    <p className="text-center">
                      <a className="button" styleName="signup_btn" onClick={this.register}>{t('subscriptions.register')}</a>
                    </p>

                  </div>
                </div>

                <div className="medium-4 small-12 columns" >
                  <div styleName="plan hilight" >
                    <h2>{t('subscriptions.allcat')}</h2>

                    <div styleName="top_info" >
                      <p styleName="price"><span styleName="p_big">{allCatPrice}</span> {t('subscriptions.catPrice')}</p>
                      <p className="text-center" >{allCatLabel}</p>
                      <a styleName="show_full" onClick={() => this.showPartial('allcat')} >{allCatLinkLabel}</a>
                    </div>

                    <div styleName="bottom_info" >
                      <p>{t('subscriptions.benefit1')}</p>
                      <p>{t('subscriptions.benefit2')}</p>
                      <p>{t('subscriptions.benefit3')}</p>
                      <p>{t('subscriptions.benefit4')}</p>
                      <p>{t('subscriptions.benefit5')}</p>
                      <p>{t('subscriptions.benefit6')}</p>
                      <p>{t('subscriptions.benefit7')}</p>
                      <p>{t('subscriptions.benefit8')}</p>
                    </div>
                    <p className="text-center">
                      <a className="button" styleName="signup_btn" onClick={this.register}>{t('subscriptions.register')}</a>
                    </p>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />        
      </div>
    )
  }
}
