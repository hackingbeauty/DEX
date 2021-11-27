import webpack from 'webpack'
import path from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackTagsPlugin from 'html-webpack-tags-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import WebpackPwaManifest from 'webpack-pwa-manifest'
import FaviconsWebpackPlugin from 'favicons-webpack-plugin'
import SentryWebpackPlugin from '@sentry/webpack-plugin'
import SitemapPlugin from 'sitemap-webpack-plugin'
import prettydata from 'pretty-data'
import {
  manifestJSON,
  socialMediaTags,
  siteMapPaths1
} from '../src/configs/config-main'

const prettyPrint = (xml) => {
  return prettydata.pd.xml(xml)
}

module.exports = {
  mode: 'production',
  stats: 'errors-only',
  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'resolve-url-loader' },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              data: '@import "config-styles.scss";',
              includePaths: [
                path.join(__dirname, '..', '/src/configs/theme')
              ]
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      },
      __DEVELOPMENT__: false
    }),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new HtmlWebpackTagsPlugin({
      metas: socialMediaTags
    }),
    new CopyWebpackPlugin([
      { from: 'src/manifest.json' },

      { from: 'src/assets/robots.txt' }
    ]),
    new WebpackPwaManifest(manifestJSON),
    new FaviconsWebpackPlugin('assets/favicons/favicon.svg'),
    // Sentry Plugin must come at the end in order for sourcemaps to work
    new SentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,

      // webpack specific configuration
      include: '.',
      ignore: ['node_modules', 'webpack.config.js']
    })
  ]
}
