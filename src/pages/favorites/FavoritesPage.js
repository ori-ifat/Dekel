import React, {Component} from 'react'
import WrapperComponent from 'components/Wrapper'

export default class Favorites extends Component {

  render() {
    return <div>
      <WrapperComponent
        use="favorites"
        showNotification={this.props.showNotification}
      />
    </div>
  }
}
