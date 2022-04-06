const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, '..', 'js', 'index.js'),
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: 'bundle.js',
  },
  devtool: 'source-map',
};
