import React, {Component, PropTypes} from 'react'
//import CSSModules from 'react-css-modules'
import  './services.scss'

const ServiceItem = ({title, text, image}) => {
  return <div className="medium-6 small-12 columns">
    <div styleName="service_container">
      <div className="media-object">
        <div className="media-object-section">
          <img src={image} />
        </div>
        <div className="media-object-section" styleName="middle">
          <h2 styleName="service-title">{title}</h2>
        </div>
      </div>
      <div styleName="services_text">
        <p dangerouslySetInnerHTML={{__html: text}}></p>
      </div>
    </div>
  </div>
}

export default ServiceItem