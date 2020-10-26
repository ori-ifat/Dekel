import React, {Component} from 'react'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import {translate} from 'react-polyglot'
import moment from 'moment'
import {checkEmail, checkPhone} from 'common/utils/validation'
import {publishTender} from 'common/services/apiService'
import Calendar from 'common/components/Calendar'
import GTAG from 'common/utils/gtag'
//import CSSModules from 'react-css-modules'
import  './publish.scss'

const req = require.context('common/style/icons/', false)
const addSrc = req('./add.svg').default

@translate()
@inject('routingStore')
@observer

export default class Publish extends Component {

  @observable sent = false
  @observable status = ''
  @observable firstName = ''
  @observable lastName = ''
  @observable companyName = ''
  @observable companyPhone = ''
  @observable endDate = moment()
  @observable toTime = '00:00'
  @observable email = ''
  @observable phone = ''
  @observable fax = ''
  @observable address = ''
  @observable title = ''
  @observable description = ''

  componentWillMount() {
    const {showNotification} = this.props
    showNotification(true)
    GTAG.trackPage('Publish', 'publish')
  }

  selectDate = (date, field) => {
    this.endDate = date
    //console.log(date, field);
  }

  onChange = e => {
    switch (e.target.name) {
    case 'firstName':
      this.firstName = e.target.value
      break
    case 'lastName':
      this.lastName = e.target.value
      break
    case 'companyName':
      this.companyName = e.target.value
      break
    case 'companyPhone':
      this.companyPhone = e.target.value
      break
    case 'toTime':
      this.toTime = e.target.value
      break
    case 'email':
      this.email = e.target.value
      break
    case 'phone':
      this.phone = e.target.value
      break
    case 'fax':
      this.fax = e.target.value
      break
    case 'address':
      this.address = e.target.value
      break
    case 'title':
      this.title = e.target.value
      break
    case 'description':
      this.description = e.target.value
      break
    }
  }

  publishTender = () => {
    const {t} = this.props
    this.sent = false
    this.status = ''
    let errors = ''
    if (this.firstName == '') {
      errors += `${t('publish.enterName')}; `
    }
    if (this.lastName == '') {
      errors += `${t('publish.enterLastName')}; `
    }
    if (this.companyName == '') {
      errors += `${t('publish.enterCompanyName')}; `
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

    if (this.title == '') {
      errors += `${t('publish.enterTitle')}; `
    }
    if (this.description == '') {
      errors += `${t('publish.enterDesc')}; `
    }

    if (errors != '') {
      this.status = errors
    }
    else {
      //send data
      //console.log(this.toTime);
      //const { routingStore: { push } } = this.props
      const toDateVal = moment(this.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
      const toDate = moment(`${toDateVal} ${this.toTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss')
      publishTender(this.firstName, this.lastName, this.companyName, this.companyPhone,
        toDate, this.email, this.phone, this.fax, this.address, this.title, this.description).then(res => {
        //show a message
        this.sent = true
        this.status = t('publish.sentSuccessfully')
        //console.log(res, this.sent, this.status)
        //push('/')   //redirect to home
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
    return (
      <div>
        <div className="row" styleName="title-container">
          <div className="column large-12">
            <h1 styleName="title">{t('publish.title')}</h1>
          </div>
        </div>

        <div className="row">
          <div className="column large-8 small-12">
            <div styleName="wraper">
              {this.sent ?
                <div styleName={style}>
                  <b>{t('publish.sentSuccessfully')}</b><br />
                  <p>{t('publish.willCall')}</p>
                  <button className="left" styleName="button-submit" onClick={this.goToHome}>{t('publish.toHome')}</button>
                </div>
                :
                <div>
                  <div styleName="tender">
                    <h2>{t('publish.titleSection1')}</h2>
                    <span>{t('publish.tenderTitle')}:</span>
                    <input type="text" name="title" styleName="input-value" onChange={this.onChange} />
                    <span>{t('publish.tenderDesc')}:</span>
                    <textarea name="description" styleName="input-value" style={{height: '300px'}} onChange={this.onChange} />
                  </div>

                  <h2>{t('publish.titleSection2')}</h2>
                  <div className="grid-x">
                    <div styleName="pl" className="medium-6 cell">
                      <span>{t('publish.firstName')}:</span>
                      <input type="text" name="firstName" styleName="input-value" onChange={this.onChange} />
                    </div>
                    <div styleName="pr" className="medium-6 cell">
                      <span>{t('publish.lastName')}:</span>
                      <input type="text" name="lastName" styleName="input-value" onChange={this.onChange} />
                    </div>
                  </div>

                  <div className="grid-x">
                    <div styleName="pl" className="medium-6 cell">
                      <span>{t('publish.companyName')}:</span>
                      <input type="text" name="companyName" styleName="input-value" onChange={this.onChange} />
                    </div>
                    <div styleName="pr" className="medium-6 cell">
                      <span>{t('publish.companyPhone')}:</span>
                      <input type="tel" name="companyPhone" styleName="input-value" onChange={this.onChange} />
                    </div>
                  </div>

                  <div className="grid-x">
                    <div styleName="pl" className="medium-6 cell">
                      <span>{t('publish.toDate')}:</span>
                      <div style={{paddingBottom: '0.5rem', marginBottom: '0.4rem'}}>
                        <Calendar
                          name="endDate"
                          defaultDate={this.endDate}
                          todayLabel={t('filter.today')}
                          selectDate={this.selectDate}
                          showMonths={true}
                          showYears={true}
                          minDate={moment()}
                          maxDate={moment().add(1, 'year')}
                        />
                      </div>
                    </div>
                    <div styleName="pr" className="medium-6 cell">
                      <span>{t('publish.toTime')}:</span>
                      <input type="time" name="toTime" onChange={this.onChange} />
                    </div>
                  </div>

                  <div className="grid-x">
                    <div styleName="pl" className="medium-6 cell">
                      <span>{t('publish.email')}:</span>
                      <input type="email" name="email" styleName="input-value" onChange={this.onChange} />
                    </div>
                    <div styleName="pr" className="medium-6 cell">
                      <span>{t('publish.phone')}:</span>
                      <input type="tel" name="phone" styleName="input-value" onChange={this.onChange} />
                    </div>
                  </div>

                  <div className="grid-x">
                    <div styleName="pl" className="medium-6 cell">
                      <span>{t('publish.fax')}:</span>
                      <input type="tel" name="fax" styleName="input-value" onChange={this.onChange} />
                    </div>
                    <div styleName="pr" className="medium-6 cell">
                      <span>{t('publish.address')}:</span>
                      <input type="text" name="address" styleName="input-value" onChange={this.onChange} />
                    </div>
                  </div>
                  <div styleName="btn_container">
                    {!this.sent && this.status != '' &&
                    <div className="callout alert" styleName={style}>
                      <p styleName={style} dangerouslySetInnerHTML={{__html: this.status}}></p>
                    </div>
                    }
                    <button className="left" styleName="button-submit" onClick={this.publishTender}>{t('publish.submit')}</button>
                  </div>
                </div>
              }
            </div>
          </div>
          <div className="column large-4 small-12">
            <div styleName="promoWraper">
              <h4>{t('publish.promo')}</h4>
              <p styleName="promo">
                {t('publish.promoDetails')}
              </p>
            </div>
          </div>
        </div>        
      </div>
    )
  }
}
