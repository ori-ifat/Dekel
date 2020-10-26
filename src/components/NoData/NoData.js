import React from 'react'
import { object } from 'prop-types'
import { translate } from 'react-polyglot'
//import CSSModules from 'react-css-modules'
import  './NoData.scss'

@translate()

export default class NoData extends React.Component {
  static propTypes = {
    error: object
  }

  render() {
    const { error, t } = this.props
    //if error flag has been raised on searchStore, show error label (decide also if to show details...)
    return (
      <div>
        {error ?
          <h2 styleName="error">
            { error.statusCode != 401 ?
              t('results.error')
              :
              t('results.login')
            }
          </h2>
          :
          <h1 styleName="no-data">{t('results.noData')} </h1>
        }
      </div>
    )
  }
}
