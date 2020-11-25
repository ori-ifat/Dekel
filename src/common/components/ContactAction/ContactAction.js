import React from 'react'
//import { string, func } from 'prop-types'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import { translate } from 'react-polyglot'
import {checkEmail, checkPhone} from 'common/utils/validation'
import {contactUs} from 'common/services/apiService'
import ReactModal from 'react-modal'
import mobile from 'is-mobile'
//import CSSModules from 'react-css-modules'
import  './ContactAction.scss'

const req = require.context('common/style/icons/', false)
const contact = req('./contact_action.svg').default //mail_w.png
const contactMobile = req('./mail_w.svg').default
const contactTitle = req('./contact.png').default

@translate()
@inject('routingStore')
@observer

export default class ContactAction extends React.Component {

  @observable modalOpen = false
  @observable isMobile = false
  @observable sent = false
  @observable status = ''
  @observable firstName = ''
  @observable email = ''
  @observable phone = ''
  @observable comment = ''

  static propTypes = {

  }

  componentDidMount() {
    ReactModal.setAppElement('#root')
    this.status = ''
    this.isMobile = mobile()
  }

  componentWillReceiveProps(nextProps) {
    this.status = ''
  }

  onOpen = () => {
    //this.setState({open: true})
    this.modalOpen = true
  }

  onClose = () => {
    //this.setState({open: false})
    this.modalOpen = false
  }

  onChange = e => {
    //console.log(e.target.value)
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

    if (this.comment == '') this.comment = `${t('contact.subscribe')}`

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
        push('/thankyou') //means that local message will not be displayed...
        this.onClose()  //close modal.
      })
    }
  }

  render() {
    const { t } = this.props
    const style = this.sent ? 'sent' : 'errors'
    const linkStyle = this.isMobile ? 'button-call' : 'button-call-desktop'
    const imgSrc = this.isMobile ? contactMobile : contact
    const imgStyle = this.isMobile ? '' : 'image-button'
    return (
      <div>
        <ReactModal
          isOpen={this.modalOpen}
          onRequestClose={this.onClose}
          className="reveal-custom"
          overlayClassName="reveal-overlay-custom">
          <div styleName="container">
            <button styleName="button-cancel" onClick={this.onClose}>×</button>
            <div className="row">
              <img src={contactTitle} />
            </div>
            <div className="row">
              <div className="column large-12" style={{padding: '1.7rem'}}>

                {!this.sent && this.status != '' &&
                <div className="callout alert" styleName={style}>
                  <p styleName={style} dangerouslySetInnerHTML={{__html: this.status}}></p>
                </div>
                }
                <div styleName="pl" className="medium-12 medium-centered cell">
                  <span styleName="input-label">{t('contact.firstName')}:</span>
                  <input type="text" name="firstName" styleName="input-value" onChange={this.onChange} />
                </div>
                <div styleName="pl" >
                  <span styleName="input-label">{t('contact.email')}:</span>
                  <input type="email" name="email" styleName="input-value" onChange={this.onChange} />
                </div>
                <div styleName="pl" >
                  <span styleName="input-label">{t('contact.phone')}:</span>
                  <input type="tel" name="phone" styleName="input-value" onChange={this.onChange} />
                </div>
                <div styleName="pl" >
                  <span styleName="input-label">{t('contact.why')}:</span>
                  {/*<textarea name="comment" styleName="input-value" onChange={this.onChange} />*/}
                  <select name="comment" onChange={this.onChange} styleName="combo">
                    <option>{t('contact.subscribe')}</option>
                    <option>{t('contact.service')}</option>
                    <option>{t('contact.other')}</option>
                  </select>
                </div>
                <div styleName="btn_container">
                  <button className="left" styleName="button-submit" onClick={this.contactUs}>{t('contact.submit')} &gt;</button>
                </div>

              </div>
            </div>
          </div>
        </ReactModal>
        <a onClick={this.onOpen} styleName={linkStyle}><img src={imgSrc} styleName={imgStyle} /></a>
      </div>
    )
  }
}
