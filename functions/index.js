const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

const emailFunctions = require('./funcs/email');
const adminFunctions = require('./funcs/admin');


exports.accountApproval = emailFunctions.accountApproval;
exports.securityQuestion = emailFunctions.securityQuestion;

exports.adminAddUser = adminFunctions.adminAddUser;
