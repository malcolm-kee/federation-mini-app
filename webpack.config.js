const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const path = require('path');

const pkgJson = require('./package.json');

/**
 * @returns {import('webpack').Configuration}
 */
module.exports = (env, { mode }) => {
  const publicPath =
    process.env.VERCEL_URL ||
    process.env.PUBLIC_PATH ||
    (mode === 'development'
      ? 'http://localhost:8080/'
      : 'https://federation-mini-app.vercel.app/');

  return {
    mode,
    output: {
      publicPath,
      clean: true,
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'), // workaround for https://github.com/shellscape/webpack-manifest-plugin/issues/256
    },

    resolve: {
      extensions: ['.jsx', '.js', '.json'],
    },

    devServer: {
      port: 8080,
      hot: true,
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
        name: pkgJson.federations.name,
        filename:
          mode === 'development'
            ? 'remoteEntry.js'
            : 'remoteEntry.[contenthash].js',
        remotes: {},
        exposes: pkgJson.federations.exposes,
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
