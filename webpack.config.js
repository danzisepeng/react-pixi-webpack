const webpack = require('webpack');
const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OS = require('os');

const webpackConfig = {
  entry: {},
  output:{
    path:path.resolve(__dirname, './dist/'),
    filename:'js/[name].[chunkhash:6].js'
  },
  //设置开发者工具的端口号,不设置则默认为8080端口
  devServer: {
    inline: true,
    port: 3000
  },
  devtool: 'source-map',
  module:{
    rules:[
      {
        test:/\.js?$/,
        exclude:/node_modules/,
        loader:'babel-loader',
        query:{
          presets:['es2015','react']
        }
      },
      {
        test: /\.(scss|sass|css)$/, 
        loader: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader"})
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: './images/',
              publicPath: ''
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("css/[name].[chunkhash:6].css"),
    new CleanWebpackPlugin(
      ['dist'],　 
      {
        root: __dirname,    　　　　　　　　　　
        verbose: true,    　　　　　　　　　　
        dry: false, 　　　　　　　　　　
      }
    )
  ],
};
//动态获取本机IPv4配置devserver.host

const NetWork = OS.networkInterfaces();

for ( let item in NetWork ) {
  const devName = NetWork[item];
  for ( let i = 0; i < devName.length; i++) {
    const oKeys = devName[i];
    if (oKeys.family === "IPv4" && oKeys.address !== "127.0.0.1" && !oKeys.internal) {
      webpackConfig.devServer.host = oKeys.address;
    }
  }
}

// 获取指定路径下的入口文件
function getEntries(globPath) {
  const files = glob.sync(globPath),
   entries = {};
   console.log(files);
  files.forEach(function(filepath) {
    const split = filepath.split('/')[1].split('.');
    const name = split[0];
    entries[name] = './' + filepath;
  });
  return entries;
}
    
const entries = getEntries('src/**.js');

Object.keys(entries).forEach(function(name) {
  webpackConfig.entry[name] = entries[name];
  const plugin = new HtmlWebpackPlugin({
    filename: name + '.html',
    template: './public/index.html',
    inject: true,
    chunks: [name]
  });
  webpackConfig.plugins.push(plugin);
})

module.exports = webpackConfig;