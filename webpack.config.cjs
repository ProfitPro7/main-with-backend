const CopyPlugin = require('copy-webpack-plugin');
//const HTMLWebPackPlugin = require('html-webpack-plugin');

const path = require('path');

module.exports = {
  entry: '/src/js/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        //html files
        {from: "./src/html/index.html", to: "index.html"},
        {from: "./src/html/signIn.html", to: "signIn.html"},
        {from: "./src/html/forgot-password.html", to: "forgot-password.html"},
        {from: "./src/html/userPages/regUser.html", to: "regUser.html"},
        {from: "./src/html/userPages/adminPage.html", to: "adminPage.html"},
        {from: "./src/html/userPages/account-created-confirmation.html", to: "account-created-confirmation.html"},
        {from: "./src/css/styles.css", to: "styles.css"},
        //directories
        {
          from: path.resolve(__dirname, './src/js/js-for-index'),
          to: path.resolve(__dirname, 'dist', 'js-for-index'),
        },
        {
          from: path.resolve(__dirname, './src/css/index-css'),
          to: path.resolve(__dirname, 'dist', 'index-css'),
        },
        {
          from: path.resolve(__dirname, './src/images'),
          to: path.resolve(__dirname, 'dist', 'images'),
        },

      ],

    }),
  ],
};
