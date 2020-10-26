import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import { whenRouted } from 'common/utils/withRouteHooks'
import { withRouter } from 'react-router'
import Toolbar from 'common/components/Toolbar'
import Checkbox from 'common/components/Checkbox'


@withRouter
@whenRouted(({ params: { test } }) => {
  console.log('test', test)
})
@observer
export default class Test extends Component {
/*
  state = {
    num: 1
  }*/

  state = {
    checked: false
  }

  @observable num = 1
  @observable items = []
  @observable checked = false

  onClick = () => {
    console.log('test onclick')
    //const {num} = this.state
    //let _num = parseInt(num)
    let _num = parseInt(this.num)
    _num++
    //this.setState({num: _num})
    this.num = _num
  }

  handleCheckBox = e => {
    if (e.target.checked) {
      this.items.push(1)
      console.log('checked', toJS(this.items))
    }
    else {
      const items = toJS(this.items)
      items.splice(0)
      this.items = items
      console.log('not checked', toJS(this.items))
    }
    this.setState({checked: e.target.checked})
  }

  chkBox = (checked, value) => {
    console.log('chkBox', checked, value)
    this.checked = checked
  }

  render() {
    console.log('render')
    return (
      <div>Test<br />
        {/*<button onClick={this.onClick}>Click {this.num}</button>
        <br />
        <input type='checkbox' checked={this.state.checked} value="1" onChange={this.handleCheckBox} />
        <br />
        <Checkbox checked={this.checked} value={111} onChange={this.chkBox} />
        <Toolbar checkedItems={toJS(this.items)} />*/}
      </div>
    )
  }
}
