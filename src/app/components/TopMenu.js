import React, {Component} from 'react'
import {translate} from 'react-polyglot'
import {inject} from 'mobx-react'
import { Menu, Divider } from 'antd'
import './TopMenu.scss'

export default
@translate()
@inject('routingStore')
class TopMenu extends Component {
  
  onClick = (link) => {
    //could not use that when tried to drill-down the navigate as a prop from Topbar
    const { routingStore: { push, location: { pathname: path } }, visibleChange } = this.props
    if (path !== link) {
      visibleChange(false)
      push(link)
    }
  }

  render() {
    const {items, logout, t} = this.props
    return <Menu>
      {
        items.map((item, index) =>
          <Menu.Item key={index}>
            <div onClick={() => item.link === '/logout' ? logout() : this.onClick(item.link)}>{t(`nav.${item.name}`)}</div>
            <Divider />
          </Menu.Item>
        )
      }
    </Menu>
  }
}
