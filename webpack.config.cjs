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
        //Sprint 1 
        { from: "./src/html/index.html", to: "index.html" },
        { from: "./src/html/signIn.html", to: "signIn.html" },
        { from: "./src/html/forgot-password.html", to: "forgot-password.html" },
        { from: "./src/html/userPages/regUser.html", to: "regUser.html" },
        { from: "./src/html/userPages/adminPage.html", to: "adminPage.html" },
        { from: "./src/html/userPages/account-created-confirmation.html", to: "account-created-confirmation.html" },
        //Sprint 2 
        { from: "./src/html/userPages/bookkeeping.html", to: "bookkeeping.html" },
        { from: "./src/html/userPages/reports.html", to: "reports.html" },
        //clint's account search
        { from: "./src/html/clint/coa.html", to: "coa.html" },
        { from: "./src/html/clint/ledger.html", to: "ledger.html" },
        { from: "./src/html/clint/search.html", to: "search.html" },
        { from: "./src/html/clint/coa.html", to: "coa.html" },

        //Sprint 4 
        { from: "./src/html/clint/trialbalance.html", to: "trialbalance.html" },

        //Sprint 5 
        { from: "./src/html/userPages/homeLanding.html", to: "homeLanding.html" },
        { from: "./src/html/userPages/ratioData.html", to: "ratioData.html" },

        //styling
        { from: "./src/css/styles.css", to: "styles.css" },
        { from: "./src/css/adminPage_user_table.css", to: "adminPage_user_table.css" },

        //directories
        {
          from: path.resolve(__dirname, './src/js/js-for-index'),
          to: path.resolve(__dirname, 'dist', 'js-for-index'),
        },
        {
          from: path.resolve(__dirname, './src/js/coa-js/'),
          to: path.resolve(__dirname, 'dist', 'coa-js'),
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
