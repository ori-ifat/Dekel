import React, {Component} from 'react'
import { withRouter } from 'react-router'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import {translate} from 'react-polyglot'
import {viewRestorePassword, restorePassword} from 'common/services/apiService'
import Footer from 'common/components/Footer'
import DocumentMeta from 'react-document-meta'
import {getMetaData} from 'common/utils/meta'
//import CSSModules from 'react-css-modules'
import  './restore.scss'

const req = require.context('common/style/icons/', false)
const support = req('./customers_service.svg').default  //req('./support.png').default
const tech_support = req('./support_small.svg').default //req('./tech_support.png').default
const sales = req('./sales.svg').default  //req('./sales.png').default

export default
@translate()
@withRouter
@inject('routingStore')
@observer
class Restore extends Component {

  @observable sent = false
  @observable status = ''
  @observable userToken = ''
  @observable userName = ''
  @observable password = ''
  @observable password2 = ''

  componentDidMount() {
    const {showNotification, match: { params: { token } }} = this.props
    viewRestorePassword(token).then(res => {
      if (res.ok) {
        this.userToken = token
        this.userName = res.userName
      }
      else {
        if (res.errors == 'user token is not valid.') {
          this.userToken = 'not_valid'
        }
        else {
          this.userToken = ''
        }
      }
    })
    showNotification(true)
    //console.log('userToken', token)
  }

  onChange = e => {
    switch (e.target.name) {
    case 'userName':
      this.userName = e.target.value
      break
    case 'password':
      this.password = e.target.value
      break
    case 'password2':
      this.password2 = e.target.value
      break
    }
  }

  restorePassword = () => {
    const {t} = this.props
    this.sent = false
    this.status = ''
    let errors = ''

    if (this.password == '') {
      errors += `${t('login.missingPassword')}; `
    }

    if (this.password2 == '') {
      errors += `${t('login.missingConfirmation')}; `
    }
    else if (this.password2 !== this.password) {
      errors += `${t('login.noPasswordMatch')}; `
    }

    if (errors != '') {
      this.status = errors
    }
    else {
      //send data
      //console.log(this.toTime);
      const { routingStore: { push } } = this.props
      restorePassword(this.userToken, this.password).then(res => {
        //show a message
        if (res.restored) {
          this.sent = true
          this.status = t('login.restored')
        }
        else {
          this.sent = false
          this.status = t('login.notRestored')
        }
      })
    }
  }

  render() {
    const {t} = this.props
    const style = this.sent ? 'sent' : 'errors'
    const pageName = t('meta.restore')
    const meta = getMetaData(t('meta.pageTitle', {pageName}), t('meta.pageDesc', {pageName}), t('meta.pageKW', {pageName}))

    return (
      <div>
        <DocumentMeta {...meta} />
        <div className="row" styleName="title-container">
          <div className="column large-12">
            <h1 styleName="title">{t('login.restoreTitle')}</h1>
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
                  <b>{t('login.restored')}</b>
                </div>
                :
                this.userToken == 'not_valid' ?
                  <div styleName="errors bad-token">{t('login.tokenNotValid')}</div>
                  :
                  this.userToken == '' ?
                    <div styleName="errors bad-token">{t('login.badToken')}</div>
                    :
                    <div>
                      <div styleName="pl" className="medium-12 medium-centered cell">
                        <span>{t('login.usernameLabel')}:</span>
                        <input type="text" name="userName" styleName="input-value" onChange={this.onChange} value={this.userName} />
                      </div>

                      <div styleName="pl" >
                        <span>{t('login.passwordLabel')}:</span>
                        <input type="password" name="password" styleName="input-value" onChange={this.onChange} />
                      </div>
                      <div styleName="pr" >
                        <span>{t('login.confirmPassword')}:</span>
                        <input type="password" name="password2" styleName="input-value" onChange={this.onChange} />
                      </div>

                      <div styleName="btn_container">
                        <button className="left" styleName="button-submit" onClick={this.restorePassword}>{t('login.restore')}</button>
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
