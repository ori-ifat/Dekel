import remove from 'lodash/remove'
import find from 'lodash/find'
import {addToFavorites, clearCache} from 'common/services/apiService'

/*
//old way:
export function setCheckedStatus(checked, value, isFavorite, push, cut) {
  if (checked) {
    push(value, isFavorite)
  }
  else {
    cut(value)
  }
}
*/

export function setCheckedStatus(checked, value, isFavorite, push, cut) {
  cut(value)  //remove
  push(checked, value, isFavorite)  //push again checked\unchecked
}

export async function setFavStatus(tenderID, add, isIn, push, cut) {
  const action = add ? 'Favorite_add' : 'Favorite_del'
  await addToFavorites(action, [tenderID])
  clearCache()
  const found = isIn(tenderID)  //for checked state
  //if (found) {
  //old way...: if item is in checkedItems array, need to update its fav state;
  //new way: add it anyway because it was touched
  cut(tenderID)  //remove
  //add the item again with new fav state
  push((found && found.checked) || false, tenderID, add)
  //}
}

export function getImageUrl(fileName) {
  const cleanFileName = fileName.replace(/\\/g, '/').replace(/\/\/int_fs\/Clips/g, '')
  const url = cleanFileName.indexOf('ColorClp') > -1 || cleanFileName.indexOf('ClipsPdf') > -1 ?
    `http://www.ifatmediasite.com/CustomerMedia/ClipsImages${cleanFileName}` :
    ''
  //console.log('getImageUrl', url)
  return url
}

export function extractLabel(value, more) {
  const arr = value.split(',')
  const label = arr.length > 2 ? `${arr.slice(0, 2).join(',')  } ${more} ${arr.length - 2}` : value
  return label
}

export function randomNumber(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
}
