const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/main.js",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin(
      {
        patterns: [
          {
            from: "./images",
            to: "./images"
          },
          {
            from: "./src/index.html",
            to: "./"
          },
          {
            from: "./src/service-worker.js",
            to: "./"
          }
        ]
      }
    )
  ],
  devServer: {
    contentBase: "./dist"
  }
};
