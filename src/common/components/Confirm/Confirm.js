import React from 'react'
import { string, func } from 'prop-types'
import { translate } from 'react-polyglot'
import ReactModal from 'react-modal'
//import CSSModules from 'react-css-modules'
import  './Confirm.scss'

@translate()

export default class Confirm extends React.Component {

  static propTypes = {
    title: string,
    subTitle: string,
    actLabel: string,
    onClose: func
  }

  componentWillMount() {
    ReactModal.setAppElement('#root')
  }

  render() {
    const { title, subTitle, actLabel, onClose, t } = this.props
    return (
      <ReactModal
        isOpen={true}
        onRequestClose={onClose}
        className="reveal-custom"
        overlayClassName="reveal-overlay-custom">
        <div styleName="container">
          <h3 styleName="message">{title}</h3>
          <p styleName="sub">{subTitle}</p>
          <div styleName="button-container">
            <button className="button" styleName="btn" onClick={() => onClose(true)}>{actLabel}</button>
            <button className="clear button secondary" styleName="btn" onClick={() => onClose(false)}>{t('confirm.cancel')}</button>
          </div>
        </div>
      </ReactModal>
    )
  }
}
