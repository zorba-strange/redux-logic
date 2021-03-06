import { createLogic } from 'redux-logic';
import { SEARCH, searchFulfilled, searchRejected } from './actions';

export const searchLogic = createLogic({
  type: SEARCH,
  debounce: 500, // ms
  latest: true, // take latest only

  // let's prevent empty requests
  validate({ getState, action }, allow, reject) {
    if (action.payload) {
      allow(action);
    } else { // empty request, silently reject
      reject();
    }
  },

  // use axios injected as httpClient from configureStore logic deps
  process({ httpClient, getState, action }, dispatch) {
    httpClient.get(`http://npmsearch.com/query?q=${action.payload}&fields=name,description`)
      .then(resp => resp.data.results) // use results property of payload
      .then(results => dispatch(searchFulfilled(results)))
      .catch((err) => dispatch(searchRejected(err)));
  }
});

export default [
  searchLogic
];
