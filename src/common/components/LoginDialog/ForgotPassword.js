import React, {Component, PropTypes} from 'react'
//import CSSModules from 'react-css-modules'
import  './LoginDialog.scss'

const ForgotPassword = ({accountStore, userName, email, updateField, onKeyDown, restore, toggleRestore, sentMessage, sentError, t}) => {
  return <div>
    <p styleName="subttl">{t('login.forgotPasswordEx')}</p>
    {accountStore.error != null && accountStore.profile == null &&
      <div styleName="error_box">{accountStore.errorMessage}</div>
    }
    {
      sentMessage !== '' && <div styleName={sentError ? 'error_box' : 'error_box green'}>{sentMessage}</div>
    }
    <div styleName="input-placeholder">
      <input
        type="text"
        name="userName"
        placeholder={t('login.usernameLabel')}
        value={userName}
        onChange={updateField}
        onKeyDown={e => onKeyDown(e, 'restore')}
      />
    </div>
    <div styleName="input-placeholder">
      <input
        type="email"
        name="email"
        placeholder={t('login.emailLabel')}
        value={email}
        onChange={updateField}
        onKeyDown={e => onKeyDown(e, 'restore')}
      />
    </div>
    <div style={{height: '74px'}}>
      <a onClick={toggleRestore}>{t('login.backToLogin')}</a>
    </div>
    <div>
      <button styleName="button-submit" onClick={restore}>{t('login.restore')}</button>
    </div>
  </div>
}
export default ForgotPassword
