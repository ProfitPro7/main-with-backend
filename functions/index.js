const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

const emailFunctions = require('./funcs/email');
const adminFunctions = require('./funcs/admin');
const passwordFunctions = require('./funcs/password');


exports.accountApproval = emailFunctions.accountApproval;
exports.securityQuestion = emailFunctions.securityQuestion;

exports.adminAddUser = adminFunctions.adminAddUser;
exports.updateUserDoc = adminFunctions.updateUserDoc;
exports.sendMail = emailFunctions.sendMail;

exports.addPasswordToDatabase = passwordFunctions.addPasswordToDatabase;
exports.resetPassword = passwordFunctions.resetPassword;
exports.updatePassword = passwordFunctions.updatePassword;
