import React, {Component} from 'react'
import { withRouter } from 'react-router'
import { inject, observer } from 'mobx-react'
//import { observable } from 'mobx'
import {clearCache} from 'common/services/apiService'
import {fixTopMenu} from 'common/utils/topMenu'
//import CSSModules from 'react-css-modules'
import  './autologin.scss'

export default
@withRouter
@inject('accountStore')
@inject('routingStore')
@observer
class AutoLogin extends Component {

  //@observable itemID = -1

  componentDidMount() {
    const { accountStore } = this.props
    if (accountStore.profile) {
      accountStore.logout().then(() => {
        this.login()
      })
    }
    else {
      this.login()
    }
  }

  login = () => {
    //const { accountStore, match: {params: { user, pass, tender }}, routingStore: { push } } = this.props
    const { accountStore, match: {params: { token, tender }}, routingStore: { push } } = this.props
    //accountStore.login(decodeURIComponent(user), decodeURIComponent(pass), false).then(() => {
    accountStore.tokenLogin(decodeURIComponent(token)).then(() => {
      if (accountStore.error == null && accountStore.profile != null) {
        //successful login made
        //console.log('tender', tender)
        clearCache()
        fixTopMenu()
        if (!tender) {
          push('/main')
        }
        else {
          push(`/tender/${tender}`)
        }
      }
    }).catch(error => {
      console.error('[Login] Error:', error)
      //notifyMessage(error)
    })
  }

  render() {
    const { accountStore } = this.props
    return (
      <div>
        {
          accountStore.error != null && <div styleName="error">{accountStore.error}</div>
        }
      </div>
    )
  }
}
