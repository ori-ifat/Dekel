import React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import enhanceWithClickOutside from 'react-click-outside'
import './DateCombo.scss'

const req = require.context('common/style/icons/', false)
const ddowno = req('./ddown.svg').default

export default
@enhanceWithClickOutside 
@observer 
class DateCombo extends React.Component {
  
  @observable shown = false
  @observable selected = ''

  componentDidMount() {
    const {t} = this.props
    this.selected = t('filter.inputDate')
  }

  setShown = () => {
    this.shown = !this.shown
  }

  handleClickOutside() {
    //console.log('handleClickOutside')
    this.shown = false
  }

  choose = (value) => {
    const {chooseDateField, t} = this.props
    this.selected = t(`filter.${value}`)
    chooseDateField(value)
    this.shown = false
  }

  render() {
    const {t} = this.props
    return <div styleName="combo-wrapper">

        <a styleName="combo-triger" onClick={this.setShown}>{this.selected}<img styleName="combo-icon" src={ddowno}/></a>  
        <ul style={this.shown ? null : {display: 'none'}} styleName="combo">                 
          <li styleName="combo-item"><a onClick={() => this.choose('inputDate')}>{t('filter.inputDate')}</a></li>
          <li styleName="combo-item"><a onClick={() => this.choose('presentationDate')}>{t('filter.presentationDate')}</a></li>
          <li styleName="combo-item"><a onClick={() => this.choose('resultDate')}>{t('filter.resultDate')}</a></li>
        </ul>

    </div>
  }
}