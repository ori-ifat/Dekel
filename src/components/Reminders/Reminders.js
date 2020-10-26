import React, {Component} from 'react'
import { whenRouted } from 'common/utils/withRouteHooks'
import { withRouter } from 'react-router'
import {remindersStore} from 'stores'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import {translate} from 'react-polyglot'
import ReminderItem from './ReminderItem/ReminderItem'
import SearchInput from 'common/components/SearchInput'
import Reminder from 'common/components/Reminder'
import NotLogged from 'common/components/NotLogged'
import Loading from 'common/components/Loading/Loading'
//import CSSModules from 'react-css-modules'
import  './reminders.scss'

export default
@withRouter
@whenRouted(() => {
  remindersStore.loadAllReminders()
})
@inject('remindersStore')
@inject('accountStore')
@translate()
@observer
class Reminders extends Component {

  @observable itemId = -1

  componentWillMount() {
    const {showNotification} = this.props
    showNotification(false)
  }

  selectItem = (itemId, update) => {
    this.itemId = itemId
    if (itemId == -1 && update) {
      this.reloadItems()
    }
  }

  reloadItems = () => {
    //called for update\delete - reload items
    const {remindersStore} = this.props
    remindersStore.results.clear()
    remindersStore.loadAllReminders()
  }

  render() {
    const {accountStore: {profile}, remindersStore, t} = this.props
    const {resultsLoading, results} = remindersStore
    return (
      <div>
        <div className="row">
          <div className="column large-12" styleName="search-div">
            <SearchInput />
          </div>
        </div>
        <div className="row" styleName="title-container">
          <div className="column large-12">
            <h1 styleName="title">{t('reminders.title')}</h1>
          </div>
        </div>
        {profile ?
          <div className="row">
            <div className="column large-12">
              {!resultsLoading && results.map((reminder, index) =>
                <ReminderItem
                  key={index}
                  reminderID={reminder.reminderID}
                  title={reminder.title}
                  date={reminder.reminderDate}
                  presentationDate={reminder.presentationDate}
                  selectItem={this.selectItem}
                  reload={this.reloadItems}
                />
              )}
              {this.itemId > -1 && !remindersStore.reminderLoading &&
                <div styleName="reminder-container">
                  <Reminder
                    onClose={this.selectItem}
                    reminderID={this.itemId}
                  />
                </div>
              }
              {resultsLoading && <Loading />}
            </div>
          </div>
          :
          <NotLogged />
        }
      </div>
    )
  }
}
