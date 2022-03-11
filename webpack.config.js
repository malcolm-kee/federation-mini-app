require('dotenv').config();

const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { dependencies } = require('./package.json');

/**
 * @returns {import('webpack').Configuration}
 */
module.exports = (env, { mode }) => {
  const publicPath =
    process.env.PUBLIC_PATH ||
    (mode === 'development'
      ? 'http://localhost:8080/'
      : 'https://federation-mini-app.vercel.app/');

  return {
    mode,
    output: {
      publicPath: sanitizePublicPath(publicPath),
      clean: true,
      filename: '[name].[contenthash].js',
    },

    resolve: {
      extensions: ['.jsx', '.js', '.json'],
    },

    devServer: {
      port: 8080,
    },

    devtool: mode === 'development' ? 'eval' : 'source-map',

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },

    plugins: [
      new ModuleFederationPlugin({
        name: process.env.EXPOSED_NAME || 'starter',
        filename: 'remoteEntry.js',
        remotes: {},
        exposes: {
          './content': './src/content',
        },
        shared: {
          ...dependencies,
          react: {
            singleton: true,
            requiredVersion: dependencies.react,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: dependencies['react-dom'],
          },
        },
      }),
      new HtmlWebPackPlugin({
        template: './src/index.html',
      }),
    ],
  };
};

/**
 *
 * @param {string} str
 * @returns
 */
const sanitizePublicPath = (str) => {
  const withTrailingSlash = str.endsWith('/') ? str : `${str}/`;
  return withTrailingSlash.startsWith('http')
    ? withTrailingSlash
    : `https://${withTrailingSlash}`;
};
