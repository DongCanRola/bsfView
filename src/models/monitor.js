import {MonitorGetAll} from '../services/api'

const delay = timeout => new Promise(resolve => setTimeout(resolve, 5000));

export default {

  namespace: 'monitor',

  state: {test:"lalala"},

  reducers: {
    save(state, {payload:resp}) {
        return { ...state, data:resp };
    },
  },

  effects: {
    *fetch({ payload:resp }, { call, put }) {  // eslint-disable-line
      console.log('!!!')
        yield call(MonitorGetAll,resp)
        yield put({ type: 'save',payload:resp });
    },
  },

};
