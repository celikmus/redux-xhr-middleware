# redux-xhr-middleware  [![Build Status](https://travis-ci.org/celikmus/redux-xhr-middleware.svg?branch=master)](https://travis-ci.org/celikmus/redux-xhr-middleware?branch=master)
Async XHR middleware for Redux

A light-weight middleware for Redux to do promise-based XHR requests. XHR headers and API gateway uri are configurable.

## Installation
```sh
yarn add redux-xhr-middleware
```

## Plug into your Redux store

```javascript
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import xhrMiddlewareCreator from 'redux-xhr-middleware';
import rootReducer from '../myRouteReducer';

const createReduxStore = initialState => {
  const xhrMiddleware = xhrMiddlewareCreator();
  let enhancer = applyMiddleware(xhrMiddleware);
  return createStore(
    rootReducer,
    initialState,
    enhancer
  );
};

const store = createReduxStore();

```
## Use in action creators to initiate XHR

```javascript
const GET_SITES_REQUEST = 'GET_SITES_REQUEST';
const GET_SITES_SUCCESS = 'GET_SITES_SUCCESS';
const GET_SITES_FAIL = 'GET_SITES_FAIL';

const getSites = (siteId = '') => {
  const url = siteId ? `/api/sites/${siteId}` : '/api/sites';
  return {
    types: [GET_SITES_REQUEST, GET_SITES_SUCCESS, GET_SITES_FAIL],
    xhr: {
      url,
      method: 'GET'
    }
  };
};

// Handle actions in your reducer:

  // ...
  [GET_SITES_REQUEST]: state => Object.assign({}, state, {
    fetchError: null,
    sites: [],
    isGetting: true
  }),
  [GET_SITES_SUCCESS]: (state, {payload}) => merge({}, state, {
    isGetting: false
  }, {sites: payload}),
  [GET_SITES_FAIL]: (state, {payload}) => Object.assign({}, initialState, {
    getError: payload,
    isGetting: false
  }),
  // ...
```
