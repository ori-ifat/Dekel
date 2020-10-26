import React, {Component} from 'react'
import { string, number, func } from 'prop-types'
import { /*inject,*/ observer } from 'mobx-react'
import { observable } from 'mobx'
import { translate } from 'react-polyglot'
import moment from 'moment'
import {setReminder, getReminder, clearCache} from 'common/services/apiService'
import {getCookie, setCookie} from 'common/utils/cookies'
import Calendar from 'common/components/Calendar'
import Confirm from 'common/components/Confirm'
import { Link } from 'react-router-dom'
import ReactModal from 'react-modal'
import InputMask from 'react-input-mask'
//import CSSModules from 'react-css-modules'
import  './Reminder.scss'

export default
@translate()
//@inject('remindersStore')
@observer
class Reminder extends Component {

  static propTypes = {
    tenderID: number,
    encryptedID: string,
    onClose: func,
    setReminderData: func,
    title: string,
    presentationDate: string,
    reminderID: number
  }

  @observable tenderID = -1
  @observable subject = '';
  @observable time = '';
  @observable reminderDate;
  @observable presentationDate;
  @observable remark = '';
  @observable email = '';
  @observable reminderID = 0
  @observable deleteMe = false

  componentWillMount() {
    ReactModal.setAppElement('#root')
    this.initReminder()
  }

  componentWillReceiveProps(nextProps) {
    this.initReminder()
  }

  initReminder = () => {
    const {tenderID, title, presentationDate, reminderID} = this.props
    if (!reminderID || reminderID == -1) {
      this.tenderID = tenderID
      this.subject = title
      this.reminderDate = presentationDate != null ? moment(presentationDate, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY') : moment().format('DD-MM-YYYY')
      this.presentationDate = presentationDate != null ? moment(presentationDate, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY') : moment().format('DD-MM-YYYY')
      this.time = '00:00'
      this.remark = ''
    }
    else {
      this.reminderID = reminderID
      this.getReminderData(reminderID)
    }
    const email = getCookie('userEmail') || ''
    this.email = email
  }

  getReminderData = (reminderID) => {
    getReminder(reminderID).then(reminder => {
      //console.log('reminder', reminder)
      this.tenderID = reminder[0].tenderID
      this.subject = reminder[0].title
      this.reminderDate = moment(reminder[0].reminderDate).format('DD-MM-YYYY')
      this.presentationDate = moment(reminder[0].presentationDate).format('DD-MM-YYYY')
      this.time = moment(reminder[0].reminderDate).format('HH:mm')
      this.remark = reminder[0].remark || ''
    })
    /* //use the store - caused some problems on reminders screen
    const {remindersStore}= this.props
    remindersStore.loadReminder(reminderID).then(() => {
      console.log('reminder', remindersStore.item)
      this.tenderID = remindersStore.item.InfoID
      this.subject = remindersStore.item.Title
      this.reminderDate = moment(remindersStore.item.ReminderDate).format('DD-MM-YYYY')
      this.time = moment(remindersStore.item.ReminderDate).format('HH:mm')
      this.remark = remindersStore.item.Remark || ''
    })*/
  }

  updateField = e => {
    //console.log('updateField', e.target.name, e.target.value)
    switch (e.target.name) {
    case 'subject':
      this.subject = e.target.value
      break
    case 'time':
      this.time = e.target.value
      break
    case 'date':
      this.reminderDate = e.target.value
      break
    case 'remark':
      this.remark = e.target.value
      break
    case 'email':
      this.email = e.target.value
      break
    }
  }

  selectDate = date => {
    //console.log('selectDate', date, moment(date).format('DD-MM-YYYY'))
    this.reminderDate = moment(date).format('DD-MM-YYYY')
  }

  addReminder = () => {
    //check if time has passed: add 10 minutes to current time, to avoid a time that has passed already
    const selectedTime = moment(`${this.reminderDate} ${this.time}`, 'DD-MM-YYYY HH:mm') < moment() ? moment().add(10, 'minutes').format('HH:mm') : this.time
    //take from DD-MM-YYYY HH:mm format
    const selectedDate = moment(`${this.reminderDate} ${selectedTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss')
    //console.log(this.reminderDate, selectedDate)
    const action = this.reminderID > 0 ? 'Update' : 'Add'
    setReminder(action, this.reminderID, this.tenderID, this.remark, this.subject, this.email, selectedDate).then(newid => {
      console.log('saved new reminderID:', newid) //implement if user should know something about save op
      clearCache()
      const {setReminderData, onClose} = this.props
      if (setReminderData) setReminderData(newid, this.reminderDate)
      onClose(-1, true) //...close the modal
    })
    if (this.email != '') {
      setCookie('userEmail', this.email, { expires: 365, sameSite: 'lax' })
    }
  }

  delReminder = () => {   
    this.deleteMe = true
  }

  deleteConfirm = (del) => {
    if (del && typeof(del) !== 'object') { //typeof(del) === 'object' means that user has cancelled dialog without choosing
      const date = moment(this.reminderDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
      setReminder('Delete', this.reminderID, -1, '', '', '', date).then(deleted => {
        console.log('delete status:', deleted) //implement if user should know something about delete op
        clearCache()
        const {setReminderData, onClose} = this.props
        onClose(-1, true) //...close the modal
        if (setReminderData) setReminderData(-1, null)
      })
    }
    this.deleteMe = false
  }

  render() {
    const {onClose, presentationDate, encryptedID, t} = this.props
    const title = this.subject
    //const dateVal = moment(this.reminderDate, 'DD-MM-YYYY').format('DD-MM-YYYY')
    const timeVal = this.time != '' ? this.time : moment(this.reminderDate, 'DD-MM-YYYY').format('HH:mm')    
    const presentationDateVal = this.presentationDate != null ? this.presentationDate : t('reminder.noDate')

    return (
      <div>

        <ReactModal
          isOpen={true}
          onRequestClose={() => onClose(-1)}
          className="reveal-custom"
          overlayClassName="reveal-overlay-custom">
          <div styleName="reminder_lb" >
            <button styleName="button-cancel" onClick={() => onClose(-1)}>×</button>
            <div className="grid-x grid-margin-x" styleName="pb">
              <div className="small-12 cell">
                <h2 styleName="remider_ttl">{t('reminder.title')}</h2>
              </div>
            </div>

            <div className="grid-x grid-margin-x" styleName="pb">
              <div className="small-12 cell">
                <span>{t('reminder.subject')}</span>
                <input type="text" name="subject" value={title} onChange={this.updateField}/>
              </div>
            </div>

            <div className="grid-x grid-margin-x" styleName="pb">

              <div className="small-6 cell">
                <span>{t('reminder.date')}</span>
                <Calendar
                  defaultDate={moment(this.reminderDate, 'DD-MM-YYYY')}
                  todayLabel={t('reminder.today')}
                  selectDate={this.selectDate}
                  showMonths={false}
                  showYears={false}
                  minDate={moment()}
                  maxDate={moment().add(1, 'year')}
                />
                <span styleName="note">{t('reminder.delivery', {presentationDateVal})}</span>
              </div>

              <div className="small-6 cell">
                <span>{t('reminder.time')}</span>
                {/*<input type="text" name="time" value={timeVal} onChange={this.updateField} />*/}
                <InputMask 
                  mask="99:99" 
                  name="time" 
                  value={timeVal} 
                  onChange={this.updateField}
                  styleName="time-input"
                />
              </div>
            </div>

            <div className="grid-x grid-margin-x" styleName="pb">
              <div className="small-12 cell">
                <span>{t('reminder.email')}</span>
                <input type="email" name="email" value={this.email} onChange={this.updateField}/>
              </div>
            </div>

            <div className="grid-x grid-margin-x" styleName="pb">
              <div className="small-12 cell">
                <span>{t('reminder.remark')}</span>
                <textarea styleName="remark" name="remark" value={this.remark} onChange={this.updateField} />
              </div>
            </div>

            <div className="grid-x grid-margin-x" styleName="pb">
              <div className="small-12 cell">                
                <Link to={`/tender/${encodeURIComponent(encryptedID)}`} target='_blank'>{t('reminder.linkToItem')}</Link>
              </div>
            </div>

            <div className="grid-x grid-margin-x" styleName="buttons_cont">
              <div className="small-12 cell">

                {this.reminderID > 0 &&
                  <button styleName="button-remove" onClick={this.delReminder}>{t('reminder.delete')}</button>
                }
                <button styleName="button-submit" onClick={this.addReminder}>{t('reminder.submit')}</button>
              </div>
            </div>
          </div>
        </ReactModal>
        {
          this.deleteMe &&
            <Confirm
              title={t('reminder.deleteTitle')}
              subTitle={t('reminder.deleteSubTitle')}
              actLabel={t('reminder.delete')}
              onClose={this.deleteConfirm}
            />
        }
      </div>
    )
  }
}
