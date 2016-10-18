import merge from 'lodash/merge';

const request = (path, method, body, requestOptions = {}) => {
  const {requestHeaders, requestGateway} = requestOptions;
  const headers = Object.assign({}, requestHeaders);

  const jsonContentAllowed = method === 'PUT' || method === 'POST';
  if (jsonContentAllowed && body) {
    headers['Content-Type'] = 'application/json';
  }

  const acceptsJson = method === 'GET' || method === 'POST' || method === 'OPTIONS';
  if (acceptsJson) {
    headers.Accept = 'application/json';
  }

  const gateway = (!requestGateway || requestGateway === '/') ? '' : requestGateway;
  const url = `${gateway}${path}`;

  return new Promise(function (resolve, reject) {
    const xhrRequest = new XMLHttpRequest();
    for (let header in headers) {
      xhrRequest.setRequestHeader(header, headers[header]);
    }
    xhrRequest.open(url, method);
    xhrRequest.onreadystatechange = () => {
      const {status, statusText, response} = xhrRequest;
      if (status >= 200 && status < 300) {
        resolve(response);
      } else {
        reject({status, statusText});
      }
    };
    xhrRequest.send(body);
  });
};

const creator = (options) => {
  const middleware = ({dispatch}) => next => action => {
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
    return request(xhr.url, method, xhr.data, options).then(
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
  return middleware;
}

export default creator;
