
const { getFirestore, FieldValue, doc, getDoc} = require("firebase-admin/firestore");
const { admin } = require("firebase-admin");
const db = getFirestore();

const { onRequest } = require("firebase-functions/v2/https");


//*************************DESCRIPTION************************************
//API's for jounral entries 
//   - Journal entry creation
//      - file upload to realtime database if it exists
//          - file upload might be handled on client side 
//      - create journal entry with "pending" status
//
//  - Entry approval API 
//      - sets status to approved
//      - creates entry in ledger
//      - creates entry in event log
//
//  - Entry denied API 
//    - sets status to denied
//*************************DESCRIPTION************************************


exports.createJournalEntry = onRequest( { cors: [/profitpro-e81ab\.web\.app/]}, async(request, response) => {

  let message = "";

  const {source, Date, Description, Credits, Comments, Debits, Balance, Status, PostReference} = request.query;


  const debitEntriesArray = Debits.split(",");
  const creditEntriesArray = Debits.split(",");


  const journalEntry = {
    Date: Date,
    Description: Description,
    Debits: debitEntriesArray,
    Credits: creditEntriesArray,
    Balance: Balance,
    Comments: Comments, 
    Status: Status,
  };

  try{
    try{
    db.collection("Chart_Of_Accounts").doc(`${source}`).update({
      Journal: FieldValue.arrayUnion(journalEntry)
      });
    }catch(e){
      console.log("failed to add to journal");
      response.status(400).json({message: "Failed at journal entry "});
    }

    try{
    db.collection("mail").add({
      to: `appdomain.profitpro@gmail.com `,
      message: {
        subject: `Journal Entry made for ${source}`,
        text: "Sent journal entry notification",
        html: `<p>A journal entry has been created for ${source} on ${Date}</p>`
      },

    });
    }catch(e){
      console.log("failed to send notification to manager");
      response.status(400).json({message: "Failed at email"});

    }

    response.status(200).json({message: "Journal Entry Added"});


  }catch(e){
    console.log("failed to add");
    response.status(400).json({message: "Journal Entry failed to Add", error: e});
  }



});





exports.approveJournalEntry = onRequest( { cors: [/profitpro-e81ab\.web\.app/]}, async(request, res) => {

  let message = "";

  const {account, JEindex} = request.query;

  console.log(account + ", " + JEindex);

  try{
    const docRef = db.collection("Chart_Of_Accounts").doc(`${account}`);
    const docSnap = await docRef.get();

    const data = docSnap.data();

    const currDate = new Date().toJSON().slice(0,10);
    const currentTime = new Date().toLocaleTimeString("en-US", {timeZone: "America/New_York"});

    const journal = data.Journal; // replace with your array field name
    const eventLog = data.EventLog;

    let credits = "";
    for(let i = 0; i < journal[JEindex].Credits.length; i++){
      credits += journal[JEindex].Credits[i] + ", ";
    }

    let debits = "";
    for(let i = 0; i < journal[JEindex].Debits.length; i++){
      debits += journal[JEindex].Debits[i] + ", ";
    }

    const eventLogSize =  eventLog.length; 

    const newEvent = {
      beforeImage: `${eventLogSize - 1}`,
      afterImage: `${eventLogSize}`,
      eventId: `Journal Entry-${currDate}`,
      changes: `Journal entry added by JTonnesen-09-24`,
      dateChanged: `${currDate}`,
      description: `${journal[JEindex].Description}`,
      timeChanged: `${currentTime}`,
      typeOfChange: `Journal Entry`,
      userId: `JTonnesen-09-24`
    };

    const newLedger = {
      postReference: `${JEindex}`,
      balance: `${journal[JEindex].Balance}`,
      credit: `${credits}`,
      dateAdded: `${journal[JEindex].Date}`,
      debit: `${debits}`,
      description: `${journal[JEindex].Description}`
    };

    await docRef.update({
      EventLog: FieldValue.arrayUnion(newEvent),
      Ledger: FieldValue.arrayUnion(newLedger)
    });


    journal[JEindex].Status = "Approved"; // Update the field

    await docRef.set({ Journal: journal }, { merge: true });

    res.status(200).json({message: 'Journal Entry Approved'});

  }catch(e){
    console.log(e);
    res.status(400).json({message: 'Failed'});
  }

});


exports.denyJournalEntry = onRequest( { cors: [/profitpro-e81ab\.web\.app/]}, async(request, res) => {

  let message = "";

  const {account, JEindex} = request.query;

  console.log(account + ", " + JEindex);

  try {
    // Step 1: Retrieve the document

      const docRef = db.collection("Chart_Of_Accounts").doc(`${account}`);

      const docSnap = await docRef.get();

    if (!docSnap.exists) {
      res.status(400).json({message: 'no doc'});
    }

    const data = docSnap.data();
    console.log(data);
    const yourArray = data.Journal; // replace with your array field name
    console.log(yourArray);

    // Step 2: Modify the array
    if (yourArray && yourArray[JEindex]) {
      yourArray[JEindex].Status = "Denied"; // Update the field
      console.log(yourArray[JEindex].Status);
    } else {
      res.status(400).json({message: 'index bork'});
    }

    // Step 3: Write the updated array back
    await docRef.set({ Journal: yourArray }, { merge: true });

      res.status(200).json({message: 'Status Changed'});
  } catch (error) {
    console.error('Error updating document:', error);
      res.status(400).json({message: 'Error uploading'});
  }
  //try{
  //  const doc = await db.collection("").doc(`${account}`).update({
  //    Journal.
  //  });


      //.get();


    //const data = doc.data(); 
    //
    //const journalEntry = data.Journal[`${JEindex}`];
    //
    //journalEntry.update({
    //  Status: "Denied"
    //});
    //
  //}catch(e){
  //  console.log(e);
  //  response.status(400).json({message: "Failed at Journal Entry Denial"});
  //
  //}

});


