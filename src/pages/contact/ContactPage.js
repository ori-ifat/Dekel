import React, {Component} from 'react'
import ContactComponent from 'components/Contact'

export default class Contact extends Component {

  render(){
    return <div><ContactComponent
      showNotification={this.props.showNotification}
    /></div>
  }
}
