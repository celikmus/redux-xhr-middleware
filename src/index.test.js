/*  eslint no-undef: 0  */
import '../config/polyfills';
import xhrMiddleware from './index';

describe('api middleware', () => {
  const doDispatch = () => {};
  const doGetState = () => {};
  const nextHandler = xhrMiddleware({dispatch: doDispatch, getState: doGetState});

  it('must return a function to handle next', () => {
    expect(typeof nextHandler).toBe('function');
    expect(nextHandler.length).toBe(1);
  });

  describe('handle next', () => {
    it('must return a function to handle action', () => {
      const actionHandler = nextHandler();
      expect(typeof actionHandler).toBe('function');
      expect(actionHandler.length).toBe(1);
    });
  });

  describe('handle action', () => {
    it('must pass action to next', done => {
      const actionObj = {};
      const actionHandler = nextHandler(action => {
        expect(action).toBe(actionObj);
        done();
      });
      actionHandler(actionObj);
    });

    it('must return promise', (done) => {
      const action = {types: ['a', 'b', 'c'], xhr: {url: '/', method: 'GET'}};
      const actionHandler = nextHandler();
      const outcome = actionHandler(action);
      expect(outcome.constructor.name).toBe('Promise');
      outcome
        .then(() => {})
        .catch(() => {});
      done();
    });
  });
  describe('handle errors', () => {
    it('must throw if argument is non-object', done => {
      try {
        xhrMiddleware();
      } catch (err) {
        done();
      }
    });
  });
});
