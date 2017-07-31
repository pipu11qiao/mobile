/**
 * Created by Administrator on 2017/7/25 0025.
 */
var path = require('path');
var webpack = require('webpack');
var ExtractPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 区分开发和生产
// var env = process.env.NODE_ENV.trim();
var env = 'development';
var PRODUCTION = env === 'production';
var DEVELOPMENT = env === 'development';

var entry = PRODUCTION ? './src/index.js' : ['./src/index.js', 'webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:8080'];
// plugin
console.log(PRODUCTION);

var plugins = PRODUCTION
  ? [
    new ExtractPlugin('style-[contenthash:10].css'),
    new HtmlWebpackPlugin({
      template: './index-template.html'
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
  : [new webpack.HotModuleReplacementPlugin()];

// definePlugin
plugins.push(new webpack.DefinePlugin({
  DEVELOPMENT: JSON.stringify(DEVELOPMENT),
  PRODUCTION: JSON.stringify(PRODUCTION)
}));

var cssLoaders = PRODUCTION
  ? ExtractPlugin.extract({
    fallback: 'style-loader',
    use: 'css-loader'
  })
  : ['style-loader','css-loader?localIdentName=[path][name] --- [local]'];

module.exports = {
  devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项
  entry: entry,
  plugins: plugins,
  output: {
    path: path.join(__dirname,'./dist'),
    publicPath: PRODUCTION ? '/' : '/dist/',
    filename: PRODUCTION ? 'app[hash:12].min.js': 'app.js'
  },
  externals: {
    zepto: 'Zepto',
    jquery: 'jQuery'
  },
  module:{
    rules:[
      //es6
      {
        test: /\.js$/,
        use:'babel-loader',
        exclude: path.join(__dirname,'./node_modules')
      },
      // img
      {
        test: /\.(jpg|png|gif)$/,
        use: 'url-loader?limit=10000&name=images/[hash:12].[ext]',
        exclude: path.join(__dirname,'./node_modules')
      },
      // css
      {
        test: /\.css$/i,
        use: cssLoaders,
        exclude: path.join(__dirname,'./node_modules')
      }
    ]
  },
};