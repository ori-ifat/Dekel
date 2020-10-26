import { RouterStore } from 'mobx-react-router'
import { syncHistoryWithStore } from 'mobx-react-router'
//import createHashHistory from 'history/createHashHistory'
//import createBrowserHistory from 'history/createBrowserHistory'

export const routingStore = new RouterStore()
//export const hashHistory = createHashHistory()
export const browserHistory = require("history").createBrowserHistory() //createBrowserHistory()

//export const history = syncHistoryWithStore(hashHistory, routingStore)
export const history = syncHistoryWithStore(browserHistory, routingStore)
