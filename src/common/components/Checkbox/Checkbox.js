import React from 'react'
import { bool, object, func } from 'prop-types'
import { observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
//import CSSModules from 'react-css-modules'
import  './Checkbox.scss'


@observer
export default class Checkbox extends React.Component {

  static propTypes = {
    checked: bool,
    item: object,
    onChange: func,
    style: object
  }

  @observable checked = false

  componentWillMount() {
    const {checked} = this.props
    this.checked = checked
  }

  componentWillReceiveProps(nextProps) {
    if (this.checked !== nextProps.checked) this.checked = nextProps.checked
  }

  onCheck = e => {
    e.stopPropagation()
    const {item, onChange} = this.props
    this.checked = e.target.checked
    onChange(e.target.checked, item.tenderID, item.isFavorite)
  }

  render() {
    const {item, style} = this.props
    const cbStyle = this.checked ? 'checkbox_continer checked' : 'checkbox_continer'

    return (
      <div styleName={cbStyle} style={style}>
        <div className="checkbox">
          <input type="checkbox"
            className="checkbox_tender"
            checked={this.checked}
            value={item.tenderID}
            onChange={this.onCheck} />
        </div>
      </div>
    )
  }
}
