const { getFirestore } = require("firebase-admin/firestore");
const { admin } = require("firebase-admin");
const db = getFirestore();

const { onRequest } = require("firebase-functions/v2/https");


exports.addAccountToCOA = onRequest(/*{ cors: [/url_here/]},*/ async(request, response) => {

  let message = "";
  //Getting params from client's API request 
  const {accountName, accountNum, accountDesc, normalSide, accountCategory, accountSubCategory, initialBalance, debit, credit, balance, dateAdded, userId, order, statement, comment} = request.query;
  
  //Ensures API does not add data to firestore from incomplete request
  const required = [ "accountName", "accountNum"/*, "accountDesc", "normalSide"*/, "accountCategory"/*, "accountSubCategory", "initialBalance", "debit", "credit", "balance", "dateAdded", "userId"*/, "order"/*, "statement", "comment"*/];
  //searches through request query, and if any params are undefined, if yes: sends error
  const missing = required.find(field => request.query[field] == undefined);
  if (missing) {
    response.status(400).json({message: "Missing Params"});

  }else { //else continues on with verification

    //get Account Number
    const combined_num_order = parseInt(accountNum) + parseInt(order);
    const formatted_account_num = combined_num_order.toString();

    //get currentTime
    const currentTime = new Date().toLocaleTimeString();

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
                  db.collection("Chart_Of_Accounts").doc(`${accountName}`).set({

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

                    //Ledger created
                    Ledger: {
                      balance: `${balance}`,
                      normalSide: `${normalSide}`,
                      firstEntry: {
                        dateAdded: `${dateAdded}`,
                        initialBalance: `${initialBalance}`,
                        debit: `${debit}`,
                        credit: `${credit}`,
                      }
                    },

                    //Event Log started
                    EventLog: {
                      initializationRecord: {
                        dateChanged: `${dateAdded}`,
                        timeChanged: `${currentTime}`,
                        typeOfChange:"Account Creation",
                        imageBefore: "TBI (to be implemented)",
                        imageAfter:  "TBI (to be implemented)",
                        userId: `${userId}`
                      }

                    }

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
  try{
    const checkForExistence = await db.collection("Chart_Of_Accounts").doc(`${accountName}`).get();
    if (checkForExistence.exists){
      console.log("duplicate Account check");
      return true;
    }else{
      return false;
    }
  } catch(e){
    console.log(e);
    return "Error occurred";
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


//What is needed
//
//  Server-side:
//  - Create an Account for COA
//       - Duplicate account numbers or names should not be allowed;
//
//  - Modify an account
//     - Accounts with balance greater than zero cannot be deactivated;
//
//  - Add, modify, delete a record for an Account's Ledger
//     - All monetary values must be formatted using commas when appropriate;
//          - write to Event log
//          - keep record of ledger before change (image)
//          - keep record of ledger after change (image)
//
//
//
//  Client-side:
//  - All monetary values must be formatted using commas when appropriate;
//        - Use monetaryValidation.js method
// - All monetary values should have two decimal spaces;
// - Account numbers should not allow decimal spaces or alphanumeric values;
// - If admin user, Administrator tab pops up 
