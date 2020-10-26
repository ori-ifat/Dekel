import React, {Component} from 'react'
import { withRouter } from 'react-router'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import {getHomeJSON, getSampleTenders2, getSampleTendersBySub} from 'common/services/apiService'
import moment from 'moment'
import ContactUs from 'common/components/ContactUs'
import CatRecord from './CatRecord'
import Footer from 'common/components/Footer'
import DocumentMeta from 'react-document-meta'
import {getMetaData} from 'common/utils/meta'
//import CSSModules from 'react-css-modules'
import  './category.scss'

@withRouter
@translate()

@observer
export default class Category extends Component {

  @observable data;
  @observable count = 0;
  @observable tenders = []

  componentWillMount() {
    this.getCatData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.getCatData(nextProps)
  }

  getCatData = (props) => {
    const { match: {params: { id, name, mode }} } = props
    getHomeJSON('Categories', name).then(res => {
      this.data = res
      window.scrollTo(0, 0)
    })
    if(mode && mode == 'cat') {
      getSampleTendersBySub(id).then(res => {
        this.tenders = res.list
        this.count = res.lastYear
      })
    }
    else {
      getSampleTenders2(id).then(res => {
        this.tenders = res.list
        this.count = res.lastYear
      })
    }
  }


  render() {
    const {match: {params: { name }}, t} = this.props
    const {data} = this
    const title = data ? data.title : ''
    const caption = t('footer.tenders')
    const reg = new RegExp(`${caption} `, 'g')
    const short = data ? title.replace(reg, '') : ''
    const tag = t(`footer.${name}`)
    const metaTitle = t('meta.catResultsTitle', {tag})
    const metaDesc = t('meta.catResultsDesc', {tag})
    const metaKW = t('meta.catKeywords', {tag})
    const meta = getMetaData(metaTitle, metaDesc, metaKW)

    return (
      <div>
        {data &&
        <section>
          <DocumentMeta {...meta} />
          <div className="row">
            <div className="large-12 columns">
              <h3 styleName="pre-title">{title}</h3>
              <h1 styleName="title"><span styleName="num">{this.count}</span> {t('results.title')} {t('results.lastYear')}</h1>
              <p styleName="subttl" dangerouslySetInnerHTML={{__html: t('cat.subTitle', {short})}}></p>
              <hr/>
            </div>
          </div>

          <div className="row">
            <div className="large-12 columns">
              {this.tenders && this.tenders.length > 0 && this.tenders.map((tender, index) =>
                <CatRecord
                  key={index}
                  date={moment(tender.releaseDate).format('DD/MM/YYYY')}
                  title={tender.title}
                  subSubject={tender.subsubjectName}
                />
              )}
            </div>
          </div>
          <div className="row" style={{marginTop: '3rem'}}>
            <div className="large-12 columns">
              <ContactUs title={t('cat.contactTitle', {title})} />
            </div>
          </div>
          <div className="row" style={{marginTop: '3rem'}}>
            <div className="large-12 columns">
              <div styleName="wraper">
                {
                  data.text && <div dangerouslySetInnerHTML={{__html: data.text}}></div>
                }
              </div>
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
