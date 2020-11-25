import React, {Component} from 'react'
import { string, number, func } from 'prop-types'
import {logImageView} from 'common/services/apiService'
import ImageViewer from 'react-image-viewer-zoom'
import 'react-image-viewer-zoom/dist/style.css'
import './style.scss'

const req = require.context('common/style/icons/', false)
const closeSrc = req('./close.svg').default

class ImageView extends Component {

  static propTypes = {
    onClose: func,
    url: string,
    title: string,
    tenderID: number
  }

  componentDidMount() {
    const {tenderID} = this.props
    logImageView(tenderID)
  }

  render() {
    //src: 'http://www.gettyimages.com/gi-resources/images/Embed/new/embed2.jpg', title: 'title', content: 'content'
    const {url, title} = this.props
    const images = [
      { src: url, title }
    ]

    return (
      <div>
        <a onClick={this.props.onClose} className="close-button-img"><img src={closeSrc}/></a>
        <ImageViewer
          showPreview={true}
         	showIndex={false}
          prefixCls="react-image-viewer"
          activeIndex={0}
          images={images} />

      </div>
    )
  }
}

export default ImageView
