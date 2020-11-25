import React, {Component} from 'react'
import { withRouter } from 'react-router'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import {getHomeJSON} from 'common/services/apiService'
import SmallContactForm from 'common/components/SmallContactForm'
import Footer from 'common/components/Footer'
import GTAG from 'common/utils/gtag'
import DocumentMeta from 'react-document-meta'
import {getMetaData} from 'common/utils/meta'
//import CSSModules from 'react-css-modules'
import  './article.scss'

@withRouter
@translate()

@observer
export default class Article extends Component {

  @observable article;

  componentDidMount() {
    const { match: {params: { id }} } = this.props
    getHomeJSON('Articles', `article${id}`).then(res => {
      this.article = res
    })
    GTAG.trackPage('Article', `article/${id}`)
  }


  render() {
    const {t} = this.props
    const {article} = this
    const pageName = article ? article.title : ''
    const meta = getMetaData(t('meta.pageTitle', {pageName}), t('meta.pageDesc', {pageName}), t('meta.pageKW', {pageName}))

    return (
      <div>
        {article &&
        <section id="articals">
          <DocumentMeta {...meta} />
          <div className="row">
            <div className="large-8 columns">
              <h1 styleName="title">{article.title}</h1>
              <p styleName="meta-data">{article.date} <span styleName="v_line">|</span>{article.author}</p>
            </div>
          </div>
          <div className="row">
            <div className="large-8 columns">
              <div styleName="post_wrapper">
                <hr styleName="divider" />
                <h3 styleName="subtitle">{article.subtitle}</h3>
                <div dangerouslySetInnerHTML={{__html: article.textPart1}}>
                </div>
                <img src={article.image} alt={article.title} />
                <div dangerouslySetInnerHTML={{__html: article.textPart2}}>
                </div>
              </div>
            </div>
            <div className="large-4 columns">
              <SmallContactForm
                bigMode={true}
              />
            </div>
          </div>
        </section>
        }
        {article &&
          <Footer />
        }        
      </div>
    )
  }
}
