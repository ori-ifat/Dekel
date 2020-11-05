import React from 'react'
import { string, array, func, object } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import {doFilter} from 'common/utils/filter'
import moment from 'moment'
import Calendar from 'common/components/Calendar'
//import CSSModules from 'react-css-modules'
import  './DateFilter.scss'

export default
@translate()
//@inject('searchStore')
@observer
class DateFilter extends React.Component {
  /* component for date range filter */

  static propTypes = {
    dateField: string,
    dateValues: array,
    chooseDateField: func,
    store: object
  }

  @observable startDate = moment()
  @observable endDate = moment()

  componentWillMount() {
    const {dateField, dateValues, chooseDateField} = this.props
    chooseDateField(dateField)
    this.setDefaultDates(dateValues)
  }

  componentWillReceiveProps(nextProps) {
    const {dateField, dateValues, chooseDateField} = nextProps
    chooseDateField(dateField)
    this.setDefaultDates(dateValues)
  }

  setDefaultDates = dateValues => {
    //if there is an array of dates, set default dates by it
    this.startDate = dateValues && dateValues.length > 0 ? moment(dateValues[0], 'YYYY-MM-DD') || moment() : moment()
    this.endDate = dateValues  && dateValues.length > 1 ? moment(dateValues[1], 'YYYY-MM-DD') || moment() : moment()
  }

  selectDate = (date, field) => {
    //set observables and doFilter
    const {store} = this.props
    switch (field) {
    case 'startDate':
      this.startDate = date
      break
    case 'endDate':
      this.endDate = date
      break
    }
    store.initialDate = false
    this.doFilter()
  }

  doFilter = () => {
    //filter commit
    const { store, dateField, t } = this.props
    this.endDate = this.endDate.hour(23).minute(59).second(59)  //include all last day.
    const values = [
      moment(this.startDate).format('YYYY-MM-DD'),
      moment(this.endDate).format('YYYY-MM-DD HH:mm:ss')
    ]
    //console.log('values', values)
    doFilter(store, dateField, values)
    //set the state-like object:
    //the actual values (date field name was already set on DateFilter)
    store.setSelectedFilters(dateField, values, t('filter.more'))
  }

  render() {
    const {dateField, chooseDateField, t} = this.props  
    const isOnFilter = false  //move to prop if needed
    const clsLeft = dateField == 'resultDate' ? 'dates-left selected' : 'dates-left'
    const clsRight = dateField == 'inputDate' ? 'dates-right selected' : 'dates-right'
    const clsMiddle = dateField == 'presentationDate' ? 'dates-middle selected' : 'dates-middle'

    return(
      <div styleName="dateContainer">
        {isOnFilter && <div styleName="tabs_container">
          <div styleName={clsRight} onClick={() => chooseDateField('inputDate')} style={{cursor: 'pointer'}}>
            {t('filter.inputDate')}
          </div>

          <div styleName={clsMiddle} onClick={() => chooseDateField('presentationDate')} style={{cursor: 'pointer'}}>
            {t('filter.presentationDate')}
          </div>

          <div styleName={clsLeft} onClick={() => chooseDateField('resultDate')} style={{cursor: 'pointer'}}>
            {t('filter.resultDate')}
          </div>
        </div>}

            {isOnFilter && <span styleName="date_lable">{t('filter.from')}</span>}
            <div styleName="continer">
              מ: <Calendar
                name="startDate"
                defaultDate={this.startDate}
                todayLabel={t('filter.today')}
                selectDate={this.selectDate}
                showMonths={true}
                showYears={true}
                minDate={moment().subtract(10, 'year')}
                maxDate={moment().add(1, 'year')}
              />


            {isOnFilter && <span styleName="date_lable">{t('filter.to')}</span>}


              עד: <Calendar
                name="endDate"
                defaultDate={this.endDate}
                todayLabel={t('filter.today')}
                selectDate={this.selectDate}
                showMonths={true}
                showYears={true}
                minDate={moment().subtract(10, 'year')}
                maxDate={moment().add(1, 'year')}
              />

        </div>
      </div>
    )
  }
}
