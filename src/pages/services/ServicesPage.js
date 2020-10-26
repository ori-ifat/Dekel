import React, {Component} from 'react'
import ServicesComponent from 'components/Services'

export default class Services extends Component {

  render(){
    return <div><ServicesComponent
      showNotification={this.props.showNotification}
    /></div>
  }
}
