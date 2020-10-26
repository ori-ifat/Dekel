import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import SearchInput from 'common/components/SearchInput'
import NotLogged from 'common/components/NotLogged'
//import Test from 'components/Test'
//import CSSModules from 'react-css-modules'
import  './search.scss'

@inject('accountStore')

@observer
export default class Search extends Component {

  render() {
    const {accountStore: {profile}} = this.props
    //console.log(profile)
    return (
      <div className="row">
        <div className="column large-12">
          <div styleName="search-div" >
            <SearchInput />
            {/*<Test />*/}
            {/*profile ?
              <div>Hello {decodeURIComponent(profile.contactName)}</div>
              :
              <NotLogged />
            */}
          </div>
        </div>
      </div>
    )
  }
}
