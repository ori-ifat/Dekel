import React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import enhanceWithClickOutside from 'react-click-outside'
import './DateCombo.scss'

export default
@enhanceWithClickOutside 
@observer 
class DateCombo extends React.Component {
  
  @observable shown = false

  setShown = () => {
    this.shown = !this.shown
  }

  handleClickOutside() {
    //console.log('handleClickOutside')
    this.shown = false
  }

  render() {
    const {chooseDateField, t} = this.props
    return <ul styleName="combo-wrapper">
      <li styleName="combo-container">
        <a onClick={this.setShown}>show</a>  
        <ul style={this.shown ? null : {display: 'none'}} styleName="combo">                 
          <li styleName="combo-item"><a onClick={() => chooseDateField('inputDate')}>{t('filter.inputDate')}</a></li>
          <li styleName="combo-item"><a onClick={() => chooseDateField('presentationDate')}>{t('filter.presentationDate')}</a></li>
          <li styleName="combo-item"><a onClick={() => chooseDateField('resultDate')}>{t('filter.resultDate')}</a></li>
        </ul>
      </li>
    </ul>
  }
}