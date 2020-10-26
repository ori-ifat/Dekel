import React from 'react'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import { translate } from 'react-polyglot'
import { checkEmail, checkPhone } from 'common/utils/validation'
import { setUserAlert } from 'common/services/apiService'
import ReactModal from 'react-modal'
import  './GetInfo.scss'

export default 
@translate()
@inject('accountStore')
@inject('recordStore')
@observer
class GetInfo extends React.Component {

  @observable showLoginMsg = false
  @observable sent = false
  @observable status = ''
  @observable errors = ''
  @observable email = ''
  @observable phone = ''

  onChange = e => {
    switch (e.target.name) {   
    case 'email':
      this.email = e.target.value
      break
    case 'phone':
      this.phone = e.target.value
      break   
    }
  }

  update = () => {
    /* request info */
    //console.log('get info')    
    const {t} = this.props
    this.sent = false
    this.status = ''
    let errors = ''    
    /*
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
    }*/

    if (!checkEmail(this.email, true)) {
      errors += `${t('publish.emailNotValid')}; `
    }

    if (!checkPhone(this.phone, true)) {
      errors += `${t('publish.phoneNotValid')}; `
    }

    if (this.email == '' && this.phone == '') {
      errors += `${t('publish.addOneField')}; `
    }

    if (errors != '') {
      this.status = errors
    }
    else {
      //send data
      const {tenderID, onClose} = this.props
      setUserAlert(tenderID, this.email, this.phone).then(res => {
        //show a message
        this.sent = true
        this.status = t('contact.success')
        //console.log(res, this.sent, this.status)
        //close the modal
        //onClose(false)
      })      
    }
  }


  render() {
    const {t, onClose} = this.props
    const style = this.sent ? 'sent' : 'errors'
    return (
      <ReactModal
        isOpen={true}
        onRequestClose={() => onClose(false)}
        className="reveal-custom"
        overlayClassName="reveal-overlay-custom">
        <div styleName="info_lb">
          {!this.sent && this.status != '' &&
              <div className="callout alert" styleName={style}>
                <p styleName={style} dangerouslySetInnerHTML={{__html: this.status}}></p>
              </div>
          }
          {this.sent && this.status != '' &&
              <div className="callout alert" styleName={style}>
                <p styleName={style} dangerouslySetInnerHTML={{__html: this.status}}></p>
                <a onClick={() => onClose(false)} styleName="close-link">{t('tender.close')}</a>
              </div>
          }
          <div styleName="info-container">
            <h3>{t('tender.updateMe')}</h3>
            <span>{t('tender.byMail')}</span>
            <input type="text"  name="email" onChange={this.onChange} /> 
            <span>{t('tender.bySms')}</span>
            <input type="text" name="phone" onChange={this.onChange} />
            <a className="button" onClick={this.update}>{t('tender.sendInfo')}</a> 
          </div>                          
        </div>
      </ReactModal>
    )
  }
}
