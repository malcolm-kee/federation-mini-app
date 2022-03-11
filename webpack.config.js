const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const path = require('path');

const pkgJson = require('./package.json');

const port = process.env.PORT || 8080;

/**
 * @returns {import('webpack').Configuration}
 */
module.exports = (env, { mode }) => {
  const publicPath =
    process.env.VERCEL_URL ||
    process.env.PUBLIC_PATH ||
    (mode === 'development'
      ? `http://localhost:${port}/`
      : 'https://federation-mini-app.vercel.app/');

  return {
    mode,
    output: {
      publicPath: sanitizePublicPath(publicPath),
      clean: true,
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'), // workaround for https://github.com/shellscape/webpack-manifest-plugin/issues/256
    },

    resolve: {
      extensions: ['.jsx', '.js', '.json'],
    },

    devServer: {
      port: port,
    },

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
        name: 'mini',
        filename: 'remoteEntry.js',
        exposes: {
          './content': './src/content',
        },
        remotes: {},
        shared: {
          ...pkgJson.dependencies,
          react: {
            singleton: true,
            requiredVersion: pkgJson.dependencies.react,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: pkgJson.dependencies['react-dom'],
          },
        },
      }),
      new HtmlWebPackPlugin({
        template: './src/index.html',
      }),
      new WebpackManifestPlugin(),
    ],
  };
};

/**
 *
 * @param {string} str
 * @returns string
 */
const sanitizePublicPath = (str) => {
  const withTrailingSlash = str.endsWith('/') ? str : `${str}/`;
  return withTrailingSlash.startsWith('http')
    ? withTrailingSlash
    : `https://${withTrailingSlash}`;
};
