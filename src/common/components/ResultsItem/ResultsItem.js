import React from 'react'
import { object, func, bool } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import {setDateLabel, isDateInRange, cutText, realDate} from 'common/utils/item'
import {getImageUrl} from 'common/utils/util'
import moment from 'moment'
import find from 'lodash/find'
import replace from 'lodash/replace'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import Checkbox from 'common/components/Checkbox'
//import ResultsItemDetails from 'common/components/ResultsItemDetails'
import ItemDetailsModal from 'common/components/ItemDetailsModal'
import ImageView from 'common/components/ImageView'
import Reminder from 'common/components/Reminder'
import LoginDialog from 'common/components/LoginDialog'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
//import CSSModules from 'react-css-modules'
import  './ResultsItem.scss'

const req = require.context('common/style/icons/', false)
const timeSrc = req('./Time.svg').default
const timeActSrc = req('./alert_on.svg').default
const favSrc = req('./fav.svg').default
const favActSrc = req('./action_fav.svg').default
const newTabSrc = req('./new_tab.svg').default

export default
@translate()
@inject('accountStore')
@inject('searchStore')
@observer
class ResultsItem extends React.Component {
  static propTypes = {
    item: object,
    onCheck: func,
    onFav: func,
    setReminder: func,
    checked: bool,
    fav: bool,
    isTable: bool
  }

  @observable isFavorite = false
  @observable viewBig = false
  @observable viewed = false
  @observable showLoginMsg = false
  @observable showImage = false
  @observable imageUrl = ''
  @observable imageTitle = ''
  @observable remindMe = false
  @observable showLoginMsg = false
  @observable reminderID = -1
  @observable newReminderDate = '';

  componentWillMount() {
    //set favorite state from props
    const {fav, item: {reminderID, visited}} = this.props
    this.isFavorite = fav
    this.reminderID = reminderID
    this.viewed = visited
  }

  componentWillReceiveProps(nextProps, nextState) {
    //set favorite state from nextProps - ex. when Toolbar changes the item fav state
    const {fav, item: {reminderID, visited}} = nextProps
    if (this.isFavorite !== fav) this.isFavorite = fav
    this.reminderID = reminderID
    this.viewed = visited
  }

  addFav = () => {
    const { item, onFav, accountStore } = this.props
    if (accountStore.profile) {
      //callee + local fav state
      onFav(item.tenderID, !this.isFavorite)
      this.isFavorite = !this.isFavorite
    }
    else {
      this.showLoginMsg = true
    }
  }

  viewDetails = id => {
    const {accountStore} = this.props
    if (accountStore.profile) {
      this.viewBig = true
      this.viewed = true
    }
    else {
      this.showLoginMsg = true
    }
  }

  closeDetails = () => {
    this.viewBig = false
  }

  showViewer = (fileName, title) => {
    const {accountStore} = this.props
    if (accountStore.profile) {
      const url = getImageUrl(fileName)
      this.imageUrl = url
      this.imageTitle = title
      this.showImage = true
      document.body.style.overflowY = 'hidden'
    }
  }

  closeViewer = () => {
    this.showImage = false
    document.body.style.overflowY = 'visible'
  }

  markUpText = text => {
    /* highlight text if text search\text filter was made */
    const {searchStore} = this.props
    //get text filter or text tag
    const filtered = find(searchStore.filters, filter => {
      return filter.field == 'searchtext'
    })
    
    const tags = filter(searchStore.tags, tag => {
      return tag.resType == 'tender_partial'
    })
    //alter the text to inject as html
    let fixedText = filtered && filtered.values[0] && filtered.values[0].length > 2 ? replace(text, new RegExp(filtered.values[0], 'g'), `<span class="mark-text" style="background-color: yellow">${filtered.values[0]}</span>`) : text    
    forEach(tags, tag => {
      fixedText = tag.name.length > 2 ? replace(fixedText, new RegExp(tag.name, 'g'), `<span class="mark-text" style="background-color: yellow">${tag.name}</span>`) : fixedText      
    })
    return {__html: fixedText}
  }

  remind = open => {
    const {accountStore} = this.props
    if (accountStore.profile) {
      this.remindMe = open
    }
    else {
      this.showLoginMsg = true
    }
  }

  setReminderData = (id, date) => {
    //when reminder data changes (created\updated\deleted),
    //need to update the date label and current reminderID
    this.reminderID = id
    this.newReminderDate = date
  }

  notlogged = () => {
    this.showLoginMsg = true
  }

  continueUnlogged = () => {
    this.showLoginMsg = false
  }  
  
  render() {
    const { accountStore, item, onCheck, checked, onFav, isTable, t } = this.props    
    const cbItem = Object.assign({}, item, {checked, isFavorite: this.isFavorite}) //merge this.isFavorite to current item
    //if logged:
    const logged = accountStore.profile ? true : false
    //display issues
    //const publishDate = setDateLabel(item.publishDate, 'DD-MM-YYYY', t('tender.noDate'))  //if needed - should be: inputDate
    const inputDate = setDateLabel(item.inputDate, 'DD/MM/YYYY', t('tender.noDate'))
    //const tourDate = item.tourDate ? setDateLabel(item.tourDate, 'DD-MM-YYYY', t('tender.noDate')) : null
    const tourDate = realDate(item.tourDate)
    //const presentationDate = item.presentationDate ? setDateLabel(item.presentationDate, 'DD-MM-YYYY', t('tender.noDate')) : null
    const presentationDate = realDate(item.presentationDate)
    const tenderStyle = isTable ? null : 
      checked ? 'tender_summery checked' : 'tender_summery'
    //presentationDate
    const twoDaysLeft = isDateInRange(item.presentationDate, 2)
    const oneDayLeft = isDateInRange(item.presentationDate, 1)
    const noDaysLeft = isDateInRange(item.presentationDate, 0)
    //tourDate
    const twoDaysLeftTour = isDateInRange(item.tourDate, 2)
    const oneDayLeftTour = isDateInRange(item.tourDate, 1)
    const tourToday = isDateInRange(item.tourDate, 0)
    const mustDoTourLabel = (twoDaysLeftTour || oneDayLeftTour || tourToday) && item.mustDoTour ? ` - ${t('tender.mustTour')}` : ''
    //visited
    const visitedStyle = this.viewed ? ' visited' : ''
    //reminder state
    const hasReminder = this.newReminderDate && this.newReminderDate != null && this.newReminderDate != ''
    const reminderToolTip = item.reminderDate ? 
      moment(item.reminderDate).format('DD-MM-YYYY') :
      hasReminder ? moment(this.newReminderDate).format('DD-MM-YYYY') : t('tender.addReminder')
      
    return (
      <div styleName={tenderStyle} >
        <RowType isTable={isTable} 
          item={item}
          onCheck={onCheck}
          onFav={onFav}
          addFav={this.addFav}
          checked={checked}
          isFavorite={this.isFavorite}
          cbItem={cbItem}
          twoDaysLeft={twoDaysLeft}
          oneDayLeft={oneDayLeft}
          noDaysLeft={noDaysLeft}
          twoDaysLeftTour={twoDaysLeftTour}
          oneDayLeftTour={oneDayLeftTour}
          tourToday={tourToday}
          mustDoTourLabel={mustDoTourLabel}
          visitedStyle={visitedStyle}
          newTabSrc={newTabSrc}
          logged={logged}
          inputDate={inputDate}
          hasReminder={hasReminder}
          timeActSrc={timeActSrc}
          timeSrc={timeSrc}
          reminderToolTip={reminderToolTip}
          favActSrc={favActSrc}
          favSrc={favSrc}
          presentationDate={presentationDate}
          tourDate={tourDate}
          markUpText={this.markUpText}
          viewDetails={this.viewDetails}
          remind={this.remind}
          newReminderDate={this.newReminderDate}
          t={t}
        />

        {this.viewBig && !this.showImage && logged &&
        <ItemDetailsModal
          itemID={item.tenderID}
          encryptedID={item.encID}
          onClose={this.closeDetails}
          showViewer={this.showViewer}
          setReminderData={this.setReminderData}
          onFav={onFav}
        />}
        {this.viewBig && this.showImage && logged &&
        <ImageView
          onClose={this.closeViewer}
          url={this.imageUrl}
          title={this.imageTitle}
          tenderID={item.tenderID}
        />
        }
        {this.remindMe && logged &&
        <Reminder
          tenderID={item.tenderID}
          encryptedID={item.encID}
          onClose={() => this.remind(false)}
          setReminderData={this.setReminderData}
          title={item.title}
          presentationDate={item.presentationDate}
          reminderID={this.reminderID}
        />
        }
        {this.showLoginMsg &&
        <LoginDialog
          onCancel={this.continueUnlogged}
        />
        }
        <ReactTooltip styleName="tooltip" />
      </div>
    )
  }
}

const RowType = (props) => {
  return props.isTable ? <ResultsItemRow {...props} /> : <ResultsItemBlock {...props} />
}

const ResultsItemBlock = ({
  item, 
  onCheck,
  onFav, 
  addFav,
  checked, 
  isFavorite,
  cbItem, 
  twoDaysLeft, 
  oneDayLeft, 
  noDaysLeft, 
  twoDaysLeftTour, 
  oneDayLeftTour, 
  tourToday, 
  mustDoTourLabel, 
  visitedStyle,
  newTabSrc,
  logged,
  inputDate,
  hasReminder,
  timeActSrc,
  timeSrc,
  reminderToolTip,
  favActSrc,
  favSrc,
  presentationDate,
  tourDate,
  markUpText,
  viewDetails,
  remind,
  newReminderDate,
  t
}) => { 
  return <div styleName="item_continer" >
  {onCheck && <Checkbox checked={checked} item={cbItem} onChange={onCheck} />}
  <div styleName="content_continer">
    <div styleName="tender_txt_wraper">
      <div>
        {item.detailLevelName == t('tender.exclusive') && <span styleName="label" className="label">{t('tender.exclusive')}</span>}
        {twoDaysLeft && !oneDayLeft && !noDaysLeft && <span styleName="label alert">{t('tender.twoDaysLeft')}</span>}
        {oneDayLeft && !noDaysLeft && <span styleName="label alert">{t('tender.oneDayLeft')}</span>}
        {noDaysLeft && <span styleName="label alert">{t('tender.noDaysLeft')}</span>}
        {twoDaysLeftTour && !oneDayLeftTour && !tourToday && <span styleName="label alert">{`${t('tender.twoDaysLeftTour')}${mustDoTourLabel}`}</span>}
        {oneDayLeftTour && !tourToday  && <span styleName="label alert">{`${t('tender.oneDayLeftTour')}${mustDoTourLabel}`}</span>}
        {tourToday && <span styleName="label alert">{`${t('tender.noDaysLeftTour')}${mustDoTourLabel}`}</span>}
        {item.mustDoTour && !twoDaysLeftTour && !oneDayLeftTour && !tourToday && <span styleName="label alert">{t('tender.mustDoTour')}</span>}
        {item.hasTable === 1 && <span styleName="label camooyot">{t('tender.hasTable')}</span>}
        {item.hasResult === 1 && <span styleName="label results">{t('tender.hasResults')}</span>}
      </div>
      <h3
        onClick={() => viewDetails(item.tenderID)}
        styleName={`item-title${visitedStyle}`}
        dangerouslySetInnerHTML={markUpText(item.title)}></h3>
      <Link to={`/tender/${item.encID}`} target='_blank' styleName="new_tab"><img src={newTabSrc} /></Link>
   
      { logged && item.winners && 
      <div styleName="tender_meta">
        <span>{t('tender.results')}: {item.winners}</span>
      </div>
      }

      { logged &&
      <div styleName="tender_desc">
        <p dangerouslySetInnerHTML={markUpText(item.details)}></p>
      </div>
      }
      <div styleName="tender_meta">        
        <span>{t('tender.tenderNumber')}: </span>
        <span >{item.tenderNumber}</span>
        <span styleName="divider">|</span>
        { logged &&
        <React.Fragment>
          {inputDate &&
            <React.Fragment>
              <span>{t('tender.publishedAt')}: </span>
              <span >{inputDate}</span>
              <span styleName="divider">|</span>                
            </React.Fragment>
          }                  
          <span>{t('tender.publisherLabel')}: </span>
          <span >{item.publisher}</span>          
        </React.Fragment>
        }
                     
      </div>
    </div>

    <div styleName="tender_action_wraper">
      {<ul className="no-bullet">
        <li>
          <a onClick={() => remind(true)}>
            <img 
              src={item.reminderDate && newReminderDate == '' || hasReminder ? timeActSrc : timeSrc} 
              alt="" 
              data-tip={reminderToolTip} 
            />                   
          </a>
        </li>
        {onFav &&
        <li>
          <a onClick={addFav}>
            <img 
              src={isFavorite ? favActSrc : favSrc} 
              alt="" 
              data-tip={isFavorite ? t('tender.removeFromFav') : t('tender.addToFav')} 
            />
          </a>
        </li>}
      </ul>} 
      
      <div styleName="tender-left-info">
        {item.tender2NumericClass && item.tender2NumericClass !== '' && <span>{t('results.numericClassSmall')}:&nbsp; 
          <span data-tip={item.tender2NumericClass}>{cutText(item.tender2NumericClass)}</span>
        </span>}                
        {presentationDate && <span>{t('results.deliveryAt')}:&nbsp;
          <span>{presentationDate}</span>
        </span>}
        {tourDate && 
        <span>{t('results.tourDetails')}:&nbsp;
          <span styleName={item.mustDoTour ? 'tourdate-label' : null}>{tourDate} {item.mustDoTour ? t('results.mustDoTour') : ''}</span>
        </span>}               
      </div>
    </div>
  </div>
</div>
}


const ResultsItemRow = ({
  item, 
  onCheck,
  onFav, 
  addFav,
  checked, 
  isFavorite,
  cbItem,
  hasReminder,
  timeActSrc,
  timeSrc,
  reminderToolTip,
  favActSrc,
  favSrc,
  presentationDate,
  tourDate,
  markUpText,
  viewDetails,
  remind,
  newReminderDate,
  t
}) => { 
  return <div styleName="table_row">    
    <div styleName="checkbox">{onCheck && <Checkbox checked={checked} item={cbItem} onChange={onCheck} style={{backgroundColor: '#fff', height: '100%'}} />}</div>
    <div styleName="cell_item title">
      <div 
        styleName="cell-item" 
        dangerouslySetInnerHTML={markUpText(item.title)} 
        onClick={() => viewDetails(item.tenderID)}
        style={{cursor: 'pointer'}}
      ></div>
    </div>
    <div styleName="cell_item publisher"><div styleName="cell-item">{item.publisher}</div></div>
    <div styleName="cell_item info"><div styleName="cell-item">{item.tenderNumber}</div></div>    
    <div styleName="cell_item info"><div styleName="cell-item">{item.classes}</div></div>
    <div styleName="cell_item info"><div styleName="cell-item">{item.detailLevelName}</div></div>
    <div styleName="cell_item info"><div styleName="cell-item"><span styleName={item.mustDoTour ? 'tourdate-label' : null}>{tourDate} {item.mustDoTour ? t('results.mustDoTour') : ''}</span></div></div>
    <div styleName="cell_item info"><div styleName="cell-item">{presentationDate}</div></div>
    <div styleName="cell_item info-small">
      <ul className="no-bullet">
        <li>
          <a onClick={() => remind(true)}>
            <img 
              src={item.reminderDate && newReminderDate == '' || hasReminder ? timeActSrc : timeSrc} 
              alt="" 
              data-tip={reminderToolTip} 
            />                   
          </a>
        </li>
        {onFav &&
        <li>
          <a onClick={addFav}>
            <img 
              src={isFavorite ? favActSrc : favSrc} 
              alt="" 
              data-tip={isFavorite ? t('tender.removeFromFav') : t('tender.addToFav')} 
            />
          </a>
        </li>}
      </ul>
    </div>    
</div>
}