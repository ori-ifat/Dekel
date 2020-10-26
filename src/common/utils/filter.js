import find from 'lodash/find'
import remove from 'lodash/remove'
import filter from 'lodash/filter'
import moment from 'moment'

export function doFilter(store, field, values, itemLabels, close, closeModal, more) {
  //get current search params
  //const sort = store.sort
  //const payload = JSON.stringify(store.tags)
  if (field == 'inputDate' || field == 'presentationDate' || field == 'resultDate') {
    //special date handle: remove previous (or equivalent) if it was there
    remove(store.filters, filter => {
      return filter.field === 'inputDate' || filter.field === 'presentationDate' || filter.field === 'resultDate'
    })
  }
  else {
    remove(store.filters, filter => {
      return filter.field === field
    })
  }
  //get current filters and concat new ones 
  const newFilters = values.length > 0 ? [...store.filters, {field, values}] : store.filters
  const filters = JSON.stringify(newFilters)
  //apply filters to store, and commit search:
  store.applyFilters(filters)
  //store.clearResults()
  store.fromRoute = true  //raise route flag
  store.loadNextResults()
  //fix the labels for filter view
  if (close) {
    const labels = itemLabels.join(',')
    //onClose(field, labels)
    store.setSelectedFilters(field, labels, more)
    closeModal()   //close modal.
  }
}

export function filterClasses(searchStore, newFilters, newLabels, closeModal, more) {
  remove(searchStore.filters, filter => {
    return filter.field === 'class' || filter.field === 'fatherClass' 
  })

  const filters = [...searchStore.filters, ...newFilters]
  const filtersString = JSON.stringify(filters)
  //apply filters to store, and commit search:
  searchStore.applyFilters(filtersString)
  searchStore.fromRoute = true  //raise route flag
  searchStore.loadNextResults()
  const labels = newLabels.join(',')
  //onClose(field, labels)
  searchStore.setSelectedFilters('class', labels, more)   //on searchStore, 'class' will keep classes and fatherClasses labels
  closeModal()   //close modal.
}

export function getDefaultFilter(isEmpty) {
  //isEmpty = empty search (no tags)
  const dateBack = isEmpty ? moment().subtract(1, 'week').format('YYYY-MM-DD')
    : moment().subtract(1, 'year').format('YYYY-MM-DD')
  //const field = isEmpty ? 'publishdate' : 'inputdate'
  const field = 'inputDate'
  return {field, values:[dateBack]}
}

export function getDefaultDates(tags) {
  if (tags && tags.length == 0) {
    //empty search handle
    return [moment().subtract(1, 'week').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
  }
  else {
    //check for the 'daysBack' tag:
    const reducedTags = filter(tags, tag => {
      return tag.resType == 'daysBack'
    })
    if (reducedTags.length == 0) {
      //no daysBack, return 1 year back
      return [moment().subtract(1, 'year').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    }
    else {
      //check what was chosen. if more than one value, need to get the smallest one (=what api does)...
      let days = 0
      reducedTags.map(tag => {
        //initial value 0 or tag.ID is smaller: set value. note: tag.ID = days back.
        if (days == 0 || tag.id < days) days = tag.id
      })
      return [moment().subtract(days, 'day').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    }
  }
}

export function removeFather(items, value, inSelected, selectedItems, itemLabels) {
  const father = find(items, item => {
    //seek for the child class with same id as the checkbox value
    const child = find(item.classes, cls => cls.classID === parseInt(value))
    return child !== undefined  //if found, this is the father
  })
  //check if the found father is selected
  if (father && inSelected(father.fatherClassID, 'fatherClass')) {
    //if so, uncheck it
    remove(selectedItems, selectedItem => selectedItem.id === father.fatherClassID && selectedItem.type === 'fatherClass')
    remove(itemLabels, label => label.name === father.fatherClassName && label.type === 'fatherClass')  
  }
}

export function removeChildren(items, value, selectedItems, itemLabels) {
  const father = find(items, item => item.fatherClassID === parseInt(value))     
  father.classes.map(child => {
    remove(selectedItems, selectedItem => selectedItem.id === child.classID && selectedItem.type === 'class')
    remove(itemLabels, label => label.name === child.className && label.type === 'class')
  })
}

export function onFatherCheck(type, name, value, action, inSelected, allItems, selectedItems, itemLabels) {
  if (type === 'fatherClass') {
    //find the item on the items
    const father = find(allItems, item => item.fatherClassID === value)
    //iterate child items and mark them
    if (father) {
      father.classes.map(classItem => {
        if (action === 'add') {
          if (!inSelected(classItem.classID, 'class')) {
            selectedItems.push({ id: classItem.classID, type: 'class' })
            itemLabels.push({ name: classItem.className, type: 'class' })
          }
        }
        else {
          if (inSelected(classItem.classID, 'class')) {
            remove(selectedItems, selectedItem => selectedItem.id === classItem.classID && selectedItem.type === 'class')
            remove(itemLabels, label => label.name === classItem.className && label.type === 'class')  
          }
        }
      })
    }
  }
}