const webpack = require('webpack');
const tsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const commonConfig = {
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.wasm'],
    plugins: [new tsconfigPathsPlugin()],
    fallback: {
      path: false,
      fs: false,
      env: false,
      os: require.resolve('os-browserify/browser'),
      util: require.resolve('util/'),
    },
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /wordlists\/(french|spanish|italian|korean|chinese_simplified|chinese_traditional|japanese)\.json$/,
    }),
  ],
};

const nodeConfig = {
  ...commonConfig,
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    filename: 'bundle.node.js',
  },
  experiments: {
    asyncWebAssembly: true,
    topLevelAwait: true, // Support top await
  },
};

module.exports = [nodeConfig];
