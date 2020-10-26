import React from 'react'
import { Link } from 'react-router-dom'
import {getSrc} from './imageResolver'
//import CSSModules from 'react-css-modules'
import  '../home.scss'


const CatItem = ({count, classID, catName}) => {  
  const url = `/results/InputDate/[{"I":${classID},"R":"s"}]/[]/true`
  return <div styleName="blockitem" className="column column-block">
    <Link to={url} className="main_cat">
      <span styleName="cat_num">{count.toLocaleString()}</span>
      <h3 styleName="cat_name">{catName}</h3>
      <img src={getSrc(classID)} alt={catName} styleName="cat_icon" />
    </Link>
  </div>
}

export default CatItem
