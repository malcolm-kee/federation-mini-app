const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

const pkgJson = require('./package.json');

const port = process.env.PORT || 8080;

/**
 * @returns {import('webpack').Configuration}
 */
module.exports = (env, { mode }) => {
  const isProd = mode === 'production';

  return {
    mode,
    output: {
      publicPath: 'auto',
      filename: isProd
        ? 'static/js/[name].[contenthash].js'
        : 'static/js/[name].js',
      chunkFilename: isProd
        ? 'static/js/[name].[contenthash].js'
        : 'static/js/[name].chunk.js',
      clean: true,
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

    devtool: isProd ? 'source-map' : 'cheap-module-source-map',

    plugins: [
      new ModuleFederationPlugin({
        name: 'mini',
        filename: 'remoteEntry.js',
        exposes: {
          './content': './src/exposes/content',
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
    ],
  };
};
