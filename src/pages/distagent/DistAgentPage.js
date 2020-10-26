import React, {Component} from 'react'
import WrapperComponent from 'components/Wrapper'

export default class DistAgent extends Component {

  render(){
    return <div>
      <WrapperComponent
        use="distagent"
        showNotification={this.props.showNotification}
      />
    </div>
  }
}
