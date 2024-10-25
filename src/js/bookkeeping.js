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

  document.getElementById("search").classList.remove("visible");
  document.getElementById("search").classList.add("hidden");

  setTimeout(() => {
    document.getElementById("ledgerView").style.display = "block";
    document.getElementById("search").style.display = "none";
    document.getElementById("EventLogView").style.display = "block";
    document.getElementById("button-list-div").style.display = "block";
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

  document.getElementById("search").classList.remove("hidden");
  document.getElementById("search").classList.add("visible");

  setTimeout(() => { 
    document.getElementById("ledgerView").style.display = "none";
    document.getElementById("search").style.display = "block";
    document.getElementById("EventLogView").style.display = "none";
    document.getElementById("button-list-div").style.display = "none";
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
      newRow.id = `${rowId}-eventLog`;
      newRow.className = 'caf'
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


  //******************************************************************************************
  //      Event Log before and After images implementation
  //******************************************************************************************


  //
  //export async function eventLogBeforeAndAfter(rowId){
  //
  //  //****************
  //  //IMPLEMENT
  //  //****************
  //  //need a table for before and after image
  //  const beforeTable = document.getElementById('');
  //  const afterTable = document.getElementById('');
  //
  //  const Doc = doc(db, "Chart_Of_Accounts", rowId);
  //  const docSnap = await getDoc(Doc);
  //  if (docSnap.exists){
  //
  //    const data = docSnap.data();
  //
  //    const beforeRange = data.EventLog.beforeImage;
  //    const afterRange = data.EventLog.afterImage;
  //
  //    const eventLog = data.EventLog;
  //
  //    for(let i = 0; i < beforeRange; i++){
  //      const newRow = document.createElement('tr');
  //      newRow.id = `${rowId}-eventLogImage`;
  //      newRow.className = 'caf'
  //      newRow.innerHTML = `
  //        <td class='caf'>${eventLog[i].eventId}</td>
  //        <td class='caf'>${eventLog[i].typeOfChange}</td>
  //        <td class='caf' style='width: 300px;'>${eventLog[i].description}</td>
  //        <td class='caf'>${eventLog[i].dateChanged}</td>
  //        <td class='caf'>${eventLog[i].timeChanged}</td>
  //        <td class='caf'>${eventLog[i].userId}</td>`;
  //      beforeTable.append(newRow);
  //    });
  //
  //
  //    for(let i = 0; i < afterRange; i++){
  //      const newRow = document.createElement('tr');
  //      newRow.id = `${rowId}-eventLogImage`;
  //      newRow.className = 'caf'
  //      newRow.innerHTML = `
  //        <td class='caf'>${eventLog[i].eventId}</td>
  //        <td class='caf'>${eventLog[i].typeOfChange}</td>
  //        <td class='caf' style='width: 300px;'>${eventLog[i].description}</td>
  //        <td class='caf'>${eventLog[i].dateChanged}</td>
  //        <td class='caf'>${eventLog[i].timeChanged}</td>
  //        <td class='caf'>${eventLog[i].userId}</td>`;
  //      afterTable.append(newRow);
  //    });
  //
  //
  //  }
  //
  //}
  //
  //
  ////used for reports.html
  //export function selectEventLogBeforeAfter(tbodyId, rowId){
  //  const tableBody = document.getElementById(`${tbodyId}`);
  //
  //  const rows = tableBody.querySelectorAll('tr');
  //
  //  for(let i = 0; i < rows.length; i++){
  //    const row = rows[i];
  //
  //    if (row.id !== rowId){
  //      //row.style.display = "none"
  //      row.classList.remove('visible');
  //      row.classList.add('hidden');
  //      setTimeout(() => { row.style.display = "none";}, 500);
  //    }
  //  }
  //  //document.getElementById("ledgerView").style.display = "block";
  //  document.getElementById("ledgerView").classList.remove("hidden");
  //  document.getElementById("ledgerView").classList.add("visible");
  //
  //  document.getElementById("EventLogView").classList.remove("hidden");
  //  document.getElementById("EventLogView").classList.add("visible");
  //
  //
  //  document.getElementById("button-list-div").classList.remove("hidden");
  //  document.getElementById("button-list-div").classList.add("visible");
  //
  //  document.getElementById("search").classList.remove("visible");
  //  document.getElementById("search").classList.add("hidden");
  //
  //  setTimeout(() => {
  //    document.getElementById("ledgerView").style.display = "block";
  //    document.getElementById("search").style.display = "none";
  //    document.getElementById("EventLogView").style.display = "block";
  //    document.getElementById("button-list-div").style.display = "block";
  //    document.getElementById('coa_title').innerHTML = `Account: ${rowId}`;
  //
  //  }, 500);
  //
  //}

}
