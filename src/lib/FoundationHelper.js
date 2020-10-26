import $ from 'jquery'

const FoundationHelper = {
  initElement(elem) {
    //make an element to be a foundation element
    $(`#${elem}`).foundation()
  },

  reInitElement(elem) {
    //if an element is already a foundation element, and lost context, re-initialize it
    Foundation.reInit($(`#${elem}`))
  }
}

export default FoundationHelper
