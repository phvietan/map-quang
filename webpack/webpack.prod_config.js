const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, '..', 'js', 'map.js'),
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: 'bundle.js',
  },
  devtool: 'source-map',
};
