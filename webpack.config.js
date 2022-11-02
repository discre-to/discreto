/**    _ _                 _
 *  __| (_)___ __ _ _ ___ | |_ ___
 * / _` | (_-</ _| '_/ -_)|  _/ _ \
 * \__,_|_/__/\__|_| \___(_)__\___/
 *
 * Copyright © 2020 - MIT License
 * Greg Deback <greg@discre.to>
 * <https://discre.to>
 *
 * Webpack config
 *
 * @see https://github.com/webpack-contrib/sass-loader
 * @see https://github.com/webpack-contrib/mini-css-extract-plugin
 */

const
  path = require('path'),
  css  = require('mini-css-extract-plugin')

module.exports = {
  mode:  'production',
  entry: [
    './src/discreto.js',
    './src/discreto.scss'
  ],
  output: {
    path:     path.resolve(__dirname, 'dist'),
    filename: 'discreto.min.js'
  },
  plugins: [ new css({
    filename: 'discreto.min.css'
  }) ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use:  [ css.loader, 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        type: 'asset/inline'
      }
    ]
  }
}
