import React from 'react'
import { Link } from 'react-router-dom'
//import CSSModules from 'react-css-modules'
import  '../home.scss'

const SubCatItem = ({count, classID, catName, isFather}) => {
  const type = isFather ? 'f' : 's'
  const url = `/results/InputDate/[{"I":${classID},"R":"${type}"}]/[]/true`
  const style = isFather ? {color: '#EF1816', fontWeight: 'bold'} : {paddingRight: '23px'}
  return <div styleName="blockitem_sub" className="column column-block">
    <Link to={url} styleName="subcat" style={style}>
      {catName}<span>{count > 0 ? ` - ${count.toLocaleString()}`: ''}</span>
    </Link>
  </div>
}

export default SubCatItem
