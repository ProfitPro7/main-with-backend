import { app, auth } from ".//firebaseConfig.js";
import { signUpUser } from ".//signUp.js";
import { signInUser } from ".//signIn.js";
import { getUserName, createUserList, createExpiredPasswordList } from ".//admin.js";
import { sendPasswordResetEmail } from "firebase/auth";

import { populateChartOfAccountsTable, selectAccount, selectAccount2, deselectAccount, deselectAccount2, fillLedger, fillEventLog, fillBeforeAfterTables, selectEventLogBeforeAfter, deSelectBeforeAfter, fillJournal, createJEButton, fillLedgerBookkeeping } from ".//bookkeeping.js";

import { generateStatement } from "./report.js";
import { calculateRatios, fillPendingJournal, fillRatioData } from "./homeLanding.js";

const path = window.location.pathname;


if (!path.includes("index.html") && !path.includes("ratioData.html")) {
  getUserName()
    .then((userName) => {
      document.getElementById('auto-pop-username').innerText = userName;
    })
    .catch((e) => {
      console.log(e);
    });

}


//signIn / Up Page
if (path.includes("signIn.html")) {
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


    if (!formFilled) {
      document.getElementById('createAccount-error').innerText = 'Please fill out the form fully';
      document.getElementById('createAccount-error').style.display = 'contents';
    }
    else if (!ValidPasswordRegex.test(password)) {
      alert('Invalid Password. A password must: \n - Start with a letter \n - Have at least 8 characters \n - Have a letter \n - Have a number \n - Have a special character');

    } else {
      signUpUser(email, password, firstName, lastName, DOB, address);
    }



  });



  //index.js homepage transition
  const registerButton = document.getElementById('register');
  const loginButton = document.getElementById('login');
  const container = document.getElementById('container');

  registerButton.addEventListener('click', (e) => {
    e.preventDefault();
    container.classList.add("active");
  });

  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    container.classList.remove("active");
  });

  document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'forgot-password.html';
  });
}


//admin page javascript
if (path.includes("adminPage.html")) {
  //getUserName()
  //  .then((userName) => {
  //    document.getElementById('adminPage-userName').innerText = userName;
  //  })
  //.catch((e) => {
  //  console.log(e);
  //});

  createUserList('userTableContainer');
  createExpiredPasswordList('expired-password-list');







}




if (path.includes("forgot-password.html")) {
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
            .catch((error) => {
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
    window.location.href = 'signIn.html';
  }
  function closeWrongPopup() {
    document.getElementById('wrong-popupOverlay').style.display = 'none';
    location.reload(); // Refresh the page
  }

  document.addEventListener("DOMContentLoaded", function() {
    handleFormSubmission('forgotPasswordForm');
  });



}



if (path.includes("bookkeeping.html")) {
  populateChartOfAccountsTable("coa_table");
  //populateChartOfAccountsTable("delete_table");

  const table = document.getElementById('coa_table');

  table.addEventListener("click", function(event) {
    const clickedRow = event.target.closest('tr');
    clickedRow.style.pointerEvents = "none";
    if (clickedRow) {
      selectAccount("coa_table", clickedRow.id);
      fillLedgerBookkeeping(clickedRow.id);
    }

  });

  document.getElementById("deSelectAccount").addEventListener("click", function() {
    deselectAccount("coa_table");
    document.getElementById('ledger-table').innerHTML = "";
  });


}


if (path.includes("reports.html")) {
  populateChartOfAccountsTable("coa_table");
  //populateChartOfAccountsTable("delete_table");

  const table = document.getElementById('coa_table');

  //COA click => ledger + event log + account information
  table.addEventListener("click", function(event) {
    const clickedRow = event.target.closest('tr');
    clickedRow.style.pointerEvents = "none";
    if (clickedRow) {
      selectAccount2("coa_table", clickedRow.id);
      fillLedger(clickedRow.id);
      fillEventLog(clickedRow.id);
      fillJournal(clickedRow.id);
      //sets Journal entry hidden source value to the clicked row of the COA
      console.log("clicked row: " + clickedRow.id);
      try {
        document.getElementById('coa-ledger-source').value = `${clickedRow.id}`;
      } catch (e) {
        console.log(e);
      }
      console.log(document.getElementById('coa-ledger-source').value);

      //populateEventLog
    }

  });

  document.getElementById("deSelectAccount").addEventListener("click", function() {
    deselectAccount2("coa_table");
    document.getElementById('ledger-table').innerHTML = "";
    document.getElementById('EventLog-table').innerHTML = "";
    document.getElementById('journal-table').innerHTML = "";
  });


  //Event Log click -> Before and After image
  const eventLog = document.getElementById("EventLog-table");
  eventLog.addEventListener("click", function(event) {
    const clickedRow = event.target.closest('tr');
    clickedRow.style.pointerEvents = "none";
    if (clickedRow) {
      fillBeforeAfterTables(clickedRow.id);
      selectEventLogBeforeAfter('EventLog-table', clickedRow.id)
      console.log("Clicked" + clickedRow.id);
    }

  });

  document.getElementById("closeBeforeAfter").addEventListener("click", function() {
    deSelectBeforeAfter('EventLog-table');
    document.getElementById('EventLogBefore-table').innerHTML = "";
    document.getElementById('EventLogAfter-table').innerHTML = "";
  });




}


if (path.includes("trialbalance.html")) {
  document.getElementById("generateButton").addEventListener("click", function() {
    generateStatement();
  });
}



if (path.includes("homeLanding.html")) {
  calculateRatios()
    .then((ratios) => {
      //Net Profit Margin
      let NetProfitMargin = ratios[0].toFixed(0);
      document.getElementById("netProfitMargin").innerText = `${NetProfitMargin}%`;

      if (NetProfitMargin < 5) {
        document.getElementById("netProfitMargin").style.color = "red";

      } else if (NetProfitMargin < 10) {
        document.getElementById("netProfitMargin").style.color = "orange";

      } else {
        document.getElementById("netProfitMargin").style.color = "green";

      }

      //Current Ratio
      let currentRatio = ratios[1].toFixed(2);
      document.getElementById("currentRatio").innerText = currentRatio;

      if (currentRatio < 1.0) {
        document.getElementById("currentRatio").style.color = "red";

      } else if (currentRatio < 1.5) {
        document.getElementById("currentRatio").style.color = "orange";

      } else {
        document.getElementById("currentRatio").style.color = "green";

      }

      //Asset Turnover Ratio
      let assetTurnover = ratios[2].toFixed(2);
      document.getElementById("assetTurnover").innerText = assetTurnover;

      if (assetTurnover < 0.5) {
        document.getElementById("assetTurnover").style.color = "red";

      } else if (assetTurnover < 1.0) {
        document.getElementById("assetTurnover").style.color = "orange";

      } else {
        document.getElementById("assetTurnover").style.color = "green";

      }
      //Debt-To-Equity Ratio
      let debtToEquity = ratios[3].toFixed(2);
      document.getElementById("debtToEquity").innerText = debtToEquity

      if (debtToEquity < 1.0) {
        document.getElementById("debtToEquity").style.color = "red";

      } else if (debtToEquity < 2.0) {
        document.getElementById("debtToEquity").style.color = "orange";

      } else {
        document.getElementById("debtToEquity").style.color = "green";

      }

      console.log(ratios);
    })
    .catch((e) => {
      console.log(e);
    });;



  document.addEventListener("DOMContentLoaded", function() {
    fillPendingJournal()
      .then(() => {
        if (document.querySelector(`#pendingTable tbody`).innerHTML.trim() === "") {
          console.log("reached the point");
          document.getElementById("pendingTableSection").style.display = "none";
        }
      });
  });

}

if (path.includes("ratioData.html")) {
  fillRatioData();
}


