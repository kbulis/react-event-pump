module.exports = {
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  entry: {
    ContextEventPump: './src/ContextEventPump.jsx',
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      use: 'babel-loader'
    }]
  }
};
