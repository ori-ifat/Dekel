const req = require.context('common/style/icons/', false)

const SUBJ_ALERT = 58
const SUBJ_ROADS = 1245 //86 old value
const SUBJ_GARDENING = 2
const SUBJ_BRIDGES = 42
const SUBJ_DUST = 26
const SUBJ_PUMPS = 88
const SUBJ_BUILD = 1
const SUBJ_PREBUILD = 40
const SUBJ_ELECTRICITY = 5

export function getSrc(id) {
  let ret = ''
  switch(id) {
  case SUBJ_ALERT:
    ret = req('./detection.svg').default
    break
  case SUBJ_ROADS:
    ret = req('./roads.svg').default
    break
  case SUBJ_GARDENING:
    ret = req('./Gardening.svg').default
    break
  case SUBJ_BRIDGES:
    ret = req('./bridge.svg').default
    break
  case SUBJ_DUST:
    ret = req('./Tracktor.svg').default
    break
  case SUBJ_PUMPS:
    ret = req('./Pumps.svg').default
    break
  case SUBJ_BUILD:
    ret = req('./Building.svg').default
    break
  case SUBJ_PREBUILD:
    ret = req('./build.svg').default
    break
  case SUBJ_ELECTRICITY:
    ret = req('./Electricity.svg').default
    break
  }

  return ret
}
