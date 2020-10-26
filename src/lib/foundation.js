// jQuery
const $ = require('jquery')
global.jQuery = $

// if you want all features of foundation
require('../../node_modules/foundation-sites/dist/js/foundation.min.js')

// if you want only some features
// require('./node_modules/what-input/what-input')
// require('./node_modules/foundation-sites/js/foundation.core')
// require('./node_modules/foundation-sites/js/....')

//on document.ready, use $(document).foundation()

/* NOTE: es6 usage here will cause IE to not render site at all, don't know why.
   I tried to require single libs instead of all but had problems. require all works fine.
*/
