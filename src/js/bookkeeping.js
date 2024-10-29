import { auth, db } from ".//firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";



export async function populateChartOfAccountsTable(tableBodyId){

  const snapshot = await getDocs(collection(db, "Chart_Of_Accounts"));
  snapshot.forEach((doc) => {
    const data = doc.data();
    const newRow = document.createElement("tr");
    newRow.id = doc.id;
    newRow.className = 'caf'
    newRow.classList.add('visible');
    newRow.innerHTML = `
      <td class='caf'>${data.accountNumber}</td>
      <td class='caf'>${data.accountName}</td>
      <td class='caf'>${data.accountDesc}</td>
      <td class='caf'>${data.normalSide}</td>
      <td class='caf'>${data.accountCategory}</td>
      <td class='caf'>${data.accountSubCategory}</td>
`;

    document.getElementById(`${tableBodyId}`).append(newRow);
    
  });



}


//used for bookkeeping.html
export function selectAccount(tbodyId, rowId){
  const tableBody = document.getElementById(`${tbodyId}`);

  const rows = tableBody.querySelectorAll('tr');

  for(let i = 0; i < rows.length; i++){
    const row = rows[i];

    if (row.id !== rowId){
      //row.style.display = "none"
      row.classList.remove('visible');
      row.classList.add('hidden');
      setTimeout(() => { row.style.display = "none";}, 500);
    }
  }
  //document.getElementById("ledgerView").style.display = "block";
  document.getElementById("ledgerView").classList.remove("hidden");
  document.getElementById("ledgerView").classList.add("visible");


  document.getElementById("button-list-div").classList.remove("hidden");
  document.getElementById("button-list-div").classList.add("visible");

  setTimeout(() => {
    document.getElementById("ledgerView").style.display = "block";
    document.getElementById("button-list-div").style.display = "block";
    document.getElementById('coa_title').innerHTML = `Account: ${rowId}`;

  }, 500);

    document.getElementById('modify-source').value = rowId;
    document.getElementById('ledger-source').value = rowId;
    document.getElementById('deleteAccountButton').value = rowId;

}


//used for bookkeeping.html
export function deselectAccount(tbodyId){
  const tableBody = document.getElementById(`${tbodyId}`);
  const rows = tableBody.querySelectorAll('tr');

  for(let i = 0; i < rows.length; i++){
    const row = rows[i];
    if(row.classList.contains('visible')){
      row.style.pointerEvents = "auto";
    }
    if (row.style.display === "none"){
      //row.style.display = "";
      row.classList.remove('hidden');
      row.classList.add('visible');
      setTimeout(() => { row.style.display = "";}, 500);
    }

  }
  //document.getElementById("ledgerView").style.display = "none";
  document.getElementById("ledgerView").classList.remove("visible");
  document.getElementById("ledgerView").classList.add("hidden");


  document.getElementById("button-list-div").classList.remove("visible");
  document.getElementById("button-list-div").classList.add("hidden");

  setTimeout(() => { 
    document.getElementById("ledgerView").style.display = "none";
    document.getElementById("button-list-div").style.display = "none";
    document.getElementById('coa_title').innerHTML = `Account Information`;

  }, 500);


}




//used for reports.html
export function selectAccount2(tbodyId, rowId){
  const tableBody = document.getElementById(`${tbodyId}`);

  const rows = tableBody.querySelectorAll('tr');

  for(let i = 0; i < rows.length; i++){
    const row = rows[i];

    if (row.id !== rowId){
      //row.style.display = "none"
      row.classList.remove('visible');
      row.classList.add('hidden');
      setTimeout(() => { row.style.display = "none";}, 500);
    }
  }
  //document.getElementById("ledgerView").style.display = "block";
  document.getElementById("ledgerView").classList.remove("hidden");
  document.getElementById("ledgerView").classList.add("visible");

  document.getElementById("EventLogView").classList.remove("hidden");
  document.getElementById("EventLogView").classList.add("visible");


  document.getElementById("button-list-div").classList.remove("hidden");
  document.getElementById("button-list-div").classList.add("visible");

  document.getElementById("journalEntries").classList.remove("hidden");
  document.getElementById("journalEntries").classList.add("visible");
  document.getElementById("journal-button-list-div").classList.remove("hidden");
  document.getElementById("journal-button-list-div").classList.add("visible");


  document.getElementById("search").classList.remove("visible");
  document.getElementById("search").classList.add("hidden");

  setTimeout(() => {
    document.getElementById("ledgerView").style.display = "block";
    document.getElementById("search").style.display = "none";
    document.getElementById("EventLogView").style.display = "block";
    document.getElementById("button-list-div").style.display = "block";
  document.getElementById("journalEntries").style.display = "block";
  document.getElementById("journal-button-list-div").style.display = "block";
    document.getElementById('coa_title').innerHTML = `Account: ${rowId}`;

  }, 500);

}

//used for reports.html
export function deselectAccount2(tbodyId){
  const tableBody = document.getElementById(`${tbodyId}`);
  const rows = tableBody.querySelectorAll('tr');

  for(let i = 0; i < rows.length; i++){
    const row = rows[i];
    if(row.classList.contains('visible')){
      row.style.pointerEvents = "auto";
    }
    if (row.style.display === "none"){
      //row.style.display = "";
      row.classList.remove('hidden');
      row.classList.add('visible');
      setTimeout(() => { row.style.display = "";}, 500);
    }

  }
  //document.getElementById("ledgerView").style.display = "none";
  document.getElementById("ledgerView").classList.remove("visible");
  document.getElementById("ledgerView").classList.add("hidden");
  
  document.getElementById("EventLogView").classList.remove("visible");
  document.getElementById("EventLogView").classList.add("hidden");


  document.getElementById("button-list-div").classList.remove("visible");
  document.getElementById("button-list-div").classList.add("hidden");

  document.getElementById("journalEntries").classList.remove("visible");
  document.getElementById("journalEntries").classList.add("hidden");
  document.getElementById("journal-button-list-div").classList.remove("visible");
  document.getElementById("journal-button-list-div").classList.add("hidden");

  document.getElementById("search").classList.remove("hidden");
  document.getElementById("search").classList.add("visible");

  setTimeout(() => { 
    document.getElementById("ledgerView").style.display = "none";
    document.getElementById("search").style.display = "block";
    document.getElementById("EventLogView").style.display = "none";
    document.getElementById("button-list-div").style.display = "none";
  document.getElementById("journalEntries").style.display = "none";
  document.getElementById("journal-button-list-div").style.display = "none";

    document.getElementById('coa_title').innerHTML = `Account Information`;

  }, 500);


}





//used for reports + bookkeeping html files
export async function fillLedger(rowId){

  const tableBody = document.getElementById('ledger-table');



  const Doc = doc(db, "Chart_Of_Accounts", rowId);
  const docSnap = await getDoc(Doc);
  if (docSnap.exists){

    const data = docSnap.data();
    const ledger = data.Ledger;
    console.log(ledger);

    ledger.forEach((entry, index) => {
      const newRow = document.createElement('tr');
      newRow.id = `${rowId}-ledger`;
      newRow.className = 'caf'
      console.log(entry.dateAdded, + ", " + entry.description + ", " + entry.debit + ", " + entry.credit + ", " + entry.balance);
      newRow.innerHTML = `
        <td class='caf'>${entry.dateAdded}</td>
        <td class='caf'>${entry.description}</td>
        <td class='caf'>${entry.debit}</td>
        <td class='caf'>${entry.credit}</td>
        <td class='caf'>${entry.balance}</td>
    `;
      tableBody.append(newRow);
    });


  }

}

//used for reports + bookkeeping html files
export async function fillEventLog(rowId){

  const tableBody = document.getElementById('EventLog-table');

  const Doc = doc(db, "Chart_Of_Accounts", rowId);
  const docSnap = await getDoc(Doc);
  if (docSnap.exists){

    const data = docSnap.data();
    const eventLog = data.EventLog;

    eventLog.forEach((entry, index) => {
      const newRow = document.createElement('tr');
      newRow.id = `${index}`;
      newRow.className = 'caf'
      newRow.classList.add('visible');
      newRow.innerHTML = `
        <td class='caf'>${entry.eventId}</td>
        <td class='caf'>${entry.typeOfChange}</td>
        <td class='caf' style='width: 300px;'>${entry.description}</td>
        <td class='caf'>${entry.dateChanged}</td>
        <td class='caf'>${entry.timeChanged}</td>
        <td class='caf'>${entry.userId}</td>
    `;
      tableBody.append(newRow);
    });


  }
}


  //******************************************************************************************
  //      Event Log before and After images implementation
  //******************************************************************************************


  
//must be called as COA entry is clicked
//works
  export async function fillBeforeAfterTables(rowId){
  
    //****************
    //IMPLEMENT
    //****************
    //need a table for before and after image
    const beforeTable = document.getElementById('EventLogBefore-table');
    const afterTable = document.getElementById('EventLogAfter-table');

    const account = document.getElementById('coa_table');
    const rows = account.querySelectorAll('tr');

    for(let i = 0; i < rows.length; i++){
      const row = rows[i];
      if(row.classList.contains('visible')){
          var accountDoc = row.id;
          break;
        }
      }
    
      const Doc = doc(db, "Chart_Of_Accounts", accountDoc);
      const docSnap = await getDoc(Doc);
      if (docSnap.exists){
  
      const data = docSnap.data();

      console.log("Doc Retrieved: " + data);
  

      const eventLog = data.EventLog;
      const beforeRange = eventLog[rowId].beforeImage;
      const afterRange =  eventLog[rowId].afterImage;
  
      const Ledger = data.Ledger;
  
      for(let i = 0; i <= beforeRange; i++){
        const newRow = document.createElement('tr');
        newRow.id = `${rowId}-eventBeforeLogImage`;
        newRow.className = 'caf'
        newRow.classList.add('visible');

      newRow.innerHTML = `
        <td class='caf'>${Ledger[i].dateAdded}</td>
        <td class='caf'>${Ledger[i].description}</td>
        <td class='caf'>${Ledger[i].debit}</td>
        <td class='caf'>${Ledger[i].credit}</td>
        <td class='caf'>${Ledger[i].balance}</td> `;

        beforeTable.append(newRow);
      }
  
  
      for(let i = 0; i <= afterRange; i++){
        const newRow = document.createElement('tr');
        newRow.id = `${rowId}-eventAfterLogImage`;
        newRow.className = 'caf'
        newRow.innerHTML = `
        <td class='caf'>${Ledger[i].dateAdded}</td>
        <td class='caf'>${Ledger[i].description}</td>
        <td class='caf'>${Ledger[i].debit}</td>
        <td class='caf'>${Ledger[i].credit}</td>
        <td class='caf'>${Ledger[i].balance}</td> `;

        afterTable.append(newRow);
      }
  
  
    }
  
  }
  
  export function selectEventLogBeforeAfter(tbodyId, rowId){
    const tableBody = document.getElementById(`${tbodyId}`);
  
    const rows = tableBody.querySelectorAll('tr');
  
    for(let i = 0; i < rows.length; i++){
      const row = rows[i];
  
      if (row.id !== rowId){
        //row.style.display = "none"
        row.classList.remove('visible');
        row.classList.add('hidden');
        setTimeout(() => { row.style.display = "none";}, 500);
      }
    }
  
    document.getElementById("EventLogImagesView").classList.remove("hidden");
    document.getElementById("EventLogImagesView").classList.add("visible");
  
  setTimeout(() => {
    document.getElementById("EventLogImagesView").style.display = "block";
  
    }, 500);
  
  }

export function deSelectBeforeAfter(tbodyId){
  const tableBody = document.getElementById(`${tbodyId}`);
  const rows = tableBody.querySelectorAll('tr');

  for(let i = 0; i < rows.length; i++){
    const row = rows[i];
    if(row.classList.contains('visible')){
      row.style.pointerEvents = "auto";
    }
    if (row.style.display === "none"){
      //row.style.display = "";
      row.classList.remove('hidden');
      row.classList.add('visible');
      setTimeout(() => { row.style.display = "";}, 500);
    }

  }
  
  document.getElementById("EventLogImagesView").classList.remove("visible");
  document.getElementById("EventLogImagesView").classList.add("hidden");

  setTimeout(() => { 
    document.getElementById("EventLogImagesView").style.display = "none";
  }, 500);


}



  //******************************************************************************************
  //      Journal Entry implementation JS
  //******************************************************************************************

//used for reports + bookkeeping html files
export async function fillJournal(rowId){

  const tableBody = document.getElementById('journal-table');

  const Doc = doc(db, "Chart_Of_Accounts", rowId);
  const docSnap = await getDoc(Doc);
  if (docSnap.exists){

    const data = docSnap.data();
    const journal = data.Journal;

    journal.forEach((entry, index) => {
      const debits = entry.Debits;
      let debitString = ``;
      debits.forEach((entry, index) => {
          debitString += `${entry}\n`;
        });

      const credits = entry.Credits;
      let creditString = ``;
      credits.forEach((entry, index) => {
          creditString += `${entry}\n`;
        });

      const newRow = document.createElement('tr');
      newRow.id = `${index}`;
      newRow.className = 'caf'
      newRow.classList.add('visible');
      newRow.innerHTML = `
        <td class='caf'>${entry.PostReference}</td>
        <td class='caf'>${entry.Date}</td>
        <td class='caf' style='width: 300px;'>${entry.Description}</td>
        <td class='caf'>${debitString}</td>
        <td class='caf'>${creditString}</td>
        <td class='caf'>${entry.Balance}</td>
        <td class='caf'>${entry.Comments}</td>
        `;

      //Status decides font color: (Pending: yellow: Accepted: Green, Denied: red)
      switch(entry.Status){
        case "Pending":
          newRow.innerHTML += `<td class='caf' style='color: orange;'>${entry.Status}</td>`; 
          console.log(entry.Status);
          break;
        case "Approved":
          newRow.innerHTML += `<td class='caf' style='color: green;'>${entry.Status}</td>`; 
          console.log(entry.Status);
          break;
        case "Denied":
          newRow.innerHTML += `<td class='caf' style='color: red;'>${entry.Status}</td>`; 
          console.log(entry.Status);
          break;
        default:
          console.log(entry.Status);
          newRow.innerHTML += `<td class='caf' style='color: red;'>Didn't work</td>`;
        break;
      }

      //action buttons only if user is manager/admin, else if accountant => action column = none


  onAuthStateChanged(auth, async (user) => {
    if(user){
          console.log("User found" + user.email);
      const Email = user.email;
      const userDoc = doc(db, "Users", Email);
      const userDocSnap = await getDoc(userDoc);
          console.log("Made it here" + userDocSnap);
      if (userDocSnap.exists){
        const UserData = userDocSnap.data();
          console.log("User Data: " + JSON.stringify(UserData));
        const accountType = UserData.accountType;
          console.log("Users accountType: " + accountType);

        if(accountType === "Admin" || accountType === "Manager"){
              if(entry.Status !== "Approved" && entry.Status !== "Denied"){ 
                    newRow.innerHTML += `
                          <td class='caf'>
                          <span style='display: flex'>
                          <button style="border-radius: 25px; background-color: green; margin-right: 10px;">Approve</button>
                          <button style="border-radius: 25px; background-color: red;">Deny</button>
                          </span>
                          </td>`;
              }else{
                    newRow.innerHTML += `<td class='caf'>Action already made</td>`;
              }
        }else{
          newRow.innerHTML += `<td class='caf'>Manager Needed</td>`;
        }
      }
    }
  });
      tableBody.append(newRow);
    });


  }
}



