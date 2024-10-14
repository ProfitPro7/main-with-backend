const { getFirestore, FieldValue} = require("firebase-admin/firestore");
const { admin } = require("firebase-admin");
const db = getFirestore();

const { onRequest } = require("firebase-functions/v2/https");


//*************************DESCRIPTION*******************************
//addAccountToCOA takes in parameters from the client needed to create an account in the COA
//it then verifies the parameters
//  - checks to see if the account name has already been taken
//  - checks to see if the account number has already been taken
//
//if all looks good, it adds an entry to the Chart_Of_Accounts collection in firestore
//
//due to the nature of async functions and promises in javascript, this API relies on two subsidiary functions: 
//  - checkForDupName => queries Chart_Of_Accounts for any duplicate names
//  - checkForAccountNumDuplicate =>  queries Chart_Of_Accounts for any accounts within the SAME CATEGORY that already have the requested new accounts number
//
//*************************DESCRIPTION*******************************
exports.addAccountToCOA = onRequest( { cors: [/profitpro-e81ab\.web\.app/]}, async(request, response) => {

  let message = "";
  //Getting params from client's API request 
  const {accountName, accountNum, accountDesc, normalSide, accountCategory, accountSubCategory, initialBalance, debit, credit, balance, dateAdded, userId, order, statement, comment} = request.query;
  
  //Ensures API does not add data to firestore from incomplete request
  const required = [ "accountName", "accountNum", "accountDesc", "normalSide", "accountCategory", "accountSubCategory", "initialBalance", "debit", "credit", "balance", "dateAdded", "userId", "order", "statement", "comment"];
  //searches through request query, and if any params are undefined, if yes: sends error
  const missing = required.find(field => request.query[field] == undefined);
  if (missing) {
    response.status(400).json({message: "Missing Params"});

  }else { //else continues on with verification

    //get Account Number
    const combined_num_order = parseInt(accountNum) + parseInt(order);
    const formatted_account_num = combined_num_order.toString();

    //get currentTime
    const currentTime = new Date().toLocaleTimeString("en-US", {timeZone: "America/New_York"});

    //checks for Dupe Name
    checkForDupName(accountName)
      .then((answer) => {
        if (answer === false){ //at this point the account name has been verified

          //checks for Dupe Number
          checkForAccountNumDuplicate(formatted_account_num, accountCategory)
            .then((answer) => {
              if (answer === false){ // at this point the account number has been verified
                try{
                  //now we have veriified all inputs and will add account the the chart of accounts
                  
                  const formatted_uid = formatted_account_num + "-" + accountCategory + "-" + accountName;
                  
                  
                  db.collection("Chart_Of_Accounts").doc(`${formatted_uid}`).set({

                    //Account Information set
                    accountCategory: `${accountCategory}`,
                    accountSubCategory: `${accountSubCategory}`,
                    accountName: `${accountName}`,
                    //accountNumber = account number param (100,200,300,...) + order param (01,02,03,...) = Ex: 100 + 01 = 101
                    accountNumber: `${formatted_account_num}`,
                    accountDesc: `${accountDesc}`,
                    userId: `${userId}`,
                    created: `${dateAdded}`,
                    statement: `${statement}`,
                    comment: `${comment}`,
                    normalSide: `${normalSide}`,

                    //Ledger created
                    Ledger: [
                      {
                        dateAdded: `${dateAdded}`,
                        description: "First Entry",
                        initialBalance: `${initialBalance}`,
                        balance: `${balance}`,
                        debit: `${debit}`,
                        credit: `${credit}`,
                      }
                    ],

                    //Event Log started
                    EventLog: [
                      {
                        eventId: `${dateAdded}-${accountCategory}-${accountName}-Created`,
                        description: "Account Created",
                        dateChanged: `${dateAdded}`,
                        timeChanged: `${currentTime}`,
                        typeOfChange:"Account Creation",
                        //Don't have to be initialized at firstCreation record => First imageBefore and after will be added upon first update call
                        //imageBefore: "TBI (to be implemented)",
                        //imageAfter:  "TBI (to be implemented)",
                        userId: `${userId}`
                      }
                    ]

                  });

                  response.status(200).json({message: "Account Created Successfully"});
                  console.log("account created");
                } catch (error) {
                  console.log("Broke at account creation");
                }

              } else {
                response.status(400).json({message: `${answer}`});
              }
            })
            .catch((e) => {
              console.log(`Failed at number verification.`);
              console.log(e);
            });



        } else {
          response.status(400).json({message: "Account Name is already taken"});
          throw new Error("Failed @ Name Verification");
        }
      })
      .catch((e) => {
        console.log("Failed at account name verification");
        console.log(e);
      });
  }
});



async function checkForDupName(accountName){
  //Checking to see if account name is already taken
  let dupeName = false;
  try{

    const checkForExistence = await db.collection("Chart_Of_Accounts").get()
    try{
      checkForExistence.forEach((doc) => {
        const regex = /^(?:[^-]*-){2}(.*)$/;
        console.log("DOCUMENT ID: " + doc.id);
        let docName = doc.id;
        let match = docName.match(regex);

        if (match && match[1] === accountName){
          dupeName =  true;
        }
      });

      return dupeName;

    } catch(e){
      console.log("Error at name matching phase");
    }
    //const checkForExistence = await db.collection("Chart_Of_Accounts").doc(`${accountName}`).get();
    //if (checkForExistence.exists){
    //  console.log("duplicate Account check");
    //  return true;
    //}else{
    //  return false;
    //}
  } catch(e){
    console.log(e);
    return "Error occurred getting collection of accountName";
  }
}



async function checkForAccountNumDuplicate(accountNum, accountCategory) {
  //Checking to see if account number is already taken
  const query = await db.collection("Chart_Of_Accounts").where("accountCategory", "==", `${accountCategory}`).where("accountNumber", "==", `${accountNum}`).get()
  if(query.empty){
    return false;
  } else {
    try{
      const largestOrderNumber =  await db.collection("Chart_Of_Accounts").where("accountCategory", "==", `${accountCategory}`).orderBy("accountNumber", "desc").limit(1).get()
      try{
        if (!largestOrderNumber.empty){
           
          let next_order = "";
          largestOrderNumber.forEach((doc) => { 
            console.log(doc.data().accountNumber);
            const largest_num = doc.data().accountNumber;
            console.log(largest_num);
            
             next_order = parseInt(largest_num) + 1;
          });
            return `Account Number already exists. Next Number available in the ${accountCategory} category is: ${next_order}`;
        }else{
          return "Ordered query is broken";
        }

      } catch(e) {
        return "Error getting largest num within account category";
      }
    }

    catch(error) {
      return `Error in check account num method \n${error}`;
    }
  }
}

//************************ End of createAccountForCOA API ************************************************


//What is needed
//**********DONE*********************
//  Server-side: 
//  - Create an Account for COA
//       - Duplicate account numbers or names should not be allowed;
//       - Verify Account Name and Number
//********************************
//       
//
//  - Modify an account
//     - Accounts with balance greater than zero cannot be deactivated;
//
//  - Add, modify, delete a record for an Account's Ledger
//     - All monetary values must be formatted using commas when appropriate;
//          - write to Event log
//          - keep record of ledger before change (image)
//          - keep record of ledger after change (image)





exports.modifyAccountInformation = onRequest({ cors: [/profitpro-e81ab\.web\.app/]}, async(request, response) => {

  //Getting params from client's API request 
  const {source, accountName, accountNum, accountDesc, normalSide, accountCategory, accountSubCategory,  order} = request.query;

  let update = {};

  const event = source + "-Account_Information_Updated"; 
  const currDate = new Date().toJSON().slice(0,10);
  let eventLog = {eventId: event, dateChanged: currDate};


  let eventLogChanges = {};
  let description = "";

  //get currentTime
  const currentTime = new Date().toLocaleTimeString("en-US", {timeZone: "America/New_York"});
  eventLog.timeChanged = currentTime;
  eventLog.typeOfChange = "Account Information Modified";

  //change later
  eventLog.userId = "JTonnesen-09-24";



  let accountId = "";


  const docRef = db.collection("Chart_Of_Accounts").doc(source).get()
  .then((doc) => {

    const data = doc.data();

    if(doc.exists){

      if(accountNum && order){
        const combined_num_order = parseInt(accountNum) + parseInt(order);
        const formatted_account_num = combined_num_order.toString();

        eventLogChanges.accountNumber = formatted_account_num;
        update.accountNumber = formatted_account_num;

        accountId += formatted_account_num +"-";

      }else{
        accountId += data.accountNumber +"-";
      }

      if(accountCategory){
        update.accountCategory = accountCategory;
        eventLogChanges.accountCategory = accountCategory;
        description += "Account Category, ";

        accountId += accountCategory + "-";
      }else{
        accountId += data.accountCategory + "-";

      }
      if (accountName){
        update.accountName = accountName;
        eventLogChanges.accountName = accountName;
        description += "Account Name, ";

        accountId += accountName;;

      }else{

        accountId += data.accountName;

      }

      if (accountDesc){
        update.accountDesc = accountDesc;
        eventLogChanges.accountDesc = accountDesc;
        description += "Account Description, ";
      }
      if (normalSide){
        update.normalSide = normalSide;
        eventLogChanges.normalSide = normalSide;
        description += "Account Normal Side, ";
      }
      if (accountSubCategory){
        update.accountSubCategory = accountSubCategory;
        eventLogChanges.accountSubCategory = accountSubCategory;
        description += "Account Sub-Category, ";
      }

      description += "Changed.";

      eventLog.changes = eventLogChanges;
      eventLog.description = description;


      //now modifying account
      if ([accountName, accountNum, accountCategory, accountSubCategory, order, accountDesc, normalSide].every(param => param === undefined || param === "")){
        response.status(400).json({message: "No information passed to update"});
      }else if ((accountNum && !order) || (!accountNum && order)){
        response.status(400).json({message: "Must specify BOTH Account Number and Order to change either"});
      }else{

        try{
          //creating copy with new document id because of changes
          db.collection("Chart_Of_Accounts").doc(`${accountId}`).set({

            //Account Information set
            accountCategory: `${data.accountCategory}`,
            accountSubCategory: `${data.accountSubCategory}`,
            accountName: `${data.accountName}`,
            //accountNumber = account number param (100,200,300,...) + order param (01,02,03,...) = Ex: 100 + 01 = 101
            accountNumber: `${data.accountNumber}`,
            accountDesc: `${data.accountDesc}`,
            userId: `${data.userId}`,
            created: `${data.dateAdded}`,
            statement: `${data.statement}`,
            comment: `${data.comment}`,
            normalSide: `${data.normalSide}`,

            //Ledger created
            Ledger: data.Ledger,

            //Event Log started
            EventLog: data.EventLog
          })
          .then(() => {

              try{
                //now filling in new document with changed data
                //
                db.collection("Chart_Of_Accounts").doc(`${accountId}`).update(update)
                  .then(() => {
                    console.log("OK");

                    try{

                      db.collection("Chart_Of_Accounts").doc(`${accountId}`).update({
                        EventLog: FieldValue.arrayUnion(eventLog)
                      })
                        .then(() => {
                          console.log(`${accountId} changed, with adding event log: ${eventLog}`);

                        })
                        .catch((e) => {
                          console.log(`${accountId} broke when adding event log: ${eventLog}`);
                        });

                    }catch(error){

                      console.log("Failed at adding Event to Event Log");
                      console.log(error);
                    }


                  })
                  .catch((e) => {
                    console.log(e);
                  });

              } catch(error){
                console.log("Failed at account modification: updating copy account phase");
              }

              try{

                deactivate(source)
                .then((result) => {
                  if(result){
                  console.log("Deleted" + source);

                }else{
                  console.log("Not Deleted" + source);
                }
                  }).catch((error) => {
                    console.log("Not Deleted" + source);

                  });
              

              }catch(error){
                console.log("Failed at account modification: deleting original account phase");

              }

              response.status(200).json({message: "Account Modified Successfully"});
              console.log(eventLog);
              console.log(update);
              console.log(description);




            });
        }
        catch(error){
          console.log("Failed at account modification: copying account phase");
        }


      }


    }
  })
  .catch((error) => {
    response.status(400).json({message: "Cannot find the Account you are looking to change."});
  });

});


//async function newAccountID(source, accountName = undefined, accountNumber = undefined, order = undefined, accountCategory = undefined){
//  String newId = "";
//
//  const docRef = db.collection("Chart_Of_Accounts").doc(source).get()
//  .then((doc) => {
//    if(doc.exists){
//      const data = doc.data();
//      //account Number
//      if(accountNumber !== undefined || order !== undefined ){
//        if (accountNumber !== undefined && order !== undefined ){
//          const combined_num_order = parseInt(accountNumber) + parseInt(order);
//          const formatted_account_num = combined_num_order.toString();
//
//          newId += formatted_account_num + "-";
//
//        }else {
//          return false;
//
//        }
//      }else{
//          newId += data.accountNumber + "-";
//
//      }
//
//      if(accountCategory !== undefined){
//        newId += accountCategory + "-";
//      }else{
//        newId += data.accountCategory + "-";
//
//      }
//
//      if(accountName !== undefined){
//        newId += accountName;
//      }else{
//        newId += data.accountName;
//
//      }
//
//      return newId;
//    }
//  })
//  .catch((error) => {
//    return "Error";
//  });
//}


  
    
    //  .then((answer) => {
    //    if (answer === false){ //at this point the account name has been verified
    //
    //      //checks for Dupe Number
    //      checkForAccountNumDuplicate(formatted_account_num, accountCategory)
    //        .then((answer) => {
    //          if (answer === false){ // at this point the account number has been verified
    //            try{
    //              //now we have veriified all inputs and will add account the the chart of accounts
    //
    //              const formatted_uid = formatted_account_num + "-" + accountCategory + "-" + accountName;
    //


//exports.modifyAccountLedger = onRequest( { cors: [/profitpro-e81ab\.web\.app/]}, async(request, response) => {
//});

exports.modifyAccountLedger = onRequest({ cors: [/profitpro-e81ab\.web\.app/]}, async(request, response) => {

  const {source, balance, credit, debit, dateAdded, description} = request.query;

  const newEntry = {balance: balance, credit: credit, dateAdded: dateAdded, debit: debit, description: description};

  const currDate = new Date().toJSON().slice(0,10);
  const currentTime = new Date().toLocaleTimeString("en-US", {timeZone: "America/New_York"});

  const eventLog= {
    changes: "Ledger Entry Added",
    dateChanged: currDate,
    description: `Ledger entry added by JTonnesen-09-24, on ${currDate}`,
    timeChanged: currentTime,
    typeOfChange: "Ledger Addition",
    userId: "JTonnesen-09-24"
  };


  try{

  db.collection("Chart_Of_Accounts").doc(`${source}`).update({
    EventLog: FieldValue.arrayUnion(eventLog),
    Ledger: FieldValue.arrayUnion(newEntry)
  })
    .then(() => {
      console.log(`Event Log and Ledger entries added`);
      response.status(200).json({message: "Ledger Entry Added."});

    })
    .catch((e) => {
      console.log(`Failed printing OH NOOOO`);
      response.status(400).json({message: "Ledger Entry Failed to Add"});
    });

}catch(error){

  console.log("Failed at adding Event Log and Ledger entries");
  console.log(error);
}

});



//exports.deactivateAccountCOA = onRequest({ cors: [/profitpro-e81ab\.web\.app/]}, async(request, response) => {
//
//  const {accountId} = request.query;
//
//  if(accountId === undefined || accountId === ""){
//    response.status(400).json({message: "No Account Id Passed"});
//
//  }else{
//
//    const docRef = await db.collection("Chart_Of_Accounts").doc(accountId).get();
//    if(docRef.exists){
//      const data = docRef.data();
//
//      const ledger = data.Ledger;
//
//      const latestEntry = ledger[ledger.length - 1];
//      console.log(latestEntry);
//      console.log(latestEntry.balance);
//
//      if (latestEntry.balance > 0){
//        return response.status(400).json({message: "Account Balance is greater than 0"});
//
//      }else{
//
//        try{
//          //const result = await deactivate(accountId);
//          response.status(200).json({message: "Account Deactivated"});
//
//        }catch(error){
//          response.status(400).json({message: "Account Could not be Deleted"});
//        }
//      }
//    }else{
//      response.status(400).json({message: "Doc doesn't exist"});
//    }
//
//  }
//
//});
//
//

exports.deactivateAccountCOA = onRequest({ cors: [/profitpro-e81ab\.web\.app/]}, async (request, response) => {

  const { accountId } = request.query;

  if (accountId === undefined || accountId === "") {
    return response.status(400).json({ message: "No Account Id Passed" });
  } 

  try {
    const docRef = await db.collection("Chart_Of_Accounts").doc(accountId).get();
    
    if (docRef.exists) {
      const data = docRef.data();
      const ledger = data.Ledger;
      const latestEntry = ledger[ledger.length - 1];
      
      console.log(latestEntry);
      console.log(latestEntry.balance);

      if (latestEntry.balance > 0) {
        // Return here to stop further execution
        return response.status(400).json({ message: "Account Balance is greater than 0" });
      } else {
        try {
          // Assuming you have some deactivate logic
          const result = await deactivate(accountId);
          return response.status(200).json({ message: "Account Deactivated" });
        } catch (error) {
          return response.status(400).json({ message: "Account Could not be Deleted" });
        }
      }
    } else {
      return response.status(400).json({ message: "Doc doesn't exist" });
    }
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});




async function deactivate(accountId){
  if(accountId === undefined || accountId === ""){
    return false;

  }else{
    db.collection("Chart_Of_Accounts").doc(`${accountId}`).delete().then(() => {
      return true;
    })
      .catch((error) => {
        return false;
      });
  }

}





