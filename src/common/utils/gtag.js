const GTAG  = {
  /* google tag manager helper :) */
  sendEvent() {
    //call the global google tag manager object to track page
    //console.log('sendEvent')
    try {
      //'gtag' is a global var defined on the google tag manager script on index.html.
      gtag('event', 'conversion', {'send_to': 'AW-1067174628/vgOQCJafSRDkle_8Aw'})
    }
    catch(e) {
      //if error will occur, just log and continue
      console.error('GTAG helper (sendEvent)', e)
    }
  },
  trackPage(pageName, path) {
    try {
      //console.log('trackPage', pageName, path)
      gtag('config', 'AW-1067174628', {
        'page_title' : `${pageName}`,
        'page_path': `/${path}`
      })
    } catch (e) {
      //if error will occur, just log and continue
      console.error('GTAG helper (trackPage)', e)
    }
  }
}

export default GTAG
