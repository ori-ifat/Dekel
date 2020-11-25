import React, {Component} from 'react'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import {translate} from 'react-polyglot'
import {checkEmail, checkPhone} from 'common/utils/validation'
import {contactUs} from 'common/services/apiService'
import Footer from 'common/components/Footer'
import DocumentMeta from 'react-document-meta'
import {getMetaData} from 'common/utils/meta'
import GTAG from 'common/utils/gtag'
//import CSSModules from 'react-css-modules'
import  './contact.scss'

const req = require.context('common/style/icons/', false)
const support = req('./customers_service.svg').default
const tech_support = req('./support_small.svg').default
const sales = req('./sales.svg').default

export default
@translate()
@inject('routingStore')
@observer
class Contact extends Component {

  @observable sent = false
  @observable status = ''
  @observable firstName = ''
  @observable email = ''
  @observable phone = ''
  @observable comment = ''

  componentDidMount() {
    const {showNotification} = this.props
    showNotification(true)
    GTAG.trackPage('Contact', 'contact')
  }

  onChange = e => {
    switch (e.target.name) {
    case 'firstName':
      this.firstName = e.target.value
      break
    case 'email':
      this.email = e.target.value
      break
    case 'phone':
      this.phone = e.target.value
      break
    case 'comment':
      this.comment = e.target.value
      break
    }
  }

  contactUs = () => {
    const {t} = this.props
    this.sent = false
    this.status = ''
    let errors = ''
    if (this.firstName == '') {
      errors += `${t('publish.enterName')}; `
    }

    if (this.email == '') {
      errors += `${t('publish.enterEmail')}; `
    }
    else if (!checkEmail(this.email, false)) {
      errors += `${t('publish.emailNotValid')}; `
    }

    if (this.phone == '') {
      errors += `${t('publish.enterPhone')}; `
    }
    else if (!checkPhone(this.phone, false)) {
      errors += `${t('publish.phoneNotValid')}; `
    }

    if (errors != '') {
      this.status = errors
    }
    else {
      //send data
      //console.log(this.toTime);
      const { routingStore: { push } } = this.props
      contactUs(this.firstName, this.email, this.phone, this.comment).then(res => {
        //show a message
        this.sent = true
        this.status = t('contact.success')
        //console.log(res, this.sent, this.status)
        //push('/')   //redirect to home
        push('/thankyou') //means that local message wil not be displayed...
      })
    }
  }

  goToHome = () => {
    const { routingStore: { push } } = this.props
    push('/')   //redirect to home
  }

  render() {
    const {t} = this.props
    const style = this.sent ? 'sent' : 'errors'
    const pageName = t('meta.contact')
    const meta = getMetaData(t('meta.pageTitle', {pageName}), t('meta.pageDesc', {pageName}), t('meta.pageKW', {pageName}))

    return (
      <div>
        <DocumentMeta {...meta} />
        <div className="row" styleName="title-container">
          <div className="column large-12">
            <h1 styleName="title">{t('contact.title')}</h1>
          </div>
        </div>

        <div className="row">
          <div className="column large-8 small-12">
            <div styleName="wrapper">
              {!this.sent && this.status != '' &&
              <div className="callout alert" styleName={style}>
                <p styleName={style} dangerouslySetInnerHTML={{__html: this.status}}></p>
              </div>
              }
              {this.sent ?
                <div styleName={style}>
                  <b>{t('contact.success')}</b><br />
                  <p>{t('contact.willCall')}</p>
                  <button className="left" styleName="button-submit" onClick={this.goToHome}>{t('contact.toHome')}</button>
                </div>
                :
                <div>
                  <p>{t('contact.callUs')}</p>
                  <div styleName="pl" className="medium-12 medium-centered cell">
                    <span>{t('contact.firstName')}:</span>
                    <input type="text" name="firstName" styleName="input-value" onChange={this.onChange} />
                  </div>



                  <div styleName="pl" >
                    <span>{t('contact.email')}:</span>
                    <input type="email" name="email" styleName="input-value" onChange={this.onChange} />
                  </div>
                  <div styleName="pr" >
                    <span>{t('contact.phone')}:</span>
                    <input type="tel" name="phone" styleName="input-value" onChange={this.onChange} />
                  </div>

                  <div styleName="pr" >
                    <span>{t('contact.why')}:</span>
                    <textarea name="comment" styleName="input-value" onChange={this.onChange} />
                  </div>

                  <div styleName="btn_container">
                    <button className="left" styleName="button-submit" onClick={this.contactUs}>{t('contact.submit')}</button>
                  </div>
                </div>
              }
            </div>
          </div>
          <div className="medium-4 small-12 columns">
            <div styleName="contact_info">

              <div styleName="ci" className="media-object">
                <div className="media-object-section">
                  <img src={support} />
                </div>
                <div className="media-object-section main-section middle">
                  <p >{t('contact.service')}:<br/>03-5635070/3</p>
                </div>
              </div>

              <div styleName="ci" className="media-object">
                <div className="media-object-section">
                  <img src={tech_support} />
                </div>
                <div className="media-object-section main-section middle">
                  <p >{t('contact.techsupport')}:<br/>03-5635031/7</p>
                </div>
              </div>

              <div styleName="ci" className="media-object">
                <div className="media-object-section">
                  <img src={sales} />
                </div>
                <div className="media-object-section main-section middle">
                  <p >{t('contact.sales')}:<br/>03-5635000</p>
                </div>
              </div>

            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
