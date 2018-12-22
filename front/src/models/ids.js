// import { getBankAPI } from '../lib/bankApi'
// const debug = require('debug')('models:ids')

export default {
  nameSpace: 'ids',
  state: {
    info: {},
    images: {}
    // province: eventResult.SF,
    // name: eventResult.NM,
    // sex: eventResult.SX,
    // nation: eventResult.MZ,
    // birthday: eventResult.BD,
    // address: eventResult.AD,
    // issueAgency: eventResult.QF,
    // issueDate: eventResult.SD,
    // expiredDate: eventResult.ED,
    // avatar: '',
    // IdsImage1: '',
    // IdsImage2: ''
  },
  reducers: {
    onRead(state, { payload }) {
      state.info = {
        ...payload
      }
    },
    onScan(state, { payload }) {
      console.log(payload)
      state.images = {
        ...payload
      }
    }
  },
};
