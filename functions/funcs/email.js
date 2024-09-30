////const logger = require("firebase-functions/logger");
//const { initializeApp } = require("firebase-admin/app");
//
//initializeApp();
//

const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

const {onRequest} = require("firebase-functions/v2/https");

exports.accountApproval = onRequest(async(request, response) => {

  const email = request.query.email;
  const approval = request.query.approval;

  if (approval == 'approved'){

    db.doc(`Users/${email}`).update({
      active: true
    });



    db.collection("mail")
      .add({
            to: `${email}`,
            message: {
                    subject: "Your Profit Pro Account has been Approved!",
                    text: "Approved Account",
                    html: `
                    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

                    <!-- Email container -->
                    <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto; text-align: center;">

                    <!-- Account approved message -->
                    <h1 style="color: #28a745;">Your Account Has Been Approved!</h1>
                    <p style="font-size: 16px; color: #333333;">
                    Congratulations! Your account has been successfully approved. Please answer the following security question to complete your setup.
                    </p>

                    <form action="https://securityquestion-hbs3oxnkoa-uc.a.run.app/securityQuestion" method="GET" style="display: inline-block;">
                    <p style="font-size: 15px; color: #333333;">
                    What is your favorite color? 
                    </p>
                    <input type="hidden" name="email" value="${email}">
                    <input type="text" id="security-answer" name="answer" required 
                    style="width: 300px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 20px; font-size: 16px;"><br>
                    <button type="submit" 
                    style="background-color: #28a745; color: #ffffff; text-decoration: none; 
                    padding: 10px 20px; font-size: 16px; border-radius: 5px; border: none; 
                    cursor: pointer; display: inline-block; font-weight: bold; 
                    text-transform: uppercase; letter-spacing: 0.5px;">
                    Submit
                    </button>
                    </form>

                    <p style="font-size: 12px; color: #888888; margin-top: 30px;">
                    If you didn’t request this, please contact our support team immediately.
                    </p>

                    </div>

              `,
                  },
          })
      .then(() => console.log("Queued email for delivery!"));

    response.send(`
                 <body style="margin: 0; height: 100vh; display: flex; justify-content: center; align-items: center; background-color: #f0f0f0;">
                 <div style="background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); text-align: center;">
                 <h1 style="color: green; font-size: 24px; margin-bottom: 20px;">Account Approved</h1>
                 <p style="font-size: 18px; color: #333;">Email: <strong>${email}</strong></p>
                 </div>
                 </body>
                   `);
  }else if(approval == 'denied'){
    response.send(`
                   <body style="margin: 0; height: 100vh; display: flex; justify-content: center; align-items: center; background-color: #f0f0f0;">
                   <div style="background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); text-align: center;">
                   <h1 style="color: red; font-size: 24px; margin-bottom: 20px;">Account Denied</h1>
                   <p style="font-size: 18px; color: #333;">Email: <strong>${email}</strong></p>
                   </div>
                   </body>
                   `);
  }
});



exports.securityQuestion = onRequest(async(request, response) => {

  const email = request.query.email;
  const answer = request.query.answer;

    db.doc(`Users/${email}`).update({
      securityQuestionAnswer: answer
    });

  response.send(`
          <body style="text-align: center; font-family: Arial, sans-serif; background-color: #f4f4f4; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">

          <div style="background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 30px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4CAF50; margin-bottom: 20px;">Security Questions Set Up</h1>
          <p style="font-size: 16px; color: #333; margin-bottom: 30px;">
          Your security questions have been successfully set up. You can now use them to secure your account and recover it in case you forget your password.
          </p>

          <a href="https://profitpro-e81ab.web.app/" style="display: inline-block; background-color: #4CAF50; color: #fff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
          Log In to Your Account
          </a>
          </div>

          </body>
    `);
});






