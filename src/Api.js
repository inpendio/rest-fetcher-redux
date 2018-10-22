import { isFunction } from 'lodash';
import { Base } from 'rest-fetcher-base';
import { object as tObject } from './Transformers';

console.log(Base, require('rest-fetcher-base'));

export default class RFR extends Base {
  constructor() {
    super();
    this.endpointCreationPool.push(this.addToReducerPool);
    this.endpointCreationPool.push(this.addToTransformerPool);
  }

  /**
   * @description Reducer you export to your store.
   * This will extract name of the function ( as it containes prefix and sufix).
   * Calls generic reducer set for given name.
   * @param {Object} state - state
   * @param {Object} action - action
   * @memberof Communicator
   */
  reducer = (state = this.genererateInitialState(), action) => {
    if (action.type.indexOf(this.basePrefix) === -1) return state;
    let name = action.type.substring(this.basePrefix.length);
    if (name.indexOf('_success') !== -1) {
      name = name.replace('_success', '');
    }
    if (name.indexOf('_fail') !== -1) {
      name = name.replace('_fail', '');
    }
    return this.reducerPool[name](state, action);
  };

  /**
   * @description reducer for specific function name
   * @param {String} k - name of the function
   * @param {Object} state - state
   * @param {Object} action - action
   * @memberof Communicator
   */
  constructGenericReducer = k => (state, action) => {
    const newState = Object.assign({}, state);
    newState[k] = Object.assign({}, state[k]);
    /* Object.keys(state).forEach(key => {
      newState[key] = Object.assign({}, state[key]);
    }); */
    if (action.loading) {
      if (newState.isLoading && newState.isLoading.length) {
        newState.isLoading.push(k);
      } else {
        newState.isLoading = [];
        newState.isLoading.push(k);
      }
    } else {
      if (newState.isLoading && newState.isLoading.length && newState.isLoading.indexOf(k) !== -1) {
        newState.isLoading.splice(newState.isLoading.indexOf(k), 1);
      }
      if (newState.isLoading && newState.isLoading.length === 0) {
        newState.isLoading = false;
      }
    }
    /* newState.isLoading = action.loading; */
    if (action.type.indexOf('_success') !== -1) {
      newState[k].loading = false;
      newState[k].data = this.transformerPool[k](action.payload.data);
      newState[k].ok = action.payload.msg.ok;
      newState[k].redirected = action.payload.msg.redirected;
      newState[k].status = action.payload.msg.status;
      newState[k].type = action.payload.msg.type;
    } else if (action.type.indexOf('_fail') !== -1) {
      newState[k].loading = false;
      newState[k].ok = action.payload.msg.ok;
      newState[k].redirected = action.payload.msg.redirected;
      newState[k].status = action.payload.msg.status;
      newState[k].type = action.payload.msg.type;
      newState[k].error = action.payload.error;
    } else {
      newState[k].loading = true;
      newState[k].request = action.payload.request;
      newState[k].params = action.payload.params;
    }
    return newState;
  };

  /**
   * @description Function that creates initial state for each api call for reducer.
   * @returns state for api reducer
   */
  genererateInitialState = () => {
    const state = {};
    state.isLoading = false;
    console.log(this);
    Object.keys(this.reducerPool).forEach((k) => {
      console.log(k);
      state[k] = {
        request: '',
        params: '{}',
        data: this.transformerPool[k](),
        ok: undefined,
        redirected: undefined,
        status: 0,
        type: '',
      };
    });
    return state;
  };

  /**
   * @description Function that creates redux action.
   * Adds pefix to type
   * @param {String} name - name of the action
   * @param {Object} request - payload item
   * @param {Object} params - payload item
   */
  actionStart = (name, request, params) => ({
    type: `${this.basePrefix}${name}`,
    /* name, */
    loading: true,
    payload: {
      request,
      params,
    },
  });

  /**
   * @description Function that creates redux action.
   * Adds sufix to type
   * @param {String} name - name of the action
   * @param {Object} request - payload item
   * @param {Object} params - payload item
   */
  actionEnd = (name, data, msg = {}) => ({
    type: `${this.basePrefix}${name}_success`,
    /* name, */
    loading: false,
    payload: {
      data,
      msg,
    },
  });

  /**
   * @description Function that creates redux action.
   * Adds sufix to type
   * @param {String} name - name of the action
   * @param {Object} request - payload item
   * @param {Object} params - payload item
   */
  actionError = (name, msg = {}, error) => ({
    type: `${this.basePrefix}${name}_fail`,
    loading: false,
    payload: {
      msg,
      error,
    },
  });

  /**
   * @description Function that adds a postfetch method to postfetch pool for future use
   * @param {Object} endpoint - function will extract postfetch key from endpoint if one exists
   * @param {String} name - a name of the endpoint
   * @memberof Communicator
   */
  addToReducerPool = ({ reducer }, name) => {
    this.reducerPool[name] = reducer || this.constructGenericReducer(name);
  };

  /**
   * @description Function that adds a final data tranformer for future use
   * @param {Object} endpoint - function will extract transformer key from endpoint if one exists
   * @param {String} name - a name of the endpoint
   * @memberof Communicator
   */
  addToTransformerPool = ({ transformer = tObject }, name) => {
    if (transformer && isFunction(transformer)) {
      this.transformerPool[name] = transformer;
    }
  };

  getReducer = () => this.reducer;
}
