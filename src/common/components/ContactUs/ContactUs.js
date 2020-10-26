import React, {Component} from 'react'
import { string } from 'prop-types'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import {translate} from 'react-polyglot'
import {checkEmail, checkPhone} from 'common/utils/validation'
import {contactUs} from 'common/services/apiService'
//import CSSModules from 'react-css-modules'
import  './ContactUs.scss'

@translate()
@inject('routingStore')
@observer

export default class Contact extends Component {

  static propTypes = {
    title: string
  }

  @observable sent = false
  @observable status = ''
  @observable firstName = ''
  @observable email = ''
  @observable phone = ''

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
      const { routingStore: { push } } = this.props

      contactUs(this.firstName, this.email, this.phone).then(res => {
        //show a message
        this.sent = true
        //this.status = t('publish.sentSuccessfully')
        //console.log(res, this.sent, this.status)
        //push('/')   //redirect to home
        push('/thankyou')
      })
    }
  }

  render() {
    const {title, t} = this.props
    const pad = title ? {paddingTop: '1rem', paddingBottom: '1rem'} : {}
    const font = title ? {fontSize: '1.7rem'} : {}
    const size = title ? 6 : 8
    return (
      <div>

        <div className="sa_container" styleName="form-container" style={pad}>
          <h2 styleName="form-title" style={font}>{title ? title : `${t('cat.viewAll')}?`}</h2>
          {!title && <p className="text-center" styleName="form-subtitle">{t('cat.leaveDetails')}</p>}
          {(title || this.status != '') &&
            <p styleName="sub_ttl" dangerouslySetInnerHTML={{__html: this.status}}></p>
          }
          <div className="row">
            <div className={`medium-10 large-${size} columns medium-centered`}>
              <span className="success label hide">{t('cat.sent')}</span>
              <div styleName="lead_form" className="clearfix">
                <div styleName="form_input_hor form_input_container">
                  <input name="firstName" type="text" onChange={this.onChange} placeholder={t('cat.name')} />
                  {/*<label>{t('cat.name')}:</label>*/}
                </div>

                <div styleName="form_input_hor form_input_container">
                  <input name="email" type="email" onChange={this.onChange} placeholder={t('cat.email')} />
                  {/*<label>{t('cat.email')} </label>*/}
                </div>

                <div styleName="form_input_hor form_input_container">
                  <input name="phone" type="tel" onChange={this.onChange} placeholder={t('cat.phone')} />
                  {/*<label>{t('cat.phone')}</label>*/}
                </div>
                <div styleName="form_input_hor form_input_container submit">
                  <input type="submit" styleName="submit-button" className="button send-cat-form" value="" onClick={this.contactUs} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}
