import React, {Component} from 'react'
import { withRouter } from 'react-router'
import {translate} from 'react-polyglot'
import {logClick} from 'common/services/apiService'

@withRouter
@translate()
export default class Redirector extends Component {

  //static propTypes = {

  //}

  componentDidMount() {
    //implement if needed:
    //const { match: {params: { where }} } = this.props
    //console.log('redirector', where)
    logClick('implementation_needed').then(() => {
      //redirect to somewhere
      //note: hard-coded until implementation
      location.href = 'https://www.nextep.co.il/tkanim/%D7%AA%D7%A7%D7%9F-iso-%D7%A2%D7%91%D7%95%D7%A8-%D7%A2%D7%9E%D7%99%D7%93%D7%94-%D7%91%D7%9E%D7%9B%D7%A8%D7%96%D7%99%D7%9D/?utm_source=Ifat&utm_term=9001'
    })

  }


  render() {
    const {t} = this.props

    return (
      <div style={{marginTop: '50px'}}>
        <div className="grid-container">
          <div className="grid-x grid-padding-x">
            <div className="cell large-12" style={{textAlign: 'center'}}>
              <h2>{t('redirector.pleaseWait')}</h2>
            </div>
          </div>
        </div>
      </div>)
  }
}
