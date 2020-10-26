import React, {Component} from 'react'
import WrapperComponent from 'components/Wrapper'

export default class Main extends Component {

  render(){
    return <div>
      <WrapperComponent
        use="main"
        showNotification={this.props.showNotification}
      />
    </div>
  }
}
