import React, {Component, PropTypes} from 'react'
import { Link } from 'react-router-dom'
//import CSSModules from 'react-css-modules'
import  './articles.scss'

const ArticleItem = ({id, title, date, author, image}) => {
  const url = `/article/${id}`
  return <Link styleName="article_ttl" to={url} target="_blank">
    <div className="media-object stack-for-small">
      <div className="media-object-section">
        <img src={image} />
      </div>
      <div className="media-object-section main-section">
        <h3 styleName="article-title">{title}</h3>
        <p styleName="post_meta">{date}<span styleName="v_line">|</span> {author} </p>
      </div>
    </div>
  </Link>
}

export default ArticleItem
