import 'react-hot-loader/patch'
import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'mobx-react'
import * as stores from 'stores'
import Foundation from 'lib/foundation' //import the foundation library to the app - top level
import 'lib/foundationInit'   //initialize the foundation library with document.ready (occurs after all components are mounted)
import './global.scss'  //important!! need to import that css here only!!
//use className when needed instead of styleName (foundation stuff), otherwise css will be huge and app will be stuck ....
import '../common/style/reveal.css'
import 'react-select/dist/react-select.css'
import 'antd/dist/antd.css'

function mount() {
  const App = require('./components/App').default
  render(
    <AppContainer>
      <Provider {...stores}>
        <App />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
}

if (module.hot) {
  module.hot.accept('./components/App', mount)
}
mount()
