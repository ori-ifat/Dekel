import React, {Component, PropTypes} from 'react'
//import CSSModules from 'react-css-modules'
import  '../home.scss'

const Testemonial = ({name, desc}) => {
  return  <div className="large-4 medium-4 small-12 columns">
    <div className="tes_wrapper">
      <p>{desc}</p>
      <p styleName="tes_name">{name}</p>
    </div>
  </div>
}

export default Testemonial
