import React, {Component, lazy, Suspense} from 'react'
import { withRouter } from 'react-router'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import {getImageUrl, setFavStatus} from 'common/utils/util'
//import ResultsItemDetails from 'common/components/ResultsItemDetails'
import ImageView from 'common/components/ImageView'
import LoginDialog from 'common/components/LoginDialog'
import Loading from 'common/components/Loading/Loading'
//import CSSModules from 'react-css-modules'
import  './tender.scss'

//lazy-load ResultsItemDetails. 
//this is to avoid 401 error before all login procedures are completed (ex. profile cookie io op)
const ResultsItemDetails = lazy(() => import('common/components/ResultsItemDetails'))

export default
@withRouter
@inject('accountStore')
@inject('recordStore')
@observer
class Tender extends Component {

  @observable itemID = -1
  @observable encryptedID = ''
  @observable showImage = false
  @observable imageUrl = ''
  @observable imageTitle = ''
  @observable mode = 'singleItem'

  componentDidMount() {
    const { match: {params: { itemId, mode }} } = this.props
    //this.itemID = parseInt(itemId)
    this.encryptedID = itemId
    if (mode) {
      this.mode = mode
    }
  }

  showViewer = (fileName, title) => {
    const url = getImageUrl(fileName)
    this.imageUrl = url
    this.imageTitle = title
    this.showImage = true
  }

  closeViewer = () => {
    this.showImage = false
  }

  onFav = (tenderID, add) => {
    const {accountStore, recordStore} = this.props
    if (accountStore.profile) {
      setFavStatus(tenderID, add, recordStore.isInChecked, recordStore.push, recordStore.cut)
    }
  }

  render() {
    const {accountStore: {profile}, match: {params: {mode}}} = this.props
    return (
      <div className="row">
        {profile || (mode && mode == 'sample') ?
          <div className="column large-12">
            <div>
              {!this.showImage ?
                <Suspense fallback={<Loading />}>
                  <ResultsItemDetails
                    onClose={this.closeViewer}
                    itemID={this.itemID}
                    encryptedID={this.encryptedID}
                    showViewer={this.showViewer}
                    mode={this.mode}
                    onFav={this.onFav}
                  />
                </Suspense>
                :
                <ImageView
                  onClose={this.closeViewer}
                  url={this.imageUrl}
                  title={this.imageTitle}
                  tenderID={this.itemID}
                />
              }
            </div>
          </div>
          :
          <LoginDialog
            onCancel={f => f}
            fromItem={this.encryptedID}
          />
        }
      </div>
    )
  }
}
