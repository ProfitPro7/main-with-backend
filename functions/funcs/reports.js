
const { getFirestore, FieldValue} = require("firebase-admin/firestore");
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
    PostReference: PostReference
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



