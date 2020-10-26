import React, {Component, PropTypes} from 'react'

const YouTubeTip = ({title, thumbnail, url}) => {
  return <div className="large-4 columns">
    <a href={url} target="_blank">
      <img src={thumbnail} />
      <h3>{title}</h3>
    </a>
  </div>
}

//export default CSSModules(Opportunity, styles)
export default YouTubeTip
