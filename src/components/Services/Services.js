import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import take from 'lodash/take'
import takeRight from 'lodash/takeRight'
import {getHomeJSON} from 'common/services/apiService'
import ServiceItem from './ServiceItem'
import Footer from 'common/components/Footer'
import DocumentMeta from 'react-document-meta'
import {getMetaData} from 'common/utils/meta'
import GTAG from 'common/utils/gtag'
//import CSSModules from 'react-css-modules'
import  './services.scss'

@translate()

@observer
export default class Services extends Component {

  @observable services = []

  componentWillMount() {
    getHomeJSON('Services', 'services').then(res => {
      this.services = res
    })
    const {showNotification} = this.props
    showNotification(true)
    GTAG.trackPage('Services', 'services')
  }


  render() {
    const {t} = this.props
    const pageName = t('meta.services')
    const meta = getMetaData(t('meta.pageTitle', {pageName}), t('meta.pageDesc', {pageName}), t('meta.pageKW', {pageName}))

    return (
      <div>
        <DocumentMeta {...meta} />
        <section id="services">
          <div className="row" >
            <div className="large-12 columns" >
              <h1 styleName="title" >{t('services.title')}</h1>
            </div>
          </div>
          <div className="row">
            {
              this.services && take(this.services, 2).map((service, index) =>
                <ServiceItem
                  key={index}
                  title={service.title}
                  text={service.text}
                  image={service.image}
                />)
            }
          </div>
          <div className="row" >
            {
              this.services && takeRight(this.services, 2).map((service, index) =>
                <ServiceItem
                  key={index}
                  title={service.title}
                  text={service.text}
                  image={service.image}
                />)
            }
          </div>
        </section>
        {this.services && this.services.length > 0 &&
          <Footer />
        }        
      </div>
    )
  }
}
