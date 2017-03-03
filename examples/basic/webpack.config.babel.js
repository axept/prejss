import path from 'path';
import webpack from 'webpack';

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: [
    './react-app/index.js'
  ],
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'app.js',
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
  ],
  resolve: {
    modules: [
      __dirname,
      'node_modules',
      '../../../node_modules'
    ],
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ]
  },
};
