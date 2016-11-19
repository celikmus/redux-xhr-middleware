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
const GET_AUTHORS_REQUEST = 'GET_AUTHORS_REQUEST';
const GET_AUTHORS_SUCCESS = 'GET_AUTHORS_SUCCESS';
const GET_AUTHORS_FAIL = 'GET_AUTHORS_FAIL';

const getSites = (siteId = '') => {
  const url = siteId ? `/api/sites/${siteId}` : '/api/sites';
  return {
    types: [GET_AUTHORS_REQUEST, GET_AUTHORS_SUCCESS, GET_AUTHORS_FAIL],
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
  [GET_AUTHORS_REQUEST]: state => Object.assign({}, state, {
    fetchError: null,
    sites: [], // * see note below
    isGetting: true
  }),
  [GET_AUTHORS_SUCCESS]: (state, {payload}) => merge({}, state, {
    isGetting: false,
    sites: payload  // * see note below
  }),
  [GET_AUTHORS_FAIL]: (state, {payload}) => Object.assign({}, initialState, {
    getError: payload,
    isGetting: false
  }),
  // ...
  // * note: If you use normalizr, you will not need to store entity data in these reducers,
  // your dedicated 'entities' normalising reducer will keep that data.
```
## Configuring XHR middleware
You can specify an options object to the XHR middleware creator:

```javascript
const options = {
  apiHeaders: {},
  apiGateway: ''
};
const xhrMiddleware = xhrMiddlewareCreator(options);
```

```apiHeaders``` can add/override any XHR header other than ```Accept``` and ```Content-Type``` headers, which are set as ```application/json``` by default.

```apiGateway``` is a string as prefix to the paths, in case the API gateway is different to the application server, e.g. ```apiGateway``` could be ```https://myGateway.com:8081```.

#### Example:
```javascript
const options = {
  apiHeaders: {
    Authorization:  'my token'
  },
  apiGateway: '/api'
};
```
