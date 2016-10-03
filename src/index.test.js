import apiMiddleware from './index';


describe('api middleware', () => {
  const doDispatch = () => {};
  const doGetState = () => {};
  const nextHandler = apiMiddleware({dispatch: doDispatch, getState: doGetState});

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
    it('must pass action to next if not a function', done => {
      const actionObj = {};

      const actionHandler = nextHandler(action => {
        expect(action).toBe(actionObj);
        done();
      });
      actionHandler(actionObj);
    });
  });
});
