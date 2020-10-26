import FoundationHelper from 'lib/FoundationHelper'

export function fixTopMenu() {
  //this should fix the top menu design, if some delay in api causes it to be fucked
  setTimeout(() => {
    //allow element to be created.
    FoundationHelper.initElement('top_nav')
  }, 500)

  setTimeout(() => {
    //allow element to be created.
    FoundationHelper.reInitElement('top_nav')
  }, 1000)
}
