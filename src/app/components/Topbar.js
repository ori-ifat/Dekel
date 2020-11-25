import React, {Component} from 'react'
//import CSSModules from 'react-css-modules'
import  './Topbar.scss'
import {translate} from 'react-polyglot'
import {inject, observer} from 'mobx-react'
import {observable} from 'mobx'
import {clearCache, getRemindersCount, resetReminders, welcomeMessage} from 'common/services/apiService'
import LoginDialog from 'common/components/LoginDialog'
import {fixTopMenu} from 'common/utils/topMenu'
import ReactInterval from 'react-interval'
import NotificationBadge from 'react-notification-badge'
import {Effect} from 'react-notification-badge'
import {getCookie, setCookie} from 'common/utils/cookies'
import Welcome from './Welcome'
import mobile from 'is-mobile'
import { Dropdown, Icon } from 'antd'
import TopMenu from './TopMenu'

const req = require.context('common/style/icons/', false)
const logoSrc = req('./logo.svg').default
const navIconSrc = req('./nav_icon.svg').default
const userSrc = req('./user.svg').default
const manuIco = req('./nav_icon.svg').default

const navbar = [  /*{
  title: 'subscriptions',
  link: '/subscriptions'
},*/ {
    title: 'about',
    link: '/about'
  }, {
    title: 'services',
    link: '/services'
  }, {
    title: 'contactus',
    link: '/contact'
  }]

/*
  <ul id="logout" className="menu vertical" styleName={menuStyle} data-dropdown-menu>
      <li><a onClick={this.navigate('/smartagent')}>{t('nav.smartagent')}</a></li>
      <li><a onClick={this.navigate('/favorites')}>{t('nav.favorites')}</a></li>
      <li><a onClick={this.navigate('/reminders')}>{t('nav.reminders')}</a></li>
      <li><a onClick={this.logout}>{t('nav.logout')}</a></li>
    </ul>
  */
const menuItems = [
  {
    name: 'smartagent', 
    link: '/smartagent'
  }, {
    name: 'favorites', 
    link: '/favorites'
  }, {
    name: 'reminders', 
    link: '/reminders'
  }, {
    name: 'logout', 
    link: '/logout'
  }
]
export default
@translate()
@inject('routingStore')
@inject('accountStore')
@observer //note if class is not an observer, it will not be affected from changes in other classes observables...
class Topbar extends Component {

  @observable showLoginDialog = false
  @observable messageCount = 0
  @observable isMobile = false
  @observable isWelcomeOpen = false
  @observable welcome = {}
  @observable cookName = ''
  @observable showMenu = false
  @observable showMobileMenu = false  
  cookVal;

  componentDidMount() {    
    //fix top nav foundation creation bug
    fixTopMenu()
    //handle cookie for 'Welcome' component... 
    this.isMobile = mobile()
    if (!this.isMobile) {
      welcomeMessage().then(res => {
        if (res.active) {
          this.welcome = res
          this.cookName = `WelcomeShown-${res.timeStamp}`
          this.cookVal = getCookie(this.cookName)
          //console.log(this.cookVal)
          if (this.cookVal && this.cookVal != '' && parseInt(this.cookVal) >= 2)
            this.isWelcomeOpen = false
          else {
            this.isWelcomeOpen = true
          }
        }
        else {
          this.isWelcomeOpen = false
        }
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    //console.log('receive', nextProps)
    if (nextProps.notify) {
      getRemindersCount().then(res =>
        this.messageCount = res
      )
    }
    else {
      clearCache()
      resetReminders().then(() =>
        this.messageCount = 0
      )
    }
  }

  navigate = route => () => {
    const { routingStore: { push, location: { pathname: path } } } = this.props
    if (path !== route) {
      this.showMobileMenu = false
      push(route)
    }
  }

  goToHome = () => {
    const {accountStore, routingStore: {push}} = this.props
    const homeLink = accountStore.profile ? '/main' : '/home'
    this.showMobileMenu = false
    push(homeLink)
  }

  login = () => {
    this.showLoginDialog = true
    this.showMenu = false
    this.showMobileMenu = false
  }

  logout = () => {
    const {accountStore, routingStore: {push}} = this.props
    accountStore.logout()
    clearCache()
    this.showMenu = false    
    this.showMobileMenu = false
    push('/')
  }

  validate = () => {
    try {
      const {accountStore} = this.props
      if (accountStore.profile) {
        accountStore.loadProfile().then(() => { 
          if (!accountStore.profile || !accountStore.profile.token) {      
            //...
            console.log('account is not valid - need to re-login')      
          }
          else {
            console.log('account is valid')          
          }
        })
      }
      else {
        console.log('no profile is present - validation is useless')
      }
    }
    catch(e) {
      console.error('validate error', e)
    }
  }

  continueUnlogged = () => {
    this.showLoginDialog = false
  }

  closeWelcomeDialog = () => {
    //console.log('closeWelcomeDialog')
    this.isWelcomeOpen = false
    const cnt = this.cookVal || 0
    if (this.cookName != '') {
      setCookie(this.cookName, parseInt(cnt) + 1)
    }
  } 

  showLeftMenu = (visible) => {
    //console.log('left', visible)    
    this.showMenu = visible
  }

  handleMobileMenu = (visible) => {
    //console.log('mobile', visible)    
    this.showMobileMenu = visible
    if (!visible) this.showMenu = visible //showMenu fix
  }

  render() {
    const {accountStore, t} = this.props    
    //const menuStyle = !this.isMobile || this.showMobileMenu ? {} : {display: 'none'}
    //const homeLink = accountStore.profile ? '/main' : '/home'
    //console.log(accountStore.profile, homeLink)
    return (
      <div styleName="header">
        <ReactInterval timeout={600000} enabled={true}
          callback={() => this.validate()} />
        <nav className="column row">
          <div>
            <Welcome
              imageUrl={this.welcome.url}
              landingPage={this.welcome.landingPage}
              isDialogOpened={this.isWelcomeOpen}
              closeDialog={this.closeWelcomeDialog}
            />

            
            <div styleName="head_continer" >
              <a styleName="logo" onClick={this.goToHome}>
                <img src={logoSrc} alt={t('nav.logoAlt')} title={t('nav.logoAlt')} id="logo" /> <span>  {t('nav.amounts')}</span>
              </a>
              {
                this.isMobile ? 
                  <Dropdown 
                    overlay={<Menu
                      navigate={this.navigate}
                      login={this.login}
                      logout={this.logout}
                      showLeftMenu={this.showLeftMenu}
                      handleMobileMenu={this.handleMobileMenu}
                      profile={accountStore.profile}
                      showMenu={this.showMenu}
                      messageCount={this.messageCount}
                      t={t}
                    /> }
                    overlayStyle={{width: '90%'}}
                    trigger={['click']}
                    visible={this.showMobileMenu}
                    onVisibleChange={this.handleMobileMenu}
                  >                      
                    <a styleName="manu_icon" ><img src={manuIco} alt="" /></a>
                  </Dropdown>
                  
                  :
                  <Menu
                    navigate={this.navigate}
                    login={this.login}
                    logout={this.logout}
                    showLeftMenu={this.showLeftMenu}
                    handleMobileMenu={this.handleMobileMenu}
                    profile={accountStore.profile}
                    showMenu={this.showMenu}
                    messageCount={this.messageCount}
                    t={t}
                  /> 
              }
            </div>

          </div>
        </nav>
        {this.showLoginDialog &&
          <LoginDialog
            onCancel={this.continueUnlogged}
          />
        }
      </div>
    )
  }
}

const Menu = ({navigate, login, logout, showLeftMenu, handleMobileMenu, profile, showMenu, messageCount, t}) => {
  const loginLabel = profile ? decodeURIComponent(profile.contactPersonName).replace(/\+/g, ' ') : t('nav.pleaseLog')
  return <React.Fragment>    
    <ul styleName="menu">
      {
        navbar.map((nav, index) => {
          const style = nav.title == 'publish' ? 'publish-link' : ''
          return <li key={index}><a styleName={style} onClick={navigate(`${nav.link}`)}>{t(`nav.${nav.title}`)}</a></li>
        })
      }
      <li>
        {messageCount > 0 &&
        <div style={{position: 'absolute', left: '0', top: '0'}}>
          <NotificationBadge count={messageCount} effect={Effect.SCALE}/>
        </div>
        }
        {profile ?                    
          <Dropdown 
            overlay={<TopMenu 
              items={menuItems} 
              visibleChange={handleMobileMenu} 
              logout={logout}
            />}
            trigger={['click']}
            visible={showMenu}
            onVisibleChange={showLeftMenu}
          >                      
            <a onClick={f => f}><img src={userSrc} alt="" />{loginLabel}<Icon type='down' style={{marginRight:'5px'}}/></a>                      
          </Dropdown>
          :
          <a onClick={login}><img src={userSrc} alt="" />{loginLabel}</a>
        }                  
      </li>
    </ul>
  </React.Fragment>
}
