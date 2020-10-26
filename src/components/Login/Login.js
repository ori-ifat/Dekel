import React, {Component} from 'react'
import { withRouter } from 'react-router'
import { translate } from 'react-polyglot'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import {clearCache} from 'common/services/apiService'
import {fixTopMenu} from 'common/utils/topMenu'
import LoginForm from 'common/components/LoginDialog/LoginForm'
import { encrypt, decrypt } from 'caesar-encrypt'
import {getCookie, setCookie, deleteCookie} from 'common/utils/cookies'
//import CSSModules from 'react-css-modules'
import  './login.scss'

export default
@translate()
@withRouter
@inject('accountStore')
@inject('routingStore')
@observer
class Login extends Component {

  @observable showLogin = false
  @observable userName = ''
  @observable password = ''
  @observable rememberMe = false

  componentDidMount() {
    const { accountStore, routingStore: { push }, match: {params: { tender }} } = this.props
    if (accountStore.profile) {
      accountStore.logout().then(() => {        
        this.showLogin = true
      })
    }
    else { 
      accountStore.loadProfile().then(() => { 
        if (!accountStore.profile || !accountStore.profile.token) {
          this.showLogin = true
        }
        else {
          this.showLogin = false
          if (tender) {
            push(`/tender/${tender}`)
          }
          else {
            push('/main')
          } 
        }
      })
    }
    //check for AutoLogin cookie
    const loginCookie = getCookie('AutoLogin')
    if (loginCookie && loginCookie !== '') {
      //if present: decrypt the data and commit the login
      const arr = loginCookie.split('_sep_')
      const user = decrypt(arr[0], 20).replace(/a/, 'i')
      const pass = decrypt(arr[1], 20).replace(/a/, 'i')
      //console.log('AutoLogin', user, pass)
      if (user !== '' && pass !== '') {
        this.userName = user
        this.password = pass
        this.login()
      }
    }
  }

  updateField = e => {
    //console.log('updateField', e.target.name, e.target.value)
    switch (e.target.name) {
    case 'userName':
      this.userName = e.target.value
      break
    case 'password':
      this.password = e.target.value
      break
    case 'rememberMe':
      this.rememberMe = e.target.checked
      break
    }
  }

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.stopPropagation()
      this.login()
    }
  }

  login = async () => {    
    const {accountStore, routingStore: { push }, match: {params: { tender }}} = this.props 
    if (accountStore.profile) {
      await accountStore.logout()   
    }
    
    try {
      await accountStore.login(this.userName, this.password)
      if (accountStore.error == null && accountStore.profile != null) {
      //successful login made
        if (this.rememberMe) {
        //save user and password on cookie
          const user = encrypt(this.userName.replace(/i/, 'a'), 20)
          const pass = encrypt(this.password.replace(/i/, 'a'), 20)
          setCookie('AutoLogin', `${user}_sep_${pass}`, { expires: 365, sameSite: 'lax' })
        }
        clearCache()
        fixTopMenu()
        //push('/main')
        if (tender) {
          push(`/tender/${tender}`)
        }
        else {
          push('/main')
        }          
      }
    }
    catch(e) {
      console.error('[Login] Error:', e)
    }
  }

  render() {
    const { accountStore, t } = this.props
    return (
      <div>
        {/*
          accountStore.error != null && <div styleName="error">{accountStore.error}</div>
        */}
        {
          this.showLogin && 
          <div styleName="login-form">
            <LoginForm
              accountStore={accountStore}
              error={accountStore.errorMessage}
              userName={this.userName}
              password={this.password}
              updateField={this.updateField}
              onKeyDown={this.onKeyDown}
              login={this.login}
              toggleRestore={null}
              t={t} />
          </div>
        }
      </div>
    )
  }
}
