import React from 'react'
import { bool, object, func, string } from 'prop-types'
import { observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import DatePicker from 'react-datepicker'
import moment from 'moment'
//import CSSModules from 'react-css-modules'
import  './Calendar.scss'
//import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import 'react-datepicker/dist/react-datepicker.css'
import '../../style/_datepicker.scss'

export default @observer class Calendar extends React.Component {

  static propTypes = {
    name: string,
    defaultDate: object,
    minDate: object,
    maxDate: object,
    todayLabel: string,
    selectDate: func,
    showMonths: bool,
    showYears: bool
  }

  @observable selectedDate

  componentDidMount() {
    //const {defaultDate} = this.props
    //this.selectedDate = moment(defaultDate, 'DD-MM-YYYY') //not working ... needs further work to implement
    this.selectedDate = moment()
    //console.log('mount', this.selectedDate)
  }
  /*
  componentWillReceiveProps(nextProps) {
    const {defaultDate} = nextProps
    this.selectedDate = moment(defaultDate, 'DD-MM-YYYY')
  }
  */

  getDatetime = () => {
    //console.log('getDatetime', this.selectedDate)
    const {defaultDate} = this.props
    this.selectedDate = moment(defaultDate, 'DD-MM-YYYY')    
    return moment(defaultDate, 'DD-MM-YYYY')
  }

  dateModified = key => value => {
    this.selectedDate = value ? moment(value) : moment()  //default value for non-selected date
    //console.log('dateModified', this.selectedDate)
    const {selectDate, name} = this.props
    selectDate(this.selectedDate, name)
  }

  render() {
    //console.log('render calendar', this.selectedDate)
    const {showMonths, showYears, minDate, maxDate} = this.props
    return (
      <div styleName="datepicker-container">
        <DatePicker
          bsSize="lg"
          locale="he-IL"
          dropdownMode="select"
          selected={this.getDatetime()}
          onChange={this.dateModified('selectedDate')}
          todayButton={this.props.todayLabel}
          showMonthDropdown={showMonths}
          showYearDropdown={showYears}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
    )
  }
}
