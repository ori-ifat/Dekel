const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //extract-text-webpack-plugin replacement
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const relpath = path.join.bind(path, __dirname)

const NODE_ENV = process.env.NODE_ENV || 'development'
const isTestEnv = NODE_ENV === 'test'
const isProductionCode = NODE_ENV === 'production'
const isDevelopmentServer = NODE_ENV == 'development'
const ASSET_PATH = process.env.ASSET_PATH || '/'
const API_BASEURL = process.env.API_BASEURL

const paths = {
  dist: relpath(`./dist/${NODE_ENV}`),
  appEntry: relpath('./src/app/index'),
  indexHtml: relpath('./src/app/index.html'),
  icon: relpath('./src/app/favicon.ico'),									 
  src: relpath('./src'),
  lib: relpath('./node_modules')
}

module.exports = {
  mode: isProductionCode ? 'production' : 'development',
  devServer: {
    compress: true,
    hot: true,
    port: process.env.PORT || '9001',
    historyApiFallback: true,
    disableHostCheck: true
  },
  context: path.resolve(__dirname, 'src'),
  devtool: getSourceMap(),
  bail: !isDevelopmentServer,
  entry: getEntryPoints(),
  output: {
    path: paths.dist,
    filename: '[name].[hash].js',
    publicPath: ASSET_PATH
  },
  plugins: getPlugins(),
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx', '.scss', '.less', '.css'],
	  alias: {
      util: path.join(__dirname, '/node_modules/foundation-sites/scss/util/_util.scss'),
      'react-dom': '@hot-loader/react-dom' //,
      //common: path.join(__dirname, 'src/common')
    }	
  },
  externals: {
    jQuery: 'jQuery',
    foundation: 'Foundation'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: paths.src,
        terserOptions: {
          ecma: 6,
          warnings: false,
          parse: {},
          compress: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      chunks: 'all'
    }
    /*minimizer: [
      // we specify a custom UglifyJsPlugin here to get source maps in production
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      }), new OptimizeCSSAssetsPlugin({})
    ]*/
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDevelopmentServer
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: {
                mode: 'local',
                localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
                context: process.cwd()   //note: must match react-css-modules context. this is a default that I could not fix
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              generateScopedName: '[path]___[name]__[local]___[hash:base64:5]',
              plugins: [
                require('autoprefixer')(),
				        require('cssnano')()
              ]
            }
          },
          'sass-loader'
        ]
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, {
        test: /\.less$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: isDevelopmentServer
          }
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true
          }
        }]
      },
      // **IMPORTANT** This is needed so that each foundation js file required by
      // foundation-webpack has access to the jQuery object
      {
        test: /foundation\/js\//,
        loader: 'imports-loader?jQuery=jquery',
        include: paths.src
      },
      {
        test: /\.json$/,
        loaders: ['json-loader'],
        include: paths.src
      },
      {
        test: /\.jsx?$/,
        include: [
          paths.src,
          /* note! add here all modules that dist es6, because IE won't load them ... */          
          path.resolve(__dirname, 'node_modules/foundation-sites'),  //needed for production - for IE mainly
          path.resolve(__dirname, 'node_modules/react-image-viewer-zoom'),
          path.resolve(__dirname, 'node_modules/caesar-encrypt')
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        ]
      }, {
        test: /\.yaml$/,
        use: [
          {
            loader: 'yaml-loader'
          }
        ],
        include: paths.src
      },
      {
        test: /\.(png|gif|jpg|jpeg|eot|otf|woff|ttf|svg)?$/,
        loaders: ['url-loader'],
        include: [paths.src,
          path.resolve(__dirname, 'node_modules/react-viewer/dist')
        ]
      }
    ]
  },
  node:{
    fs:'empty'
  }
}

function getSourceMap() {
  // TestEnv source-maps:
  // cheap-module-source-map - fastest that works in the console
  // inline-source-map - works in chrome (for debugging)
  return isTestEnv ? 'inline-source-map' :
    isDevelopmentServer ? 'eval-source-map' :
      'source-map'
}

function getEntryPoints() {
  return isDevelopmentServer
    ? [
      '@babel/polyfill',
      'react-hot-loader/patch',
      paths.appEntry,
      `foundation-sites-loader!${__dirname}/foundation-sites.config.js`  //without that, foundation will not work on production dist
    ]
    :
    [
      '@babel/polyfill',  //IE ...
      paths.appEntry,
      `foundation-sites-loader!${__dirname}/foundation-sites.config.js`  //without that, foundation will not work on production dist
    ]
}

function getPlugins() {
  let plugins = [
    new CleanWebpackPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: `html-loader!${paths.indexHtml}`,
      inject: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(NODE_ENV),
        'ASSET_PATH': JSON.stringify(ASSET_PATH),
        'API_BASEURL': JSON.stringify(API_BASEURL)
      }
    })
  ]

  plugins = plugins.concat([
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: isDevelopmentServer ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDevelopmentServer ? '[id].css' : '[id].[hash].css'
    })
  ])

  plugins = plugins.concat([
    isDevelopmentServer ?
      new webpack.HotModuleReplacementPlugin()
      :
      new TerserPlugin() //new UglifyJsPlugin()
  ])
  
  if (isDevelopmentServer) {
    plugins = plugins.concat([new DashboardPlugin()])
  }
  /*
  if (isDevelopmentServer) {
    plugins = plugins.concat([
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      new webpack.HotModuleReplacementPlugin()
    ])
  }

  if (isProductionCode) {
    plugins = plugins.concat([
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        chunkFilename: '[id].[hash].css',
      }),
      //new webpack.optimize.OccurenceOrderPlugin()
      new UglifyJsPlugin()
    ])
  }*/

  return plugins
}
