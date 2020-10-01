require('dotenv').config();

const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { dependencies } = require('./package.json');

const mainAppUrl =
  process.env.MAIN_URL || 'https://federation-main-app.vercel.app';

/**
 * @returns {import('webpack').Configuration}
 */
module.exports = (env, { mode }) => {
  const publicPath =
    process.env.PUBLIC_PATH ||
    (mode === 'development'
      ? 'http://localhost:8080/'
      : 'https://federation-mini-app.vercel.app/');

  const exposedName = process.env.EXPOSED_NAME || 'starter';

  return {
    mode,
    output: {
      publicPath,
    },

    resolve: {
      extensions: ['.jsx', '.js', '.json'],
    },

    devServer: {
      port: 8080,
    },

    devtool: false,

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
        name: exposedName,
        filename: 'remoteEntry.js',
        remotes: {
          main: `malcolm@${mainAppUrl}/remoteEntry.js`,
        },
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
