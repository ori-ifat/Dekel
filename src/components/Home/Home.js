import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import { withRouter } from 'react-router'
import SearchInput from 'common/components/SearchInput'
import CatItem from './Items/CatItem'
import SubCatItem from './Items/SubCatItem'
import ContactUs from 'common/components/ContactUs'
import Opportunity from './Items/Opportunity'
import Testemonial from './Items/Testemonial'
import TenderItem from './Items/TenderItem/TenderItem'
import Article from './Items/Article'
import YouTubeTip from './Items/YouTubeTip'
import Footer from 'common/components/Footer'
import Loading from 'common/components/Loading/Loading'
import moment from 'moment'
import {getHomeJSON} from 'common/services/apiService'
import {getMetaData} from 'common/utils/meta'
import {fixTopMenu} from 'common/utils/topMenu'
import { Link } from 'react-router-dom'
import DocumentMeta from 'react-document-meta'
import GTAG from 'common/utils/gtag'
//import {randomNumber} from 'common/utils/util'
//import CSSModules from 'react-css-modules'
import  './home.scss'
import '../../common/style/home.css'

export default
@withRouter
@translate()
@inject('homeStore')
@inject('accountStore')
@inject('routingStore')
@observer
class Home extends Component {

  @observable allCats = false
  @observable opportunities = []
  @observable testemonials = []
  //@observable articles = []
  //@observable movies = []
  @observable flatCats = []

  componentDidMount() {
    const {homeStore,  match: {params: { opencats }}, accountStore: {profile}, routingStore: {push}} = this.props
    if (profile) {
      //allow io actions to complete (ex. cookie\localStorage profile read and write)
      setTimeout(() => {
        push('/main')
      }, 200)
    }
    else {
      homeStore.loadCatResults().then(() => {
        homeStore.loadSubCatResults().then(() => {
          //flatten the fatherClass array so it would fit the design.
          homeStore.subCatResults.map(cat => {
            const obj = {
              classID: cat.fatherClassID,
              className: cat.fatherClassName,
              count: 0,
              isFather: true
            }
            this.flatCats.push(obj)
            this.flatCats = [...this.flatCats, ...cat.classes]            
          })
        })
      })
      homeStore.loadSampleTenders()
      //json data for hard-coded stuff:
      /* //const cache = randomNumber(100000, 1000000)
      const cache = 100001  //if needed, use the random number when articles change
      getHomeJSON('Articles', 'articles-preview', cache).then(res => {
        this.articles = res
      })*/
      getHomeJSON('Opportunities', 'opportunities').then(res => {
        this.opportunities = res
      })
      getHomeJSON('Testemonials', 'testemonials').then(res => {
        this.testemonials = res
      })
      /*getHomeJSON('Movies', 'movies', cache).then(res => {
        this.movies = res
      })*/
      fixTopMenu()
      if (opencats && opencats == 'open') {
        this.allCats = true //open all cats by default
      }
      GTAG.trackPage('Home', 'home')
    }
  }

  componentDidUpdate(prevProps) {
    //console.log('componentDidUpdate', prevProps)
    const {accountStore: {profile}, routingStore: {push}} = this.props       
    if (profile) {
      //allow io actions to complete...
      setTimeout(() => {
        push('/main')
      }, 200)         
    }
  }

  showAllCats = () => {
    this.allCats = !this.allCats
  }

  render() {
    const {homeStore, homeStore: {resultsLoading}, accountStore: {profile},  t} = this.props
    const catStyle = this.allCats ? '' : 'hide'
    const catLabel = this.allCats ? t('home.hideAllCat') : t('home.showAllCat')
    const meta = getMetaData(t('meta.homeTitle'), t('meta.homeDesc'), t('meta.homeKeywords'))

    return (
      <div className="bg">
        <DocumentMeta {...meta} />
        {!profile && <React.Fragment>
          <section styleName="hero">
            <div className="row">
              <div className="columns large-12">
                <h1 styleName="hero_txt">{t('home.mainTitle')}</h1>
                <p styleName="sub_head">{t('home.subTitle')}</p>
              </div>
            </div>
            <div className="row">
              <div className="column large-12 large-centered">
                <SearchInput />
              </div>
            </div>

          </section>

          <section id="categories">
            <div className="row">
              <div className="large-12 columns">
                <h2 styleName="cat-title" >{t('home.catTitle')}</h2>
                <div className="row collapse small-up-1 medium-up-2 large-up-4">
                  {resultsLoading && <Loading />}
                  {!resultsLoading && homeStore.catResults.map((cat, index) =>
                    <CatItem
                      key={index}
                      count={cat.count}
                      classID={cat.classID}
                      catName={cat.className}
                    />)
                  }
                </div>

                <div id="other_cat" styleName={catStyle}>
                  <div className="row collapse small-up-1 medium-up-2 large-up-4">
                    {!resultsLoading && this.flatCats.map((cat, index) =>
                      <SubCatItem
                        key={index}
                        count={cat.count}
                        classID={cat.classID}
                        catName={cat.className}
                        isFather={cat.isFather}
                      />)
                    }
                    {/*!resultsLoading && homeStore.subCatResults.map((cat, index) => {
                      const classes = cat.classes.map((clsItem, index) => <SubCatItem
                        key={`cls_${index}`}
                        count={clsItem.count}
                        classID={clsItem.classID}
                        catName={clsItem.className}
                      />)
                      return <React.Fragment>
                        <SubCatItem
                          key={index}
                          count={0}
                          classID={cat.fatherClassID}
                          catName={cat.fatherClassName}
                        />
                        <span>{classes}</span>
                      </React.Fragment>})
                    */}
                  </div>
                </div>

                <a onClick={this.showAllCats} styleName="show_all">{catLabel}</a>
              </div>
            </div>
          </section>
          <section style={{marginTop: '5rem'}}>
            <div className="row collapse">
              <div className="large-12 columns">
                <ContactUs />
              </div>
            </div>
          </section>
          <section id="fetuers" styleName="fetuers">
            <div className="row">
              <div className="large-12 columns">
                <h2 styleName="fet_ttl_main" >{t('home.advantages')}</h2>
              </div>
            </div>

            <div className="row">
              {this.opportunities && this.opportunities.length > 0 &&
              this.opportunities.map((opportunity, index) =>
                <Opportunity
                  key={index}
                  title={opportunity.title}
                  desc={opportunity.text}
                  imgSrc={opportunity.image}
                />)}
            </div>
          </section>

          <section id="testemonials" styleName="testemonials-wrapper">
            <div className="row">
              <div className="large-12 columns">
                <h2 styleName="tes-title" >{t('home.testemonials')}:</h2>
              </div>
            </div>
            <div className="row">
              {this.testemonials && this.testemonials.length > 0 &&
              this.testemonials.map((testemonial, index) =>
                <Testemonial
                  key={index}
                  name={testemonial.title}
                  desc={testemonial.text}
                />)
              }
            </div>
          </section>

          <Footer /> 
        </React.Fragment>}       
      </div>
    )
  }
}
