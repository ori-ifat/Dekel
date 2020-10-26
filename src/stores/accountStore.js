import { action, computed, observable, toJS } from 'mobx'
import { me, login, logout, tokenLogin } from 'common/services/apiService'
import {setCookie, deleteCookie /*, getCookie*/} from 'common/utils/cookies'

class Account {

  @observable loading = false
  @observable profile = null
  @observable error = null
  @observable errorMessage = null

  constructor() {
    this.loadProfile()
  }

  @action.bound
  async loadProfile() {
    try {
      const profile = await me()
      this.profile = profile
      //console.log('profile loaded')
      setCookie('DekelUserData', toJS(this.profile), { expires: 365, sameSite: 'lax' })
      //localStorage.setItem('DekelUserData', JSON.stringify(toJS(this.profile)))
    } catch (e) {
      console.log('error', e)
      this.profile = null
    }
    /*me().then(profile => {
      this.profile = profile    //this is what should happen when api is complete      
      console.log('Me', this.profile)
    })*/
  }

  @action.bound
  async login(userName, password) {
    /*
    return new Promise((resolve, reject) => {
      login(userName, password).then(profile => {
        this.profile = profile
        this.error = null
        console.log('login', this.profile)
        setCookie('DekelUserData', toJS(this.profile), { expires: 365, sameSite: 'lax' })
        //localStorage.setItem('DekelUserData', JSON.stringify(toJS(this.profile)))
        //const s = getCookie('DekelUserData')
        //console.log('cookie:', s)      
        resolve()
      }).catch(error => {
        this.error = error
        this.profile = null
      })
    })*/
    //use with async\await 
    try {
      this.error = null
      this.errorMessage = null
      this.profile = await login(userName, password)
      //console.log('after login');      
      setCookie('DekelUserData', toJS(this.profile), { expires: 365, sameSite: 'lax' })
      //const s = getCookie('DekelUserData')
      //console.log('cookie:', s)      
    }
    catch(e) {
      this.error = `[accountStore] login error: ${e.message} http status code ${e.error.status}`
      //this.errorMessage = e.message   //friendly message returns from api
      this.errorMessage = e.error.status == 400 ? 'username or password are not correct' : e.error.statusText
    }

    if (this.error != null) {
      console.error(this.error)
    }
  }

  @action.bound
  async tokenLogin(token) {
    try {
      this.error = null
      this.errorMessage = null
      this.profile = await tokenLogin(token)
      setCookie('DekelUserData', toJS(this.profile), { expires: 365, sameSite: 'lax' })
      //localStorage.setItem('DekelUserData', JSON.stringify(toJS(this.profile)))
    }
    catch(e) {
      this.error = `[accountStore] login error: ${e.message} http status code ${e.error.status}`
      this.errorMessage = e.message   //friendly message returns from api
    }

    if (this.error != null) {
      console.error(this.error)
    }
  }

  @action.bound
  async logout() {
    this.profile = null
    await logout()  //this actully returns { ok: true } or such.
    //clean the userdata cookie    
    deleteCookie('DekelUserData')
    //localStorage.removeItem('DekelUserData')
    //delete also the autologin cookie
    deleteCookie('AutoLogin')
    //const s = getCookie('DekelUserData')
    //console.log('cookie (deleted)', s) 
    this.error = null    
  }
}

export const accountStore = new Account()
