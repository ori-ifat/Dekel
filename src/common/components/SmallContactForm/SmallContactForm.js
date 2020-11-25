import React, {Component} from 'react'
import { bool, string } from 'prop-types'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import {translate} from 'react-polyglot'
import {checkEmail, checkPhone} from 'common/utils/validation'
import {contactUs} from 'common/services/apiService'
//import CSSModules from 'react-css-modules'
import  './SmallContactForm.scss'

@translate()
@inject('routingStore')
@observer

export default class SmallContactForm extends Component {

  static propTypes = {
    bigMode: bool,
    isRadar: bool,
    tenderID: string
  }

  @observable sent = false
  @observable status = ''
  @observable firstName = ''
  @observable email = ''
  @observable phone = ''

  componentDidMount() {

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
      const { routingStore: { push }, isRadar, tenderID, t } = this.props
      let text = '', subject = '', msgType = ''
      if (isRadar) {
        text = t('contact.radar')   //implement something else if needed
        subject = `${t('contact.radar')} `
        msgType = 'radar'
      }
      contactUs(this.firstName, this.email, this.phone, text, subject, msgType, tenderID).then(res => {
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
    const {bigMode, t} = this.props
    const style = bigMode ? {marginTop: '0'} : {}
    return (
      <div>

        <div className="sideform bottom" style={style}>
          <h2 styleName="sf_ttl">{t('contact.smallTitle')}</h2>
          <p styleName="sub_ttl">{t('contact.smallSubTitle')}</p>
          {this.status != '' &&
              <p styleName="sub_ttl" dangerouslySetInnerHTML={{__html: this.status}}></p>
          }
          <div id="lead" className="">

            {this.sent &&
              <span styleName="label-success">{t('contact.sent')}</span>
            }
            <div styleName="form_input_vert ">
              <input name="firstName" type="text" placeholder={t('contact.firstName')} onChange={this.onChange} />

            </div>

            <div styleName="form_input_vert ">
              <input name="email" type="email" placeholder={t('contact.email')} onChange={this.onChange} />
            </div>

            <div styleName="form_input_vert ">
              <input name="phone" type="tel" placeholder={t('contact.phone')} onChange={this.onChange} />
            </div>

            <div styleName="form_input_vert">
              <button name="send" className="button" styleName="send-button" onClick={this.contactUs}>{t('contact.submit')}</button>
            </div>
          </div>

        </div>

      </div>
    )
  }
}
