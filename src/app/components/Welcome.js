import React from 'react'
import { string, object, bool, func } from 'prop-types'
import ReactModal from 'react-modal'

//const req = require.context('common/style/icons/', false)
//const logoSrc = req('./Welcome.png')
//const logoSrc = req('./message_0618.png')

export default class Welcome extends React.Component {
  /* that component is used to show a 'welcome' image to clients. open status of dialog is set on callee (Topbar.js) */

  static propTypes = {
    isDialogOpened: bool,
    closeDialog: func,
    message: object,
    imageUrl: string,
    landingPage: string
  }

  componentWillMount() {
    ReactModal.setAppElement('#root')
  }

  render() {
    const {message, imageUrl, isDialogOpened, closeDialog} = this.props
    let {landingPage} = this.props
    if (!landingPage || landingPage == '') {
      landingPage = 'javascript:;'
    }

    return (
      <ReactModal
        isOpen={isDialogOpened}
        onRequestClose={closeDialog}
        className="reveal-custom reveal-custom-welcome"
        overlayClassName="reveal-overlay-custom">
        {/* image message with X close div */}
        <div style={{width: '550px', height: '400px'}}>
          <div
            style={{position: 'absolute', top: '0', right: '0', zIndex: '2000', width: '40px', height: '40px', cursor: 'pointer'}}
            onClick={closeDialog}
          >
            &nbsp;
          </div>
          <a href={landingPage} target="_blank">
            <img src={imageUrl} style={{border: 'none'}} />
          </a>
          {/* text message */}
          {/*message &&
            <div>
              <h3>{message.title}</h3>
              <h5>{message.subtitle}</h5>
              <div dangerouslySetInnerHTML={{__html: message.text}}>
              </div>
            </div>
          */}
        </div>
      </ReactModal>
    )
  }
}
