import React from 'react'
import {inject, observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import LoginDialog from 'common/components/LoginDialog'
//import {getFooterPublishers} from 'common/services/apiService'
//import take from 'lodash/take'
//import takeRight from 'lodash/takeRight'
import './Footer.scss'

const navbar = [{
  title: 'about',
  link: '/about'
}, {
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
}]

export default
@translate()
@inject('routingStore')
@inject('accountStore')
@observer
class Footer extends React.Component {

  @observable showLoginDialog = false
  //@observable publishers = []

  componentDidMount() {
    /*getFooterPublishers().then(res =>
      this.publishers = res
    )*/
  }

  navigate = (title, route) => {
    if (title != 'login') {
      this.goTo(route)
    }
    else {
      this.showLoginDialog = true
    }
  }
/*
  navigate2 = (id, shortName, cat = false) => {
    const url = cat ? `/Category/${id}/${shortName}/cat` :`/Category/${id}/${shortName}`
    this.goTo(url)
  }
*/
  goTo = (route) => {
    const { routingStore: { push, location: { pathname: path } } } = this.props
    if (path !== route) {
      push(route)
    }
  }

  continueUnlogged = () => {
    this.showLoginDialog = false
  }

  render() {
    const {accountStore, t} = this.props
    return  <footer styleName="footer">
      <div className="row">
        <div className="large-12 columns">

          <div styleName="footer_continer">
            <div styleName="footer_coll">
              <p styleName="link_ttl">{t('footer.linkTitle')}</p>
              <ul className="no-bullet">
                {
                  navbar.map((nav, index) => 
                    nav.title !== 'login' ? 
                      <li key={index}><a onClick={() => this.navigate(nav.title, nav.link)}>{t(`footer.${nav.title}`)}</a></li> :
                      accountStore.profile ? null : 
                        <li key={index}><a onClick={() => this.navigate(nav.title, nav.link)}>{t(`footer.${nav.title}`)}</a></li>
                  )
                }
              </ul>
            </div>

            <div styleName="footer_coll">
              <p styleName="link_ttl">{t('footer.publishers')}</p>
              <ul className="no-bullet">
                {
                  /*this.publishers && this.publishers.length > 0 && take(this.publishers, 5).map((publisher, index) => {
                    return <li key={index}><a onClick={() => this.navigate2(publisher.id, publisher.shortName)}>{publisher.name}</a></li>
                  })*/
                }
                <li><a onClick={() => this.navigate('', '/results/InputDate/[{"I":1171,"N":"משרד הבינוי והשיכון","R":"publisher","O":2,"U":1171.2}]/[]/true')}>{t('footer.shikun')}</a></li>
                <li><a onClick={() => this.navigate('', '/results/InputDate/[{"I":732,"N":"מינהל מקרקעי ישראל","R":"publisher","O":2,"U":732.2}]/[]/true')}>{t('footer.minhal')}</a></li>
                <li><a onClick={() => this.navigate('', '/results/InputDate/[{"I":468,"N":"חברת החשמל בע\'\'מ","R":"publisher","O":2,"U":468.2}]/[]/true')}>{t('footer.iec')}</a></li>
              </ul>
            </div>

            <div styleName="footer_coll">
              <p styleName="link_ttl">&nbsp;</p>
              <ul className="no-bullet">
                {
                  /*this.publishers && this.publishers.length > 0 && takeRight(this.publishers, 5).map((publisher, index) => {
                    return <li key={index}><a onClick={() => this.navigate2(publisher.id, publisher.shortName)}>{publisher.name}</a></li>
                  })*/
                }
                <li><a onClick={() => this.navigate('', '/results/InputDate/[{"I":505,"N":"עמידר - החברה הלאומית לשיכון בישראל בע\'\'מ","R":"publisher","O":2,"U":505.2}]/[]/true')}>{t('footer.amidar')}</a></li>
                <li><a onClick={() => this.navigate('', '/results/InputDate/[{"I":549,"N":"החברה למשק וכלכלה של השלטון המקומי בע\'\'מ","R":"publisher","O":2,"U":549.2}]/[]/true')}>{t('footer.meshek')}</a></li>
                <li><a onClick={() => this.navigate('', '/results/InputDate/[{"I":743,"N":"שירותי בריאות כללית","R":"publisher","O":2,"U":743.2}]/[]/true')}>{t('footer.clalit')}</a></li>
              </ul>
            </div>

            <div styleName="footer_coll">
              <p styleName="link_ttl">{t('footer.categories')}</p>
              <ul className="no-bullet">
                <li><a onClick={() => this.navigate('', '/results/InputDate/[%7B"I":1,"R":"s"%7D]/[]/true')}>{t('footer.building')}</a></li>
                <li><a onClick={() => this.navigate('', '/results/InputDate/[%7B"I":5,"R":"s"%7D]/[]/true')}>{t('footer.electricity')}</a></li>
                <li><a onClick={() => this.navigate('', '/results/InputDate/[%7B"I":1245,"R":"s"%7D]/[]/true')}>{t('footer.roads')}</a></li>
                <li><a onClick={() => this.navigate('', '/results/InputDate/[%7B"I":2,"R":"s"%7D]/[]/true')}>{t('footer.gardening')}</a></li>               
              </ul>
            </div>

            <div styleName="footer_coll">
              <p styleName="link_ttl">{t('footer.contact')}</p>
              <ul className="no-bullet">
                <li><span>{t('footer.sales')}: 03-5635000</span></li>
                <li><span>{t('footer.service')}: 03-5635070/3</span></li>
                <li><span>{t('footer.support')}: 03-5635031/7</span></li>

              </ul>
            </div>

          </div>
        </div>
      </div>


      <div className="row">
        <div className="medium-12 columns">
          <hr/>
        </div>
      </div>
      <div className="row">
        <div className="medium-6 small-12 columns">
          <p>{t('footer.rights')}</p>
        </div>

        <div className="medium-6 small-12 columns">
          <p className="medium-text-left">{t('footer.serviceTitle')}</p>
        </div>
      </div>
      {this.showLoginDialog &&
        <LoginDialog
          onCancel={this.continueUnlogged}
        />
      }
    </footer>
  }
}
