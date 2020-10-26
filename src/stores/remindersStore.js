import { action, computed, observable, toJS } from 'mobx'
import { getAllReminders, getReminder } from 'common/services/apiService'

class Reminders {
  @observable resultsLoading = false
  @observable reminderLoading = false
  @observable request = {};
  @observable item = {};
  @observable results = []

  @action.bound
  cleanItem() {
    this.item = {}
  }

  @action.bound
  async loadAllReminders() {
    if (!this.resultsLoading) {
      this.resultsLoading = true
      let error = null  //if needed, make an observable
      try {
        this.request = await getAllReminders()
      }
      catch(e) {
        //an error occured on search
        console.error(`[loadAllReminders] search error: ${e.message}`)// http status code ${e.error.status}`)
        error = e.message
      }

      if (error == null) {
        const data = this.request
        this.results = [...data.map(d => ({ ...d, key: d.ReminderID }))]
        //console.log(toJS(this.results))
      }
      else {
        this.results = []
      }
      this.resultsLoading = false
    }
  }

  @action.bound
  async loadReminder(reminderID) {
    if (!this.reminderLoading) {
      this.reminderLoading = true
      this.item = await getReminder(reminderID)
      this.reminderLoading = false
    }
  }
}

export const remindersStore = new Reminders()
