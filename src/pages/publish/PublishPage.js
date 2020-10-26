import React, {Component} from 'react'
import PublishComponent from 'components/Publish'

export default class Publish extends Component {

  render(){
    return <div><PublishComponent
      showNotification={this.props.showNotification}
    /></div>
  }
}
