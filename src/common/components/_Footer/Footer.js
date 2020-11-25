import React, {/*Component, PropTypes*/} from 'react'
//import {inject, observer} from 'mobx-react'
//import {observable} from 'mobx'
import {translate} from 'react-polyglot'
//import LoginDialog from 'common/components/LoginDialog'
//import {getFooterPublishers} from 'common/services/apiService'
//import take from 'lodash/take'
//import takeRight from 'lodash/takeRight'
//import CSSModules from 'react-css-modules'
import  './Footer.scss'

const req = require.context('common/style/icons/', false)
const logo = req('./dekel.png').default
/*
const navbar = [{
  title: 'about',
  link: '/about'
}, /*{
  title: 'subscriptions',
  link: '/subscriptions'
},* / {
  title: 'services',
  link: '/services'
}, {
  title: 'login',
  link: ''
}, {
  title: 'contact',
  link: '/contact'
}, {
  title: 'sitemap',
  link: '/sitemap'
}]*/

export default
@translate()
//@inject('routingStore')
//@observer
class Footer extends React.Component {

  //@observable showLoginDialog = false
  //@observable publishers = []

  componentDidMount() {
    /*getFooterPublishers().then(res =>
      this.publishers = res
    )*/
  }
  /*
  navigate = (title, route) => {
    if (title != 'login') {
      this.goTo(route)
    }
    else {
      this.showLoginDialog = true
    }
  }

  navigate2 = (id, shortName, cat = false) => {
    const url = cat ? `/Category/${id}/${shortName}/cat` :`/Category/${id}/${shortName}`
    this.goTo(url)
  }

  goTo = (route) => {
    const { routingStore: { push, location: { pathname: path } } } = this.props
    if (path !== route) {
      push(route)
    }
  }

  continueUnlogged = () => {
    this.showLoginDialog = false
  }
*/
  render() {
    const {t} = this.props
    return  <footer styleName="footer">

      <div className="row">
        <div className="medium-6 small-12 columns">
          <img src={logo} />
        </div>

        <div className="medium-6 small-12 columns">
          <p className="medium-text-left" styleName="support" >{t('footer.serviceTitle')}</p>
        </div>
      </div>
      {/*this.showLoginDialog &&
        <LoginDialog
          onCancel={this.continueUnlogged}
        />
      */}
    </footer>
  }
}
