import React, {Component} from 'react'
import SmartAgentComponent from 'components/SmartAgent'

export default class SmartAgent extends Component {

  render(){
    return <div><SmartAgentComponent
      showNotification={this.props.showNotification}
    /></div>
  }
}
