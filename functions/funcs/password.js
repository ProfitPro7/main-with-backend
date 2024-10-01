const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const { admin } = require("firebase-admin");
const db = getFirestore();

const auth = getAuth();

const { onRequest } = require("firebase-functions/v2/https");


exports.addPasswordToDatabase = onRequest(async(request, response) => {

  const {password, email } = request.query;

  const d = new Date();
  const month = d.getMonth() + 1;
  const year = (d.getFullYear() + 1);

  
  const expiresOn = year + "-" + month + "-" +  "01";


  db.collection("passwords").doc(`${email}`).set({
    email: `${email}`,
    password: `${password}`,
    expiresOn: `${expiresOn}`
  })
  .then(() => {
    response.status(200).json({message: "updated"});

  })
  .catch((e) => {
    response.status(500).json({message: "Error"});
  });

});


exports.resetPassword = onRequest(async(request, response) => {

  const { email, securityQ } = request.query;
  const userDoc = await db.collection("Users").doc(`${email}`).get()
    .then((doc) => {
      if (doc.exists) {
        const answer = doc.data().securityQuestionAnswer;
        if (answer === securityQ) {
          response.status(200).json({message: "correct"});
        } else {
          response.status(400).json({ message: "wrong" });
        }
      } else {
        response.status(404).json({ message: "user document not found" });
      }
    });


});


//exports.updatePassword = onRequest(async(request, response) => {
//
//  const { email, newPassword } from request.query;
//  firebase.auth().sendPasswordResetEmail(email)
//    .then(() => {
//      response.send(`
//          <body style="font-family: Arial, sans-serif; background-color: #f8f9fa; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
//          <div style="background-color: #fff; padding: 40px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 10px; text-align: center; max-width: 400px;">
//          <h1 style="color: #333; margin-bottom: 20px;">Password Changed</h1>
//          <p style="color: #555; margin-bottom: 30px;">Your password has been changed successfully.</p>
//          <button onclick="window.location.href='signIn.html'" style="background-color: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Go to Login</button>
//          </div>
//
//          </body>
//        `);
//
//  })
//  .catch((e) => {
//    console.log(e);
//  });
//  
//
//});
//

//          response.send(`
//          <div style="background-color: #fff; padding: 40px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 10px; text-align: center; max-width: 400px;">
//          <h1 style="color: #333; margin-bottom: 20px;">Reset Your Password</h1>
//          <form action="" method="GET" style="display: flex; flex-direction: column; align-items: center;">
//          <label for="password" style="color: #555; margin-bottom: 10px; font-size: 16px;">Enter New Password:</label>
//          <input type="password" id="password" name="newPassword" placeholder="New Password" required style="padding: 10px; margin-bottom: 20px; width: 100%; border: 1px solid #ccc; border-radius: 5px;">
//
//          <label for="confirm-password" style="color: #555; margin-bottom: 10px; font-size: 16px;">Confirm New Password:</label>
//          <input type="password" id="confirm-password" placeholder="Confirm New Password" required style="padding: 10px; margin-bottom: 20px; width: 100%; border: 1px solid #ccc; border-radius: 5px;">
//
//          <button type="submit" style="background-color: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Submit</button>
//          </form>
//          </div>
//            `);
