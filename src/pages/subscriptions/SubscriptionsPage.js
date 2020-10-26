import React, {Component} from 'react'
import SubscriptionsComponent from 'components/Subscriptions'

export default class Subscriptions extends Component {

  render(){
    return <div><SubscriptionsComponent
      showNotification={this.props.showNotification}
    /></div>
  }
}
