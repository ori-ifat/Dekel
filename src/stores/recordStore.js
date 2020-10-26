import { action, observable } from 'mobx'
import find from 'lodash/find'
import remove from 'lodash/remove'
import map from 'lodash/map'

class Record {
  @observable checkedItems = []   /* this observable holds the state of items: checked\unchecked, favorite true\false. only for touched items */

  @action.bound
  cleanChecked = () => {
    this.checkedItems = map(this.checkedItems, item => {
      item.checked = false
      return item
    })
  }

  @action.bound
  push = (checked, value, isFavorite) => {    
    const found = find(this.checkedItems, item => {
      return item.tenderID == value
    })
    if (!found) this.checkedItems.push({ checked, tenderID: value, isFavorite })
  }

  @action.bound
  cut = (value) => {
    remove(this.checkedItems, item => {
      return item.tenderID === value
    })
  }

  @action.bound
  extractItems = () => {
    const itemsToAdd = []
    this.checkedItems.map(item => {
      if (item.checked) { //add only ids of checked items
        itemsToAdd.push(item.tenderID)
      }
    })
    return itemsToAdd
  }

  @action.bound
  isInChecked = tenderID => {
    const found = find(this.checkedItems, item => {
      return item.tenderID == tenderID
    })
    return found
  }
}

export const recordStore = new Record()
