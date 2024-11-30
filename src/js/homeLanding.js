import { auth, db } from ".//firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { assign } from "lodash";


//                          Description
//                        +++++++++++++++

//####### Net Profit Margin = (Net Income / Reveneue) x 100 ############

//Params: 
// 1. Net Income =  Total Revenue - Total Expenses
// 2. Revenue = total income generated from sales before any expenses are deducted

//Strategy
//1. Find params: 
//  a. find revenue = look through COA for all accounts containing the word "income" or "revenue" and total balances
//  b. find Net Income =  Revenue - (look for all expense accounts (from the expense category))
//2. Calculate using the formula

//Thresholds
//Bad: ratio < 5%
//Medium: 5% < ratio < 10%
//Good: 10% < ratio

//########## Current Ratio = (Current Assets / Current Liabilities) x 100 ##########

//Params; 
//  1. Current Assets = sum of all accounts with cateogry (Assets)
//  2. Current Liabilities = sum of all accounts with category liability 

//Strategy 
//1. find params
//2. calculate formula


//Thresholds
//Bad: ratio < 1.0
//Medium: 1.0 < ratio < 1.5
//Good: 1.5 < ratio < 2.0
//Great: 2.0 < ratio


//############ Asset Turnover Ratio = Revenue / Average Total Assets #############

//Params
//1. Revenue = sum of all accounts in revenue category 
//2. Assets = sum of all accountsi in assets category 

//Strategy
//1. Find average
//  a. if asset values for beginning or end of the period, find average
//  b. otherwise, use total assets 

//Thresholds
//Bad: ratio < 0.5
//Medium: 0.5 < ratio < 1.0 
//Good:  1.0 < ratio

//############ Debt to Equity Ratio = Total Debt / Total Equity ############

//Params
//1. Total Debt = Short-term Debt + Long-term Debt 
//2. Total Equity = sum of all accounts in Equity category

//Strategy
//1. use the equation

//Thresholds
//Bad: ratio < 1.0
//Medium: 1.0 < ratio < 2.0 
//Good: 2.0 < ratio

//############ Debt to Equity Ratio ############








//##################################  METHOD EXPLANATION ########################################
//Will return [Array containing ratios in specific order ]
//      
//      [Net Profit Margin, Current Ratio, Asset Turnover Ratio, Debt-to-Equity Ratio]
//
//
//Dependencies: 
//  For debts to be counted in equation, liability account must have "Debt" subcategory
//
//
//##################################  METHOD EXPLANATION ########################################


export async function calculateRatios() {

  //Chart of Accounts: Balance totals by category
  let revenues = 0;
  let expenses = 0;
  let assets = 0;
  let liabilities = 0;
  let equity = 0;
  let debt = 0;



  //used for average Assets
  let assetCount = 0;
  //Sorting chart of accounts for all accounts needed
  try {
    const querySnapshot = await getDocs(collection(db, "Chart_Of_Accounts"));
    querySnapshot.forEach((doc) => {
      //setting vars from Doc
      let data = doc.data();
      let totalBalance = 0;

      let ledger = data.Ledger;

      //getting total Balance for account
      for (let i = 0; i < ledger.length; i++) {
        //converting from formatted String (Ex: data stroed as "10,000.00") to float to add to totalBalance
        let balance = ledger[i].balance;
        let cleanedBalance = balance.replace(/,/g, '');
        let convertToFloat = parseFloat(cleanedBalance);

        totalBalance += convertToFloat;
      }

      //diffirentiate debt from subcategory from Liabilities
      if (data.accountCategory == "Liability" && data.accountSubCategory == "Debt") {
        debt += totalBalance;
      }


      //add totalBalance of account to correct category value
      switch (data.accountCategory) {
        case "Revenue":
          revenues += totalBalance;
          break;
        case "Expense":
          expenses += totalBalance;
          break;
        case "Asset":
          assets += totalBalance;
          assetCount++;
          break;
        case "Liability":
          liabilities += totalBalance;
          break;
        case "Equity":
          equity += totalBalance;
          break;
        default:
          break;
      }

    });

  } catch (e) {
    console.log("database fail");
    console.log(e);
  }

  //at this point all values are ready to be plugged into formulas

  //####### Net Profit Margin = (Net Income / Reveneue) x 100 ############
  // 1. Net Income =  Total Revenue - Total Expenses
  // 2. Revenue = total income generated from sales before any expenses are deducted
  let netIncome = revenues - expenses;
  let NetProfitMargin = (netIncome / revenues) * 100;

  //########## Current Ratio = (Current Assets / Current Liabilities) x 100 ##########

  let currentRatio = assets / liabilities;


  //############ Asset Turnover Ratio = Revenue / Average Total Assets #############

  let averageAssets = assets / assetCount;
  let assetTurnoverRatio = revenues / averageAssets;

  //############ Debt to Equity Ratio = Total Debt / Total Equity ############
  let debtToEquity = debt / equity;


  return [NetProfitMargin, currentRatio, assetTurnoverRatio, debtToEquity];

}
