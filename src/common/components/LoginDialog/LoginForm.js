import React, {Component, PropTypes} from 'react'
//import CSSModules from 'react-css-modules'
import  './LoginDialog.scss'

const LoginForm = ({accountStore, error, userName, password, updateField, onKeyDown, login, toggleRestore, remember, t}) => {
  const errorMessage = error && error == 'username or password are not correct' ? t('login.badUserPass') : ''
  return <div>
    <p styleName="subttl">{t('login.subscribeSubTitle')}</p>
    {error != null && accountStore.profile == null &&
      <div styleName="error_box">{errorMessage}</div>
    }
    <div styleName="input-placeholder">
      <input
        type="text"
        name="userName"
        placeholder={t('login.usernameLabel')}
        value={userName}
        onChange={updateField}
        onKeyDown={e => onKeyDown(e, 'login')}
      />
    </div>
    <div styleName="input-placeholder">
      <input
        type="password"
        name="password"
        placeholder={t('login.passwordLabel')}
        value={password}
        onChange={updateField}
        onKeyDown={e => onKeyDown(e, 'login')}
      />
    </div>
    <input type="checkbox" name="rememberMe" onChange={updateField} checked={remember} />
    {t('login.rememberMe')}
    {toggleRestore && <a onClick={toggleRestore} style={{paddingRight: '20px'}}>{t('login.forgotPassword')}</a>}
    <div>
      <button styleName="button-submit" onClick={login}>{t('login.login')}</button>
    </div>
  </div>
}
export default LoginForm
