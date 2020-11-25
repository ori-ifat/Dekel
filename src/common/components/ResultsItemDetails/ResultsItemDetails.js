import React from 'react'
import { number, string, func } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import {setDateLabel, isDateInRange, cutText} from 'common/utils/item'
import {createUrl, getEmailData, setReminder, clearCache} from 'common/services/apiService'
import moment from 'moment'
//import ImageView from 'common/components/ImageView'
import Row from './Row'
import GetInfo from 'components/GetInfo'
import Reminder from 'common/components/Reminder'
import ReactTooltip from 'react-tooltip'
//import Feedback from './Feedback'
import Loading from 'common/components/Loading/Loading'
import { Link } from 'react-router-dom'
import {getCookie} from 'common/utils/cookies'

//import CSSModules from 'react-css-modules'
import  './ResultsItemDetails.scss'

const req = require.context('common/style/icons/', false)
const thumbSrc = req('./preview.svg').default
const docSrc = req('./doc.svg').default
const printSrc = req('./print_gray.svg').default
const mailSrc = req('./mail_gray.svg').default
const alertSrc = req('./alert.svg').default
const alertActSrc = req('./alert_on.svg').default
const favSrc = req('./fav.svg').default
const favActSrc = req('./action_fav.svg').default

export default
@translate()
@inject('itemStore')
@observer
class ResultsItemDetails extends React.Component {

  static propTypes = {
    itemID: number,
    encryptedID: string,
    onClose: func,
    showViewer: func,
    setReminderData: func,
    mode: string,
    onFav: func
  }

  @observable itemID = -1
  @observable loadError = false
  @observable remindMe = false
  @observable updateMe = false
  @observable isFavorite = false
  @observable reminderID = -1
  @observable newReminderDate = '';

  componentDidMount() {
    this.loadItem(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.loadItem(nextProps)
  }

  loadItem = (props) => {
    const {itemStore, encryptedID, mode} = props
    itemStore.loadTender(decodeURIComponent(encryptedID), mode).then(() => {
      if (!itemStore.item.tenderID) {
        //something went wrong
        this.loadError = true
      }
      else {
        this.itemID = itemStore.item.tenderID
        this.isFavorite = itemStore.item.isFavorite || false
        this.reminderID = itemStore.item.reminderID || -1
      }
    }).catch(error => {
      console.error('[loadTender] Error:', error)
      this.loadError = true
    })
  }

  email = () => {
    const {t} = this.props
    const item = [this.itemID]
    getEmailData(item).then(uid =>
      //console.log('email', uid)
      location.href = `mailto:someone@email.com?subject=${t('toolbar.emailSubject')}&body=${encodeURIComponent(t('toolbar.emailBody', {uid}))}`
    )
  }

  print = isBig => {
    const item = [this.itemID]
    const exportType = isBig ? 0 : 1
    window.open(createUrl('api/Export/ExportData', {
      ExportType: exportType,
      InfoList: item
    }, false), '_blank')
  }

  fav = () => {
    const {itemStore: {item}, onFav} = this.props
    if (onFav) {
      onFav(item.tenderID, !this.isFavorite)
      clearCache()
      this.isFavorite = !this.isFavorite
      //console.log('added', this.isFavorite)
    }
  }

  remind = open => {
    this.remindMe = open
  }

  getInfo = open => {
    this.updateMe = open
  }

  setReminderData = (id, date) => {
    //when reminder data changes (created\updated\deleted),
    //need to update the date label and current reminderID
    const {setReminderData} = this.props
    this.reminderID = id
    this.newReminderDate = date
    if (setReminderData) setReminderData(id, date)
  }

  formatText = text => {
    /* <a> tag fix for text */
    const {t} = this.props
    if (text) {
      let title = '\$&' //regexp default
      const arr = text.split('##URL##')
      if (arr.length > 1 && arr[1] != '') {
        //if originalUrl has passed to this method, need to set it here
        const link = arr[1].split('[[SEP]]')  //it is built as ID[[SEP]]Title
        title = link[1]  //set the title
        //concat the url as is (regexp will fix it to be a link)
        text = `${arr[0]}<br />${t('tender.originalTitle')}<br />http://www.binuy.co.il/tender/${link[0]}`
      }

      //with http
      let fixedText = text.replace(/((https|http):\/\/)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
        `<a target="_blank" href="\$&">${title}</a>`)

      //without http - not working (non-http links)
      //fixedText = fixedText.replace(/(www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
      //  `<a target="_blank" href="http://\$&">${title}</a>`)

      //mailto
      fixedText = fixedText.replace(/([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)/,
        '<a href="mailto:\$&">\$&</a>')

      //tel
      fixedText = fixedText.replace(/0((5[012345678]){1}|[23456789]{1}|(7[5678]){1})(\-)?[^0\D]{1}\d{6}/,
        '<a href="tel:\$&">\$&</a>')

      //dates
      fixedText = fixedText.replace(/(0[1-9]|[12][0-9]|3[01])[- /.](0?[1-9]|1[012])[- /.](19|20\d\d)/,
        '<span style="color: #ed1d24; font-weight: 500">\$&</span>')

      return {__html: fixedText}
    }
    else {
      return {__html: ''}
    }
  }

  htmlDirection = (text, type) => {
    const filter=/[א-ת]/gi
    if (!filter.test(text))
      return type == 'dir' ? 'ltr' : 'left'
    else
      return type == 'dir' ? 'rtl' : 'right'
  }

  addFixedReminder = () => {
    const {itemStore: {item}, t} = this.props
    const email = getCookie('userEmail') || ''
    setReminder('Add', -1, this.itemID, t('tender.psReminderText'), item.title, email, item.presentationDate).then(newid => {
      console.log('saved new reminderID:', newid) //implement if user should know something about save op
      clearCache()      
      this.setReminderData(newid, moment(item.presentationDate).format('DD-MM-YYYY'))      
    })
  }

  render() {
    const { itemStore, encryptedID, showViewer, onClose, t } = this.props
    const item = toJS(itemStore.item)    
    //for display
    const inputDate = setDateLabel(item.inputDate, 'DD/MM/YYYY', t('tender.noDate'))
    const infoDateChk = moment(item.presentationDate)
    const format = infoDateChk.hour() == 0 && infoDateChk.minute() == 0 ? 'DD/MM/YYYY' : 'DD/MM/YYYY HH:mm'
    const presentationDate = setDateLabel(item.presentationDate, format, t('tender.noDate'))
    const titleDir = this.htmlDirection(item.title, 'dir')
    const titleStyle = titleDir == 'ltr' ? 'item_title title_left' : 'item_title'
    //
    //presentationDate
    const twoDaysLeft = isDateInRange(item.presentationDate, 2)
    const oneDayLeft = isDateInRange(item.presentationDate, 1)
    const noDaysLeft = isDateInRange(item.presentationDate, 0)
    //tourDate
    const twoDaysLeftTour = isDateInRange(item.tourDate, 2)
    const oneDayLeftTour = isDateInRange(item.tourDate, 1)
    const tourToday = isDateInRange(item.tourDate, 0)
    const mustDoTourLabel = (twoDaysLeftTour || oneDayLeftTour || tourToday) && item.mustDoTour ? ` - ${t('tender.mustTour')}` : ''
    //fileName
    const fileName = item.file ? item.file.fileName : ''
    //publisher site
    let publisherSite = item.publisherSite && item.publisherSite.trim() != '' ? item.publisherSite : ''
    if (publisherSite != '' && publisherSite.substring(0, 4) != 'http') publisherSite = `http://${publisherSite}`
    //original tender
    const originalUrl = item.originalID ? `##URL##${item.originalID}[[SEP]]${item.originalTitle}` : ''
    const comment = item.comment && item.comment.trim() != '' ? item.comment :
      item.originalID ? ' ' : null  //if comment is null, original tender will not be printed out
    const commentFix = comment == ' ' ? 'א' : comment   //for htmlDirection
    //for scroll pos of item
    const divTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop
    //reminder state
    const hasReminder = this.newReminderDate && this.newReminderDate != null && this.newReminderDate != ''
    //for presentatation
    const email = item.presentationDate ? getCookie('userEmail') || '' : ''
    //tender manager
    //item.tenderManager = 'אורי'
    //item.tenderManagerEmail = 'ori_s@ifat.com'  //debug...
    const manager = item.tenderManager !== '' ? `${item.tenderManager}  ${item.tenderManagerEmail}` : ''
    const tourDetails = item.tourDetails ? item.tourDetails.replace(/חובה/g, '<b>חובה</b>') : ''
    //link fix
    const tenderLink = item.tenderLink && item.tenderLink.substr(0, 4) !== 'http' ? `http://${item.tenderLink}` : item.tenderLink 
    //request update
    const showUpdate = item.detailLevelName == t('tender.detailLevelWillBe') && (!item.tt || item.tt.length == 0)
    return (
      <div>
        {!itemStore.resultsLoading && !this.loadError &&
            <div styleName="view-details-wrapper" style={{top: (divTop + 10)}}>
              <div className="grid-x">
                <div className="large-12 cell">
                  {item.tenderType == t('tender.exclusive') && <span styleName="label" className="label">{t('tender.exclusive')}</span>}
                  {twoDaysLeft && !oneDayLeft && !noDaysLeft && <span styleName="label alert">{t('tender.twoDaysLeft')}</span>}
                  {oneDayLeft && !noDaysLeft && <span styleName="label alert">{t('tender.oneDayLeft')}</span>}
                  {noDaysLeft && <span styleName="label alert">{t('tender.noDaysLeft')}</span>}
                  {twoDaysLeftTour && !oneDayLeftTour && !tourToday && <span styleName="label alert">{`${t('tender.twoDaysLeftTour')}${mustDoTourLabel}`}</span>}
                  {oneDayLeftTour && !tourToday  && <span styleName="label alert">{`${t('tender.oneDayLeftTour')}${mustDoTourLabel}`}</span>}
                  {tourToday && <span styleName="label alert">{`${t('tender.noDaysLeftTour')}${mustDoTourLabel}`}</span>}
                  {item.mustDoTour && !twoDaysLeftTour && !oneDayLeftTour && !tourToday && <span styleName="label alert">{t('tender.mustDoTour')}</span>}
                  {(item.tt && item.tt.length > 0 || item.ft && item.ft.length > 0)  && <span styleName="label camooyot">{t('tender.hasTable')}</span>}
                  {item.results && item.results.length > 0 && <span styleName="label results">{t('tender.hasResults')}</span>}
                  <h1 styleName={titleStyle}>{item.title}</h1>
                  <h6 styleName="item_meta">{t('tender.publishedAt')}: {inputDate} &middot; 
                    {item.tenderType} &middot; {t('tender.tenderNumber')}: {item.tenderNumber} &middot;
                    {item.detailLevelName} &middot;
                    <span data-tip={item.classes}>{cutText(item.classes, 50)}</span>
                  </h6>
                  <hr />
                </div>
              </div>

              <div className="grid-x" styleName="tender_data">
                <div className="large-9 cell">
                  {item.tenderManager !== '' && <Row label={t('tender.manager')} html={this.formatText(manager)} />}
                  <Row label={t('tender.publisher')} data={item.publisher} />
                  {
                    item.results && item.results.length > 0 &&
                    <Row label={t('tender.results')} resultsTable={item.results} />
                  }
                  {
                    publisherSite != '' &&
                    <Row
                      label={t('tender.publisherSite')}
                      html={this.formatText(publisherSite)}
                      dir={this.htmlDirection(publisherSite, 'dir')}
                    />
                  }
                  {item.numericClass && <Row label={t('tender.numericClass')} html={this.formatText(item.numericClass)} />}
                  {
                    item.details && item.details.trim() != '' &&
                    <Row
                      label={t('tender.details')}
                      html={this.formatText(item.details)}                      
                      dir={this.htmlDirection(item.details, 'dir')}
                      align={this.htmlDirection(item.details, 'align')}
                    />
                  }
                  {/*item.presentationDate && <Row label={t('tender.delivery')} data={presentationDate} dir="ltr" />*/}
                  {/*
                    item.presentationDate && <div className="grid-x">
                      <div className="medium-3 cell">
                        <div styleName="item_label">{t('tender.delivery')}</div>
                      </div>
                      <div className="medium-9 cell">
                        <div styleName="item_key item_ltr" style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                          {email !== '' ? <a style={{paddingRight: '10px'}} onClick={this.addFixedReminder}>{t('tender.addFixedReminder')}</a> : ''}
                          <span>{presentationDate}</span>
                        </div>                       
                      </div>
                    </div>
                  */}
                  {
                    item.presentationRemarks && item.presentationRemarks.trim() != '' &&
                    <React.Fragment>
                      {/*<Row
                        label={t('tender.presentationRemarks')}
                        html={this.formatText(item.presentationRemarks)}
                        dir={this.htmlDirection(item.presentationRemarks, 'dir')}
                        align={this.htmlDirection(item.presentationRemarks, 'align')}
                      />*/}
                      <PresentationRow
                        label={t('tender.presentationRemarks')}
                        html={this.formatText(item.presentationRemarks)}
                        dir={this.htmlDirection(item.presentationRemarks, 'dir')}
                        align={this.htmlDirection(item.presentationRemarks, 'align')}
                        email={email}
                        addFixedReminder={this.addFixedReminder}
                        t={t}
                      />
                    </React.Fragment>
                  }
                  {
                    item.guarantee && item.guarantee.trim() != '' &&
                    <Row
                      label={t('tender.guarantee')}
                      html={this.formatText(item.guarantee)}                      
                      dir={this.htmlDirection(item.guarantee, 'dir')}
                      align={this.htmlDirection(item.guarantee, 'align')}
                    />
                  }
                  {
                    item.tourDetails && item.tourDetails.trim() != '' &&
                    <Row
                      label={t('tender.tourDetails')}
                      html={this.formatText(tourDetails)}
                      dir={this.htmlDirection(item.tourDetails, 'dir')}
                      align={this.htmlDirection(item.tourDetails, 'align')}
                    />
                  }                               
                  {
                    (item.tt && item.tt.length > 0 || item.ft && item.ft.length > 0)  &&
                    <Row
                      label={t('tender.exclusiveEx')}
                      bold={true}
                      data=""
                      table={item.tt}
                      fixedTable={item.ft}
                      dir={this.htmlDirection(item.details, 'dir')}
                      align={this.htmlDirection(item.details, 'align')}
                    />
                  }
                  {
                    item.afterDescription && 
                    <Row                      
                      data={item.afterDescription}
                      dir={this.htmlDirection(item.afterDescription, 'dir')}
                      align={this.htmlDirection(item.afterDescription, 'align')} 
                    />
                  }
                  {
                    /*comment &&
                    <Row
                      label={t('tender.comment')}
                      html={this.formatText(`${comment}${originalUrl}`)}
                      dir={this.htmlDirection(commentFix, 'dir')}
                      align={this.htmlDirection(commentFix, 'align')}
                    />*/
                  }                  
                  {
                    item.conditions && item.conditions.trim() != '' &&
                    <Row
                      label={t('tender.conditions')}
                      data={item.conditions}
                      dir={this.htmlDirection(item.conditions, 'dir')}
                      align={this.htmlDirection(item.conditions, 'align')}
                    />
                  }
                  {
                    item.documents && 
                    <Row 
                      label={t('tender.documents')}
                      html={this.formatText(item.documents)}
                      dir={this.htmlDirection(item.documents, 'dir')}
                      align={this.htmlDirection(item.documents, 'align')} 
                    />
                  }
                  {/*
                    item.classes && item.classes.trim() != '' &&
                    <Row label={t('tender.classes')} data={item.classes} />
                  */}                                   
                  {/*
                    item.tenderLink &&
                    <Row label={t('tender.links')} data={item.tenderLink} />*/
                  }
                  {/*
                    item.tenderLink && item.td.map((link, index) => <div key={index}>
                      <div className="grid-x">
                        <div className="medium-3 cell">
                          &nbsp;
                        </div>
                        <div className="medium-9 cell">
                          <div styleName="item_key"><a href={link.DucuentLink} target="_blank">{link.DucuentName}</a></div>
                        </div>
                      </div>
                    </div>)*/
                  }
                  {/*<Feedback feedback={item.feedback} />*/}
                </div>
                <div className="large-3 cell">

                  <ul className="no-bullet" styleName="tender_actions">
                    <li>{fileName != '' && <a onClick={() => showViewer(fileName, item.title)}>
                      <img src={thumbSrc} />{t('tender.viewImage')}</a>}
                    </li>
                    {item.tenderLink && <li><a href={tenderLink} target="_blank" styleName="tender-link"><img src={docSrc}/>{t('tender.toTenderDetails')}</a></li>}
                    {fileName != '' && <li><a onClick={() => this.print(true)}><img src={printSrc}/>{t('tender.printImage')}</a></li>}
                    <li><a onClick={() => this.print(false)}><img src={printSrc}/>{t('tender.print')}</a></li>
                    <li><a onClick={this.email}><img src={mailSrc}/>{t('tender.email')}</a></li>
                    <li><a onClick={() => this.remind(true)}>
                      <img src={item.reminderDate && this.newReminderDate == '' || hasReminder ? alertActSrc : alertSrc}/>
                      {item.reminderDate && this.newReminderDate == '' ?
                        moment(item.reminderDate).format('DD-MM-YYYY') :
                        hasReminder ?
                          this.newReminderDate
                          : t('tender.addReminder')}</a></li>

                    <li><a onClick={this.fav}>
                      <img src={this.isFavorite ? favActSrc : favSrc}/>
                      {this.isFavorite ? t('tender.removeFromFav') : t('tender.addToFav')}</a></li>
                    {showUpdate && <li><a onClick={() => this.getInfo(true)}><img src={mailSrc}/>{t('tender.getInfo')}</a></li>}
                  </ul>
                  {/*item.tenderType == t('tender.tenderPublicLabel') &&
                  <div>
                    <Link to={`/radar/${encryptedID}`} target="_blank" className="button" styleName="radar-link">{t('tender.radar')}</Link>
                  </div>
                */}
                </div>
              </div>
              {!this.props.mode &&
                <button className="close-button" data-close aria-label="Close modal" type="button" onClick={onClose}>
                  <span aria-hidden="true">&times;</span>
                </button>
              }
            </div>
        }
        {this.loadError &&
          <div>
            <div styleName="errors">
              {itemStore.searchError.statusCode == 401 ?  t('login.subscribeTitle') : t('tender.errors')}
            </div>
            {itemStore.searchError.statusCode == 401 &&
              <div styleName="errors-sub">
                {t('tender.subscribeText1')}<br />{t('tender.subscribeText2')}
                <br /><br />
                <Link to='/contact/' target='_blank' styleName="contact-link">{t('tender.contact')}</Link>
              </div>
            }
          </div>
        }
        {itemStore.resultsLoading && <Loading />}
        {this.remindMe &&
          <Reminder
            tenderID={item.tenderID}
            encryptedID={encryptedID}
            onClose={() => this.remind(false)}
            setReminderData={this.setReminderData}
            title={item.title}
            presentationDate={item.presentationDate}
            reminderID={this.reminderID}
          />
        }
        {this.updateMe &&
          <GetInfo
            tenderID={item.tenderID} 
            onClose={this.getInfo} 
          />
        }
        <ReactTooltip />
      </div>
    )
  }
}

const PresentationRow = ({label, data, html, dir, align, email, addFixedReminder, t}) => {
  const itemStyle = dir ?
    align && align == 'left' ? 'item_key item_ltr item_left' :
      dir == 'ltr' ? 'item_key item_ltr' :
        'item_key' : 
    'item_key'

  return <div className="grid-x">
    <div className="medium-3 cell">
      <div styleName="item_label">{label}</div>
    </div>
    <div className="medium-9 cell">
      <div styleName={itemStyle} dangerouslySetInnerHTML={html}>        
        {data}
      </div>
      <div style={{paddingRight: '0.4rem'}}>
        {email !== '' ? <a style={{paddingRight: '10px'}} onClick={addFixedReminder}>{t('tender.addFixedReminder')}</a> : ''}
      </div>
    </div>
  </div>
}