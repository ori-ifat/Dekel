import React, {Component} from 'react'
import RestoreComponent from 'components/Restore'

export default class Restore extends Component {

  render(){
    return <div><RestoreComponent showNotification={this.props.showNotification} /></div>
  }
}
