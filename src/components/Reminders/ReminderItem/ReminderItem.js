import React from 'react'
import { number, string, func } from 'prop-types'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { translate } from 'react-polyglot'
import moment from 'moment'
import {setReminder, clearCache} from 'common/services/apiService'
import Confirm from 'common/components/Confirm'
//import CSSModules from 'react-css-modules'
import  './ReminderItem.scss'

const req = require.context('common/style/icons/', false)
const alertSrc = req('./alert.svg').default

@translate()

@observer
export default class ReminderItem extends React.Component {
  static propTypes = {
    reminderID: number,
    title: string,
    date: string,
    presentationDate: string,
    selectItem: func,
    reload: func
  }

  @observable reminderID = -1
  @observable deleteMe = false

  componentWillMount() {
    const { reminderID } = this.props
    this.reminderID = reminderID
  }

  delReminder = (reminderID) => {
    /*
    setReminder('Delete', reminderID, -1, '', '', '').then(deleted => {
      console.log('delete status:', deleted) //implement if user should know something about delete op
      clearCache()
      this.props.reload()
    })*/
    this.deleteMe = true
  }

  deleteConfirm = (del) => {
    if (del && typeof(del) !== 'object') { //typeof(del) === 'object' means that user has cancelled dialog without choosing
      setReminder('Delete', this.reminderID, -1, '', '', '', this.props.date).then(deleted => {
        console.log('delete status:', deleted) //implement if user should know something about delete op
        clearCache()
        this.props.reload()
      })
    }
    this.deleteMe = false
  }

  render() {
    const { reminderID, title, date, presentationDate, selectItem, isSelected, t } = this.props
    //determine the date tabel
    const timeVal = moment(date, 'YYYY-MM-DD HH:mm').format('HH:mm')
    const reminderDate = moment(date, 'YYYY-MM-DD HH:mm').startOf('day').isSame(moment().startOf('day')) ?
      t('reminders.today') ://`${t('reminders.today')} ${timeVal}` :
      moment(date, 'YYYY-MM-DD HH:mm').format('DD/MM/YY')

    const infoDateVal = presentationDate ? moment(presentationDate, 'YYYY-MM-DD HH:mm').format('DD/MM/YY') : t('reminder.noDate')
    return (
      <div styleName="record">
        <div className="grid-x">
          <div className="large-2 cell">

            <h3 styleName="record-infodate">{reminderDate}</h3>
            <span styleName="time">{timeVal}</span>
          </div>
          <div className="large-10 cell">

            <h3 styleName="record-title" onClick={() => selectItem(reminderID)}>{title}</h3>
            <span> {`${t('reminders.presentationDate')} ${infoDateVal}`}</span>
            <a onClick={() => selectItem(reminderID)}>{t('reminders.edit')}</a>
            <a onClick={() => this.delReminder(reminderID)} style={{paddingLeft: '10px'}}>{t('reminders.delete')}</a>
          </div>
        </div>
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
