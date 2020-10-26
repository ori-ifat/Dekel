import React from 'react'
import { translate } from 'react-polyglot'
//import CSSModules from 'react-css-modules'
import  './NotLogged.scss'

@translate()

export default class NotLogged extends React.Component {

  render() {
    const {t} = this.props
    return (
      <div className="row" style={{paddingTop: '50px'}}>
        <div className="large-12 columns">
          <h3>{t('login.subscribeTitle')}</h3>
        </div>
      </div>
    )
  }
}
