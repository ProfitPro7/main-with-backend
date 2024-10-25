import { app, auth } from ".//firebaseConfig.js";
import { signUpUser } from ".//signUp.js";
import { signInUser } from ".//signIn.js";
import { getUserName, createUserList, createExpiredPasswordList } from ".//admin.js";
import { sendPasswordResetEmail } from "firebase/auth";

import { populateChartOfAccountsTable, selectAccount, selectAccount2, deselectAccount, deselectAccount2, fillLedger, fillEventLog } from ".//bookkeeping.js";

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


//admin page javascript
if(path.includes("adminPage.html")){
  getUserName()
    .then((userName) => {
      document.getElementById('adminPage-userName').innerText = userName;
    })
  .catch((e) => {
    console.log(e);
  });

  createUserList('userTableContainer');
  createExpiredPasswordList('expired-password-list');
    






}




if(path.includes("forgot-password.html")){
  async function handleFormSubmission(formId) {
    const form = document.getElementById(formId);

    form.addEventListener("submit", async function(event) {
      event.preventDefault();

      const input = new FormData(event.target);
      const queryParams = new
        URLSearchParams(input).toString();
      const url = `${event.target.action}?${queryParams}`;

      try {
        const API_response = await fetch(url, {
          method: "GET"
        });

        const result = await API_response.json();
      const email = event.target.email.value;

        const message = result.message;
        if (message.includes("correct")) {
          sendPasswordResetEmail(auth, email)
            .then(() => {
              showPopup();
            })
          .catch((error)=> {
            console.log(error);
          });
        }
      } catch (e) {
        showWrongPopup();
        console.log(e);
      }

    });
  }

  function showPopup() {
    document.getElementById('popupOverlay').style.display = 'block';
  }

  function showWrongPopup() {
    document.getElementById('wrong-popupOverlay').style.display = 'block';
  }

  function closePopup() {
    document.getElementById('popupOverlay').style.display = 'none';
    window.location.href='signIn.html';
  }
  function closeWrongPopup() {
    document.getElementById('wrong-popupOverlay').style.display = 'none';
    location.reload(); // Refresh the page
  }

  document.addEventListener("DOMContentLoaded", function() {
    handleFormSubmission('forgotPasswordForm');
  });



}



if(path.includes("bookkeeping.html")){
  populateChartOfAccountsTable("coa_table");
  //populateChartOfAccountsTable("delete_table");

  const table = document.getElementById('coa_table');

  table.addEventListener("click", function(event){
    const clickedRow = event.target.closest('tr');
    clickedRow.style.pointerEvents = "none";
    if(clickedRow){
      selectAccount("coa_table", clickedRow.id);
      fillLedger(clickedRow.id);
    }

  });

  document.getElementById("deSelectAccount").addEventListener("click", function() {
      deselectAccount("coa_table");
    document.getElementById('ledger-table').innerHTML = "";
  });


}


if(path.includes("reports.html")){
  populateChartOfAccountsTable("coa_table");
  //populateChartOfAccountsTable("delete_table");

  const table = document.getElementById('coa_table');

  //COA click => ledger + event log + account information
  table.addEventListener("click", function(event){
    const clickedRow = event.target.closest('tr');
    clickedRow.style.pointerEvents = "none";
    if(clickedRow){
      selectAccount2("coa_table", clickedRow.id);
      fillLedger(clickedRow.id);
      fillEventLog(clickedRow.id);
      //populateEventLog
    }

  });

  document.getElementById("deSelectAccount").addEventListener("click", function() {
      deselectAccount2("coa_table");
    document.getElementById('ledger-table').innerHTML = "";
    document.getElementById('EventLog-table').innerHTML = "";
  });


  //Event Log click -> Before and After image
  const eventLog = document.getElementById("EventLog-table");
  eventLog.addEventListener("click", function(event){
    const clickedRow = event.target.closest('tr');
    clickedRow.style.pointerEvents = "none";
    if(clickedRow){
      console.log("Clicked" + clickedRow.id);
    }

  });



}




