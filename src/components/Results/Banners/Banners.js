import React from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {getBanners2/*, getHomeJSON*/} from 'common/services/apiService'
import {randomNumber} from 'common/utils/util'
//import CSSModules from 'react-css-modules'
import  './Banners.scss'


@observer
export default class Banners extends React.Component {

  @observable banners = [];

  componentDidMount() {
    //json data for hard-coded stuff:
    /*const cache = randomNumber(100000, 1000000)
    getHomeJSON('Banners', 'banners', cache).then(res => {
      this.banners = res.banners
    })*/
    getBanners2().then(res => {
      this.banners = res
    })
  }

  render() {
    //console.log(this.banners)
    const cache = randomNumber(100000, 1000000)
    return(
      <div style={{paddingTop: '20px'}}>
        {
          this.banners.map((banner, index) =>
            banner.type == 'html'
              ?
              <HtmlBanner
                key={index}
                id={banner.id}
                url={banner.url}
                landingPage={banner.landingPage}
                width={banner.width}
                height={banner.height}
                cache={cache}
              />
              :
              <ImageBanner
                key={index}
                id={banner.id}
                url={banner.url}
                landingPage={banner.landingPage}
                width={banner.width}
                height={banner.height}
                cache={cache}
              />
          )
        }
      </div>
    )
  }
}

const HtmlBanner = ({id, url, landingPage, width, height, cache}) => {
  return <iframe
    id={`Banner${id}`}
    width={width}
    height={height}
    src={`${url}?cache=${cache}`}
    style={{border: 'none', marginBottom: '10px'}}
  ></iframe>
}

const ImageBanner = ({id, url, landingPage, width, height, cache}) => {
  return <div
    id={`Banner${id}`}
    width={width}
    height={height}
    style={{marginBottom: '10px'}}>
    {landingPage && landingPage !== '' ?
      <a href={landingPage} target="_blank">
        <img
          src={`${url}?cache=${cache}`}
          width={width}
          height={height}
        />
      </a> :
      <img
        src={`${url}?cache=${cache}`}
        width={width}
        height={height}
      />}
  </div>
}
