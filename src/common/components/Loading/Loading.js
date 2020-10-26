import React, {Component, PropTypes} from 'react'
import { PulseLoader } from 'react-spinners'
//import CSSModules from 'react-css-modules'
import  './Loading.scss'


const Loading = ({}) => {

  return <div styleName="loading_continer" className='sweet-loading'>
    <PulseLoader
      color="#ED1D24"
      loading={true}
    />
  </div>
}

export default Loading
