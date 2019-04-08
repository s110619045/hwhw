// Plugins
const Path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const opts = {
  rootDir: process.cwd(),
  devBuild: process.env.NODE_ENV !== 'production',
};

module.exports = {
  entry: {
    app: './src/js/script.js'
  },
  output: {
    path: Path.join(opts.rootDir, 'dist'),
    pathinfo: opts.devBuild,
    filename: 'js/[name]_bundle.js'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    // Extract css files to seperate bundle
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css'
    }),
    // Copy fonts and images to dist
    new CopyWebpackPlugin([
      {from: 'src/fonts', to: 'fonts'},
      {from: 'src/images', to: 'images'},
      {from: 'src/index.html', to: './'}
    ])
  ],
  module: {
    rules: [
      // Babel-loader
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env',
                        '@babel/react',{
                        'plugins': ['@babel/plugin-proposal-class-properties']}]
            }
          }
        ]        
      },
      // Css-loader & sass-loader
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      // Load fonts
      {
        test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader : 'url-loader',
        options: {
          limit: 100000
        }
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.scss', '.jsx'],
    modules: ['node_modules'],
    alias: {
      request$: 'xhr'
    }
  }
}
