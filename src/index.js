import merge from '../../../node_modules/lodash/merge';

const request = (path, method, body) => {

};

const api = ({dispatch}) => next => action => {
  const {
    types,
    xhr,
    payload = {}
  } = action;

  if (!types) {
    // Normal action: pass it on
    return next(action);
  }

  if (!Array.isArray(types) ||
    types.length !== 3 ||
    !types.every(type => typeof type === 'string')
  ) {
    throw new Error('api: Expected an array of three string types.');
  }

  if ((typeof xhr !== 'object') || !xhr.url || !xhr.method) {
    throw new Error('api: Expected xhr to be an object with at least a url and a method.');
  }

  const [requestType, successType, failType] = types;

  dispatch(merge({}, {
    type: requestType,
    payload
  }));

  const method = xhr.method.toUpperCase();
  return request(xhr.url, method, xhr.data).then(
    response => dispatch({
      type: successType,
      payload: Object.assign({}, payload, response)
    }),
    error => {
      dispatch({
        type: failType,
        payload: Object.assign({}, payload, error)
      });
      throw error;
    });
};
export default api;
