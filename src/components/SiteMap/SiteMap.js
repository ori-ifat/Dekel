import React, {Component} from 'react'
import { withRouter } from 'react-router'
import {observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import {translate} from 'react-polyglot'
import {getHomeJSON} from 'common/services/apiService'
//import SmallContactForm from 'common/components/SmallContactForm'
import Footer from 'common/components/Footer'
import DocumentMeta from 'react-document-meta'
import {getMetaData} from 'common/utils/meta'
//import CSSModules from 'react-css-modules'
import  './sitemap.scss'

export default
@withRouter
@translate()
@observer
class SiteMap extends Component {

  @observable data;

  componentWillMount() {
    getHomeJSON('Sitemap', 'sitemap').then(res => {
      this.data = res
    })
  }


  render() {
    const {t} = this.props
    const {data} = this
    const meta = getMetaData(t('meta.homeTitle'), t('meta.homeDesc'), t('meta.homeKeywords'))

    return (
      <div>
        {data &&
        <section>
          <DocumentMeta {...meta} />
          <div className="row">
            <div className="large-12 columns">
              <h1 styleName="title">{t('footer.sitemap')}</h1>
              <hr styleName="divider" />
            </div>
          </div>
          <div className="row">
            <div className="medium-3 columns" styleName="section">
              <h3 styleName="cat">{t('sitemap.categories')}</h3>
              {data.urlset.categories.map((url, index) =>
                <div key={index}><a href={url.loc} target="_blank">{url.name}</a></div>
              )}
            </div>
            {/*<div className="medium-3 columns" styleName="section">
              <h3 styleName="cat">{t('sitemap.publishers')}</h3>
              {data.urlset.publishers.map((url, index) =>
                <div key={index}><a href={url.loc} target="_blank">{url.name}</a></div>
              )}
            </div>
            <div className="medium-3 columns" styleName="section">
              <h3 styleName="cat">{t('sitemap.publishers')}</h3>
              {data.urlset.othercats.map((url, index) =>
                <div key={index}><a href={url.loc} target="_blank">{url.name}</a></div>
              )}
              </div>*/}
            <div className="medium-3 columns" styleName="section">
              <h3 styleName="cat">{t('sitemap.general')}</h3>
              {data.urlset.home.map((url, index) =>
                <div key={index}><a href={url.loc} target="_blank">{url.name}</a></div>
              )}
            </div>
          </div>
        </section>
        }
        {data &&
          <Footer />
        }
      </div>
    )
  }
}
