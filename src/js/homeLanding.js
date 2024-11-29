import { auth, db } from ".//firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";





//####### Net Profit Margin = (Net Income / Reveneue) x 100 ############

//Params: 
// 1. Net Income =  Total Revenue - Total Expenses
// 2. Revenue = total income generated from sales before any expenses are deducted

//Strategy
//1. Find params: 
//  a. find revenue = look through COA for all accounts containing the word "income" or "revenue" and total balances
//  b. find Net Income = look for all expense accounts (from the expense category) 
//2. Calculate using the formula

//Thresholds
//Bad: ratio < 5%
//Medium: 5% < ratio < 10%
//Good: 10% < ratio

//####### Net Profit Margin ############






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

//########## Current Ratio ##########








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

//############ Asset Turnover Ratio #############





//############ Debt to Equity Ratio = Total Debt / Total Equity ############

//Params

//Strategy

//Thresholds

//############ Debt to Equity Ratio ############
