import React, {Component, PropTypes} from 'react'
import { Link } from 'react-router-dom'
//import CSSModules from 'react-css-modules'
import  '../home.scss'

const Article = ({articleID, title, imgSrc}) => {
  const url = `/article/${articleID}`
  return  <div className="medium-4 small-12 columns">
    <Link to={url}>
      <img src={imgSrc} alt={title} />
      <h3 styleName="one-article-title">{decodeURIComponent(title)}</h3>
    </Link>
  </div>
}

export default Article
