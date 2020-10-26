import moment from 'moment'

export function setDateLabel(date, format, noDateLabel) {
  return date != null ? moment(date).format(format) : noDateLabel
}

export function isDateInRange(date, numOfDays) {
  //return  moment(date) > moment() && moment(date) < moment().add(numOfDays, 'days')
  return date && moment(date).startOf('day') >= moment().startOf('day') && moment(date).startOf('day') <= moment().add(numOfDays, 'days').startOf('day')
}

export const cutText = (text, length) => { 
  if (!length) length = 20
  return text && text.length > length ? `${text.substr(0, length)}...` : text 
}

export const realDate = (date) => {
  return moment(date) > moment('2000-01-01', 'YYYY-MM-DD') ? moment(date).format('DD/MM/YY') : null
}