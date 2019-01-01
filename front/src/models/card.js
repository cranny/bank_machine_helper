// import { getBankAPI } from '../lib/bankApi'
// const debug = require('debug')('models:ids')

export default {
  nameSpace: 'card',
  state: {
  },
  reducers: {
    onRead(state, { payload }) {
      state = {
        ...state,
        ...payload
      }
    }
  },
};
