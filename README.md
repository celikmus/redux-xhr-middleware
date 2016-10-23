# redux-xhr-middleware  [![Build Status](https://travis-ci.org/celikmus/redux-xhr-middleware.svg?branch=master)](https://travis-ci.org/celikmus/redux-xhr-middleware?branch=master)
Async XHR middleware for Redux

A light-weight middleware for Redux to do promise-based XHR requests. XHR headers and API gateway uri are configurable.

## Installation
```sh
yarn add redux-xhr-middleware
```

### 1. Plug into your Redux store

```javascript
import {createStore, applyMiddleware} from 'redux';
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
### 2. Use in your action creators to initiate XHR
Your action creator needs to return an object with `types` and `xhr` properties, both must be provided.
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
```
### 3. Finally, handle your actions in reducer:
```javascript
import merge from 'lodash/merge';

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
## Configuring XHR middleware
You can specify an options object to the XHR middleware creator:

```javascript
const options = {
  headers: {},
  gateway: ''
};
const xhrMiddleware = xhrMiddlewareCreator(options);
```

```headers``` can add/override any XHR header other than ```Accept``` and ```Content-Type``` headers, which are set as ```application/json``` by default.

```gateway``` is a string as prefix to the paths, in case the API gateway is different to the application server, e.g. ```gateway``` could be ```https://myGateway.com:8081```.

#### Example:
```javascript
const options = {
  headers: {
    Authentication:  'my token'
  },
  gateway: '/api'
};
```
