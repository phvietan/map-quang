const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, '..', 'js', 'index.js'),
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: 'bundle.js',
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
  },
};
