import React from 'react'
import { string, object } from 'prop-types'
import { /*inject,*/ observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
//import filter from 'lodash/filter'
//import remove from 'lodash/remove'
//import find from 'lodash/find'
import {doFilter} from 'common/utils/filter'
//import CSSModules from 'react-css-modules'
import  './SearchTextFilter.scss'

export default 
@translate()
//@inject('searchStore')
@observer
class SearchTextFilter extends React.Component {

  static propTypes = {
    field: string,
    title: string,
    text: string,
    store: object
  }

  @observable text = ''

  componentDidMount() {
    const {text} = this.props
    this.text = text
  }

  componentWillReceiveProps(nextProps) {
    const {text} = nextProps
    this.text = text
  }

  doFilter = () => {
    const { store, field } = this.props
    //if (!this.text || this.text == null) this.text = ''
    //doFilter(store, 'searchtext', [this.text])
    doFilter(store, field, [this.text])
  }

  onChange = e => {
    this.text = e.target.value
    //console.log(toJS(this.text))
    //this.doFilter()  //too slow
  }

  onKeyDown = e => {
    this.text = e.target.value  //may cause null if it does not happen here
    if (e.keyCode === 13) {
      setTimeout(() => {
        this.doFilter()
      }, 150) //to allow action to complete
    }
  }

  onBlur = e => {
    this.text = e.target.value  //may cause null if it does not happen here
    //console.log(toJS(this.text))
    setTimeout(() => {
      this.doFilter()
    }, 150) //to allow action to complete
  }

  render() {
    const {title, t} = this.props
    return(
      <div styleName="free_search">
        <h4>{title}</h4>
        <input type="text"
          placeholder={t('filter.search')}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onBlur={this.onBlur} />
      </div>
    )
  }
}
