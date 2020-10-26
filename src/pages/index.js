import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { accountStore } from 'stores'
import Topbar from 'app/components/Topbar'
import ContactAction from 'common/components/ContactAction'
import HomePage from 'pages/home'
import SearchPage from 'pages/search'
import ResultsPage from 'pages/results'
import MainPage from 'pages/main'
import TenderPage from 'pages/tender'
import FavoritesPage from 'pages/favorites'
import RemindersPage from 'pages/reminders'
import PublishPage from 'pages/publish'
import ContactPage from 'pages/contact'
//import SubscriptionsPage from 'pages/subscriptions'
import ServicesPage from 'pages/services'
import ThankYouPage from 'pages/thankyou'
import ArticlesPage from 'pages/articles'
import ArticlePage from 'pages/article'
import CategoryPage from 'pages/category'
import SmartAgentPage from 'pages/smartagent'
import RadarPage from 'pages/radar'
import AboutPage from 'pages/about'
import SiteMapPage from 'pages/sitemap'
import AutoLoginPage from 'pages/autologin'
import LoginPage from 'pages/login'
import DistAgentPage from 'pages/distagent'
import RedirectorPage from 'pages/redirector'
import RestorePage from 'pages/restore'
import NotFound404 from 'pages/notFound404'

class Pages extends React.Component {
  state = {
    notify: false
  }

  showNotification = (notify) => {
    this.setState({notify})
    //console.log('notify', notify)
  }

  render() {
    return (
      <section>
        <Topbar notify={this.state.notify} />
        <Switch>        
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/home/:opencats?">
            <HomePage />
          </Route>
          <Route path="/results/:sort/:tags/:filters/:isHome?">
            <ResultsPage />
          </Route>
          <Route path="/main">
            <MainPage
              showNotification={this.showNotification}
            />
          </Route>
          <Route path="/search">
            <SearchPage />
          </Route>
          
          <Route path="/tender/:itemId/:mode?">
            <TenderPage />
          </Route>
          <Route path="/smartagent">
            <SmartAgentPage
              showNotification={this.showNotification}
            />
          </Route>
          <Route path="/favorites">
            <FavoritesPage
              showNotification={this.showNotification}
            />
          </Route>
          <Route path="/reminders">
            <RemindersPage
              showNotification={this.showNotification}
            />
          </Route>
          <Route path="/publish">
            <PublishPage
              showNotification={this.showNotification}
            />
          </Route>
          <Route path="/contact">
            <ContactPage
              showNotification={this.showNotification}
            />
          </Route>         
          <Route path="/services">
            <ServicesPage
              showNotification={this.showNotification}
            />
          </Route>
          <Route path="/thankyou">
            <ThankYouPage />
          </Route>
          <Route path="/articles">
            <ArticlesPage />
          </Route>
          <Route path="/article/:id">
            <ArticlePage />
          </Route>
          <Route path="/category/:id/:name/:mode?">
            <CategoryPage />
          </Route>
          <Route path="/radar/:tender?">
            <RadarPage />
          </Route>
          <Route path="/about">
            <AboutPage />
          </Route>
          <Route path="/sitemap">
            <SiteMapPage />
          </Route>          
          <Route path="/al/:token/:tender?">
            <AutoLoginPage />
          </Route>
          <Route path="/login/:tender?">
            <LoginPage />
          </Route>
          <Route path="/distagent/:uid/:type?">
            <DistAgentPage
              showNotification={this.showNotification}/>
          </Route>
          <Route path='/redirector/:where?'>
            <RedirectorPage />
          </Route>
          <Route path="/restore/:token">
            <RestorePage
              showNotification={this.showNotification} />
          </Route>
          <Route>
            <NotFound404 />
          </Route>
        </Switch>
        <ContactAction />{/*should be here only*/}
      </section>
    )
  }
}
export default Pages
