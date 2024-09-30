import { app } from ".//firebaseConfig.js";
import { signUpUser } from ".//signUp.js";
import { signInUser } from ".//signIn.js";
import { getUserName } from ".//admin.js";

const path = window.location.pathname;


//signIn / Up Page
if(path.includes("signIn.html")){
  //signInUser upon submit button click on sign in page
  document.getElementById('sign-in-user').addEventListener("click", () => {
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    signInUser(email, password);

  });



//signUpUser upon submit button click on sign up page
document.getElementById('create-new-user').addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const firstName = document.getElementById('signup-firstname').value;
  const lastName = document.getElementById('signup-lastname').value;
  const address = document.getElementById('signup-address').value;
  const DOB = document.getElementById('signup-DOB').value;

  let formFilled = true; 

  var inputs = document.getElementById('account-creation').querySelectorAll("input, textarea");

  inputs.forEach(function(input) {
    if (input.value.trim() === "") {
      formFilled = false;
      input.style.border = "1px solid red";
    } else {
      input.style.border = "";
    }
  });

  const ValidPasswordRegex = /^[A-Za-z](?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;


  if(!formFilled){
    document.getElementById('createAccount-error').innerText = 'Please fill out the form fully';
    document.getElementById('createAccount-error').style.display = 'contents'; 
  }
  else if(!ValidPasswordRegex.test(password)){
    alert('Invalid Password. A password must: \n - Start with a letter \n - Have at least 8 characters \n - Have a letter \n - Have a number \n - Have a special character');

  }else{
    signUpUser(email, password, firstName, lastName, DOB, address);
  }



});



//index.js homepage transition
const registerButton = document.getElementById('register');
const loginButton = document.getElementById('login');
const container = document.getElementById('container');

registerButton.addEventListener('click', (e)=> {
  e.preventDefault();
  container.classList.add("active");
});

loginButton.addEventListener('click', (e)=> {
  e.preventDefault();
  container.classList.remove("active");
});

document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
  e.preventDefault(); 
  window.location.href = 'forgot-password.html';
});
}





if(path.includes("forgot-password.html")){
  //forgot-password js: 
  document.getElementById('resetPasswordBtn').addEventListener('click', function () {
    const email = document.getElementById('forgotEmail').value;
    const userId = document.getElementById('forgotUserId').value;
    const securityAnswer = document.getElementById('securityQuestion').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMsg = document.getElementById('errorMsg');

    if (!email || !userId || !securityAnswer || !newPassword || !confirmPassword) {
      errorMsg.textContent = 'Please fill in all fields.';
      return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      errorMsg.textContent = 'Password must be at least 8 characters, include a letter, a number, and a special character.';
      return;
    }

    if (newPassword !== confirmPassword) {
      errorMsg.textContent = 'Passwords do not match.';
      return;
    }

    //  auth.sendPasswordResetEmail(email)
    //    .then(function () {
    //      errorMsg.textContent = 'Password reset email sent! Check your inbox.';
    //    })
    //    .catch(function (error) {
    //      console.error(error);
    //      errorMsg.textContent = error.message;
    //    });
  });
}




if(path.includes("adminPage.html")){
  getUserName()
    .then((userName) => {
      document.getElementById('adminPage-userName').innerText = userName;
    })
  .catch((e) => {
    console.log(e);
  });
}
