//const { initializeApp } = require("firebase-admin/app");
//
//initializeApp();
//

const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const auth = getAuth();

const { onRequest } = require("firebase-functions/v2/https");

exports.adminAddUser = onRequest(async(request, response) => {
  //userName + accountID creation
  const d = new Date();
  //d.getMonth() returns a month from 0-11 (Jan=0 - Dec=11)
  const month = d.getMonth() + 1;
  const year = d.getFullYear() % 100;

  //userId
  const userId = Math.floor(Math.random() * 10000000);

  const firstName = request.query.firstName;
  const lastName = request.query.lastName;
  const email = request.query.email;
  const password = request.query.password;
  const address = request.query.address;
  const dateOfBirth = request.query.DOB;
  const accountType = request.query.accountType;
  const securityQuestion = request.query.securityQuestion;


  //userName
  const userName = firstName.charAt(0) + lastName + "-" + month + "-" + year;

  //active set to true
  //profile_pic_url set to ""
  //profile_pic_url set to ""

  auth.createUser({
    email: email,
    password: password,
  });

  db.collection("Users")
    .doc(`${email}`).set({
      Address: `${address}`,
      DateOfBirth: `${dateOfBirth}`,
      Email: `${email}`,
      Password: `${password}`,
      accountType: `${accountType}`,
      active: true,
      firstName: `${firstName}`,
      lastName: `${lastName}`,
      profile_pic_url: "",
      userId: `${userId}`,
      userName: `${userName}`
    });
  response.send(`
          <head>
          </head>
          <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
          <div class="container" style="text-align: center; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background-color: #ffffff; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #333;">Account Creation Confirmation</h1>
          <p style="color: #666; font-size: 18px;">You have successfully created and account for ${firstName}, ${lastName}. Their account status is also now active.</p>
          <button onclick="goBack()" 
          style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); font-size: 16px; cursor: pointer; transition: background-color 0.3s ease;" 
          onmouseover="this.style.backgroundColor='#45a049'" 
          onmouseout="this.style.backgroundColor='#4CAF50'">
          Done
          </button>
          </div>
          </body>

          <script>
          function goBack(){
          window.location.href = "https://profitpro-e81ab.web.app/adminPage.html";
          }
          </script>
    `);


});


exports.updateUserDoc = onRequest(async(request, res) => {
  const { email, changeEmail, address, dateOfBirth, password, accountType, active, firstName, lastName, profileUrl, suspendedEnd, suspendedStart } = request.query;

  let update = {};
  let response = { Message: "Doc Updated",};

  if (changeEmail){
    update.Email = changeEmail;
    response.Email = changeEmail;
  }
  if (address){
    update.Address = address;
    response.Address = address;

  }
  if (dateOfBirth){
    update.DateOfBirth = dateOfBirth;
    response.DateOfBirth = dateOfBirth;

  }
  if (password){
    update.Password = password;
    response.Password = password;

  }
  if (accountType){
    update.accountType = accountType;
    response.accountType = accountType;

  }
  if (active){
    update.active = active;
    response.active = active;

  }
  if (firstName){
    update.firstName = firstName;
    response.firstName = firstName;

  }
  if (lastName){
    update.lastName = lastName;
    response.lastName = lastName;

  }
  if (profileUrl){
    update.profile_pic_url = profileUrl;
    response.profile_pic_url = profileUrl;

  }
  if (suspendedEnd){
    update.suspendedEnd = suspendedEnd;
    response.suspendedEnd = suspendedEnd;

  }
  if (suspendedStart){
    update.suspendedStart = suspendedStart;
    response.suspendedStart = suspendedStart;

  }



  db.collection("Users").doc(`${email}`).update(update)
    .then(() => {
      console.log("OK");
    })
    .catch((e) => {
      console.log(e);
  });


  res.status(200).json(response);

});



