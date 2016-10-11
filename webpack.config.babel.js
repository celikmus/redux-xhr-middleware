import path from 'path';
const { NODE_ENV } = process.env;
const filename = `redux-xhr.${NODE_ENV}.js`;

export default {
  entry: [
    'whatwg-fetch',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename
  }
};
