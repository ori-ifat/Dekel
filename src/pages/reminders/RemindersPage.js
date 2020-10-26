import React, {Component} from 'react'
import RemindersComponent from 'components/Reminders'

export default class Reminders extends Component {

  render(){
    return <div>
      <RemindersComponent
        showNotification={this.props.showNotification}
      />
    </div>
  }
}
