import { auth, db } from ".//firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";


export function JournalFormHandler(formId){
  const form = document.getElementById(formId);

  form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const input = new FormData(event.target);
    const queryParams = new URLSearchParams(input).toString();
    const url = `${event.target.action}?${queryParams}`;

    try {
      const API_response = await fetch(url, {
        method: "GET"
      });

      if (API_response.status === 200) {
        showEmailPopup();
      }
    } catch (e) {
      console.log(e);
    }

  });

}


export async function generateStatement() {
  //Input from User
  const statementType = document.getElementById('statement-type').value;
  const start = document.getElementById('start-date').value;
  const end = document.getElementById('end-date').value;

  //div to populate
  const outputDiv = document.getElementById('statement-content');

  outputDiv.innerHTML = "";
  
  //populating title of statement
  let title = document.getElementById("statement-title").innerHTML = `${formatTitle(statementType)}`;

  //populating date range of statement
  let dateRange = document.getElementById("dateWindow");
  if(start && end){
    dateRange.innerHTML = `${start} thru ${end}` ;

  }else if(start && !end){
    dateRange.innerHTML = `Since ${start}` ;

  }else if(!start && end){
    dateRange.innerHTML = `Until ${end}` ;

  }else if(!start && !end){
    dateRange.innerHTML = `` ;
  }


  //getting docs from Chart of Accounts
  let COAdocs = [];
  try{

    let sDate = start ? start : "2000-01-01";
    let eDate = end ? end : "2900-01-01";

    const querySnapshot = await getDocs(collection(db, "Chart_Of_Accounts"));
    querySnapshot.forEach((doc) => {
      let date = doc.data().created;
      if (date >= sDate && date <= eDate){
        COAdocs.push(doc);
      }

    });
  }catch(e){
    console.log("database fail");
  }


  //###################################################
  //Begin of differentiation between statements
  //###################################################
  //variables commonly used: 
  //    COAdocs = array with all accounts in COA

  try {
    switch(statementType){


      case "trial-balance":

        //creating trial balancestatement
        //
        let trialBalance = document.createElement('table');
        //header and table 
        trialBalance.innerHTML = `
              <thead>
                  <tr>
                      <th>Account</th>
                      <th>Account #</th>
                      <th>Debit Amount</th>
                      <th>Credit Amount</th>
                  </tr>
              </thead>
          `;


        let body = document.createElement('tbody');


        let debitTotal = 0;
        let creditTotal = 0;

        for(let i = 0; i < COAdocs.length; i++){

          let data = COAdocs[i].data();
          let ledger = data.Ledger;

          let balance = 0;
          
          //finding balance 
          if(data.normalSide == "Debit"){
            for(let i = 0; i < ledger.length; i++){
              let debit = ledger[i].debit;
              let cleanedDebit = debit.replace(/,/g, '');
              let floatDebit = parseFloat(cleanedDebit);

              balance += floatDebit;


            }

            debitTotal += balance;

              let validated = formatMoney(balance);

              let stringBalance = `$${validated}`;

              let row = document.createElement('tr');
              row.innerHTML = `

                        <td>${data.accountName}</td>
                        <td>${data.accountNumber}</td> 
                        <td>${stringBalance}</td>
                        <td></td>
                        `;
            body.append(row);


          }else if(data.normalSide == "Credit"){
            for(let i = 0; i < ledger.length; i++){
              let credit = ledger[i].credit;
              let cleanedCredit = credit.replace(/,/g, '');
              let floatCredit = parseFloat(cleanedCredit);


              balance += floatCredit;

            }

            creditTotal += balance;

              let validated = formatMoney(balance);

              let stringBalance = `$${validated}`;

              let row = document.createElement('tr');
              row.innerHTML = `
                        <td>${data.accountName}</td>
                        <td>${data.accountNumber}</td> 
                        <td></td> 
                        <td>${stringBalance}</td> 
                        `;
            body.append(row);


          }


        }

        let validatedCreditTotal = formatMoney(creditTotal);
        let validatedDebitTotal = formatMoney(debitTotal);

        let stringCredTotal = `$${validatedCreditTotal}`;
        let stringDebTotal = `$${validatedDebitTotal}`;



        let totalRow = document.createElement('tr');
        totalRow.innerHTML = `
              <td></td>
              <td><strong>Totals</strong></td>
              <td style='font-weight: bold;'>${stringDebTotal}</td>
              <td style='font-weight: bold;'>${stringCredTotal}</td> `;

        body.append(totalRow);

        trialBalance.append(body);

        outputDiv.append(trialBalance);
      
        console.log(COAdocs);

        break;
      case "income-statement":

        let income = document.createElement('div');
        //header and table 
        income.innerHTML = `
<body style="font-family: Arial, sans-serif; background-color: white; color: black; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: auto; padding: 20px; background-color: white;">

    <!--Revenue Divs-->
    <div id = 'RevenueTotal' style=" font-weight: bold; display: flex; justify-content: space-between; margin: 5px 0;">
      <span style='text-decoration: underline;'>Total Revenue</span>
    </div>

    <!--Income divs-->
    <div style="font-weight: bold; text-decoration: underline; margin: 10px 0;">Income</div>
    <div id='IS-income'>
    </div>

    <hr style="border: none; border-top: 1px solid black; margin: 10px 0;">

    <!--Expenses div-->
    <div style="font-weight: bold; text-decoration: underline; margin: 10px 0;">Expenses</div>
    <div id='expenseDiv'>
    </div>

    <!--Div that needs to be created dynamically-->
    <!--<div style="display: flex; justify-content: space-between; margin: 5px 0;">-->
    <!--  <span>Interest expense</span>-->
    <!--  <span>$ 20,000</span>-->
    <!--</div>-->

    <hr style="border: none; border-top: 1px solid black; margin: 10px 0;">

    <div id='pre-income' style="display: flex; justify-content: space-between; font-weight: bold; margin: 5px 0;">
      <span>Net earnings before taxes</span>
    </div>

    <div id='income-tax' style="display: flex; justify-content: space-between; margin: 5px 0;">
      <span>Income tax expense</span>
    </div>

    <div id='net-income' style="display: flex; justify-content: space-between; font-weight: bold; margin: 5px 0;">
      <span>Net income</span>
    </div>
  </div>
</body>

`;

        outputDiv.append(income);


        //########################
        //Iterating through COAdocs
        //########################



        let totalRev = 0;
        let totalExpense = 0;

        for (let i = 0; i < COAdocs.length; i++){
          let data = COAdocs[i].data();
          let ledger = data.Ledger;
          let balance = 0;

          if (data.accountCategory == "Revenue"){
            for(let i = 0; i < ledger.length; i++){
              let credit = ledger[i].credit;
              let cleanedCredit = credit.replace(/,/g, '');
              let floatCredit = parseFloat(cleanedCredit);
              balance += floatCredit;
            }

            totalRev += balance;

            let validated = formatMoney(balance);

            let stringBalance = `$${validated}`;
            
            let newDiv = document.createElement('div');

            newDiv.innerHTML = `
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>${data.accountName}</span>
                <span>${stringBalance}</span>
              </div>

            `;

            document.getElementById("IS-income").append(newDiv);



          }else if (data.accountCategory == "Expense"){

            for(let i = 0; i < ledger.length; i++){
              let debit = ledger[i].debit;
              let cleanedDebit = debit.replace(/,/g, '');
              let floatDebit = parseFloat(cleanedDebit);
              balance += floatDebit;
            }

            totalExpense += balance;

            let validated = formatMoney(balance);

            let stringBalance = `$${validated}`;

            let newDiv = document.createElement('div');

            newDiv.innerHTML = `
                    <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                      <span>${data.accountName}</span>
                      <span>${stringBalance}</span>
                    </div>

                    `;

            document.getElementById("expenseDiv").append(newDiv);

          }

          }

        //Revenue total being added 
        let validatedRev = formatMoney(totalRev);
        let stringRev = `$${validatedRev}`;
        let totalRevSpan = document.createElement('span');
        totalRevSpan.innerHTML = `${stringRev}`;
        document.getElementById("RevenueTotal").append(totalRevSpan);


        //Calculating totals at end
        const netIncomeBeforeTaxes = totalRev - totalExpense;
        const GA_companyIncomeTax = netIncomeBeforeTaxes * 0.0575;
        const netIncomeAfterTaxes = netIncomeBeforeTaxes - GA_companyIncomeTax;



        //income before tax
        let validatedPreIncome = formatMoney(netIncomeBeforeTaxes);
        let stringPreIncome = `$${validatedPreIncome}`;
        let preIncomeSpan = document.createElement('span');
        preIncomeSpan.innerHTML = `${stringPreIncome}`;
        document.getElementById("pre-income").append(preIncomeSpan);


        //tax
        let validatedTax = formatMoney(GA_companyIncomeTax);
        let stringTax = `$${validatedTax}`;
        let taxSpan = document.createElement('span');
        taxSpan.innerHTML = `${stringTax}`;
        document.getElementById("income-tax").append(taxSpan);

        //net income after tax
        let validatedPostIncome = formatMoney(netIncomeAfterTaxes);
        let stringPostIncome = `$${validatedPostIncome}`;
        let postIncomeSpan = document.createElement('span');
        postIncomeSpan.innerHTML = `${stringPostIncome}`;
        document.getElementById("net-income").append(postIncomeSpan);

        break;
      case "balance-sheet":

        let balance = document.createElement('div');
        //header and table 
        balance.innerHTML = `
<body style="font-family: Arial, sans-serif; color: black; background-color: white; margin: 20px;">


    <div style="display: flex; justify-content: center; gap: 50px;">
        <!-- Left Column: Assets -->
        <div id='assets' style="width: 50%;">
            <h3 style="text-decoration: underline;">ASSETS</h3>
            <h4>Current Assets</h4>
            <div id='current-assets'>
                  <!--assets accounts dynamically populated here -->
            </div>

            <div id='total-assets' style="display: flex; justify-content: space-between; font-weight: bold; margin: 5px 0;">
              <span>Total Assets</span>
            </div>
        </div>

        <!-- Right Column: Liabilities and Shareholders' Equity -->
        <div style="width: 50%;">
            <h3 style="text-decoration: underline;">LIABILITIES AND SHAREHOLDERS' EQUITY</h3>
            <h4>Current Liabilities</h4>
            <div id='liabilities'>
                  <!--liabilitiy accounts dynamically populated here -->
            </div>

            <div id="net-liabilites" style="display: flex; justify-content: space-between; font-weight: bold; margin: 5px 0;">
              <span>Total Liabilities</span>
            </div>

            <hr style="border: none; border-top: 1px solid black; margin: 10px 0;">

            <h4>Current Shareholder's Equity</h4>
            <div id='equity'>
                  <!--equity accounts dynamically populated here -->
            </div>

            <div id="net-liabilities-and-equity" style="display: flex; justify-content: space-between; font-weight: bold; margin: 5px 0;">
              <span>Total Liabilities and Shareholder's Equity</span>
            </div>

        </div>
    </div>

</body> `;

        outputDiv.append(balance);


        //#####################
        //iterating through COA
        //#####################

        let totalAssets = 0;
        let totalLiability = 0;
        let totalEquity = 0;

        for (let i = 0; i < COAdocs.length; i++){
          let data = COAdocs[i].data();
          let ledger = data.Ledger;
          let balance = 0;

          if (data.accountCategory == "Asset"){
            for(let i = 0; i < ledger.length; i++){
              let debit = ledger[i].debit;
              let cleanedDebit = debit.replace(/,/g, '');
              let floatDebit = parseFloat(cleanedDebit);
              balance += floatDebit;
            }

            totalAssets += balance;

            let validated = formatMoney(balance);

            let stringBalance = `$${validated}`;
            
            let newDiv = document.createElement('div');

            newDiv.innerHTML = `
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>${data.accountName}</span>
                <span>${stringBalance}</span>
              </div>

            `;

            document.getElementById("current-assets").append(newDiv);
          } else if (data.accountCategory == "Liability"){

            for(let i = 0; i < ledger.length; i++){
              let credit = ledger[i].credit;
              let cleanedCredit = credit.replace(/,/g, '');
              let floatCredit = parseFloat(cleanedCredit);
              balance += floatCredit;
            }

            totalLiability += balance;

            let validated = formatMoney(balance);

            let stringBalance = `$${validated}`;
            
            let newDiv = document.createElement('div');

            newDiv.innerHTML = `
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>${data.accountName}</span>
                <span>${stringBalance}</span>
              </div>

            `;

            document.getElementById("liabilities").append(newDiv);

          } else if (data.accountCategory == "Equity"){
            for(let i = 0; i < ledger.length; i++){
              let credit = ledger[i].credit;
              let cleanedCredit = credit.replace(/,/g, '');
              let floatCredit = parseFloat(cleanedCredit);
              balance += floatCredit;
            }

            totalEquity += balance;

            let validated = formatMoney(balance);

            let stringBalance = `$${validated}`;
            
            let newDiv = document.createElement('div');

            newDiv.innerHTML = `
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>${data.accountName}</span>
                <span>${stringBalance}</span>
              </div>

            `;

            document.getElementById("equity").append(newDiv);

          }
        }

        //Apologies for all the redundant code, in a time crunch;

        let validatedAsset = formatMoney(totalAssets);
        let stringAsset = `$${validatedAsset}`;
        let totalAssetSpan = document.createElement('span');
        totalAssetSpan.innerHTML = `${stringAsset}`;
        document.getElementById("total-assets").append(totalAssetSpan);


        let totalLiabilityAndEquity = totalLiability + totalEquity;


        let validatedLiability = formatMoney(totalLiability);
        let stringLiability = `$${validatedLiability}`;
        let totalLiabilitySpan = document.createElement('span');
        totalLiabilitySpan.innerHTML = `${stringLiability}`;
        document.getElementById("net-liabilites").append(totalLiabilitySpan);

        let validatedEquity = formatMoney(totalLiabilityAndEquity);
        let stringEquity = `$${validatedEquity}`;
        let totalEquitySpan = document.createElement('span');
        totalEquitySpan.innerHTML = `${stringEquity}`;
        document.getElementById("net-liabilities-and-equity").append(totalEquitySpan);

        break;

      case "retained-earnings":

        let earnings = document.createElement('div');
        earnings.innerHTML = `
<body style="font-family: Arial, sans-serif; background-color: white; color: black; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: auto; padding: 20px; background-color: white;">

    <!--Revenue Divs-->
    <div id = 'beginning-retainedEarnings' style=" font-weight: bold; display: flex; justify-content: space-between; margin: 5px 0;">
      <span style='text-decoration: underline;'>Previous Retained Earnings</span>
    </div>

    <!--Income divs-->
    <div id = 'net-income-is' style=" display: flex; justify-content: space-between; margin: 5px 0;">
      <span style='text-decoration: underline;'>Net Income</span>
    </div>

    <hr style="border: none; border-top: 1px solid black; margin: 10px 0;">

    <!--Expenses div-->
    <div id = 'less-dividends' style=" display: flex; justify-content: space-between; margin: 5px 0;">
      <span style='text-decoration: underline;'>Less Dividends</span>
    </div>

    <!--Div that needs to be created dynamically-->
    <!--<div style="display: flex; justify-content: space-between; margin: 5px 0;">-->
    <!--  <span>Interest expense</span>-->
    <!--  <span>$ 20,000</span>-->
    <!--</div>-->

    <hr style="border: none; border-top: 1px solid black; margin: 10px 0;">

    <div id='new-retainedEarnings' style="display: flex; justify-content: space-between; font-weight: bold; margin: 5px 0;">
      <span>Current Retained Earnings</span>
    </div>

  </div>
</body>

`;


        outputDiv.append(earnings);


        let previousRetainedEarnings = 0;
        let dividends = 0;
        let postRetainedEarnings = 0;

        let ISincome = 0;
        let ISexpense = 0;

        for (let i = 0; i < COAdocs.length; i++){
          let data = COAdocs[i].data();
          let ledger = data.Ledger;
          let balance = 0;

          if (data.accountName == "Retained Earnings"){
            for(let i = 0; i < ledger.length; i++){
              let credit = ledger[i].credit;
              let cleanedCredit = credit.replace(/,/g, '');
              let floatCredit = parseFloat(cleanedCredit);


              balance += floatCredit;

            }

             previousRetainedEarnings += balance;

            let validated = formatMoney(balance);

            let stringBalance = `$${validated}`;
            
            let newDiv = document.createElement('span');

            newDiv.innerHTML = `${stringBalance} `;

            document.getElementById("beginning-retainedEarnings").append(newDiv);
          } else if (data.accountName == "Dividends Payable"){

            for(let i = 0; i < ledger.length; i++){
              let debit = ledger[i].debit;
              let cleanedDebit = debit.replace(/,/g, '');
              let floatDebit = parseFloat(cleanedDebit);
              balance += floatDebit;
            }

            dividends += balance;

            let validated = formatMoney(balance);

            let stringBalance = `$${validated}`;
            
            let newDiv = document.createElement('span');

            newDiv.innerHTML = `${stringBalance} `;

            document.getElementById("less-dividends").append(newDiv);

          }



          if (data.accountCategory == "Revenue"){
            for(let i = 0; i < ledger.length; i++){
              let credit = ledger[i].credit;
              let cleanedCredit = credit.replace(/,/g, '');
              let floatCredit = parseFloat(cleanedCredit);
              balance += floatCredit;
            }

            ISincome += balance;
          } 
          if (data.accountCategory == "Expense"){

            for(let i = 0; i < ledger.length; i++){
              let debit = ledger[i].debit;
              let cleanedDebit = debit.replace(/,/g, '');
              let floatDebit = parseFloat(cleanedDebit);
              balance += floatDebit;
            }

            ISexpense += balance;
          }

        }

        const a = ISincome - ISexpense;
        const tax = a * 0.0575;
        const ISnetIncome = a - tax;


        let netIncomeISvalid = formatMoney(ISnetIncome);
        let stringISnet = `$${netIncomeISvalid}`;
        const ISnetIncomeSpan = document.createElement("span");
        ISnetIncomeSpan.innerHTML = `${stringISnet}`;

        document.getElementById("net-income-is").append(ISnetIncomeSpan);


        const currentRetainedEarnings = (previousRetainedEarnings + ISnetIncome) - dividends;

        let result = formatMoney(currentRetainedEarnings);
        let stringResult = `$${result}`;
        const resultSpan = document.createElement("span");
        resultSpan.innerHTML = `${stringResult}`;

        document.getElementById("new-retainedEarnings").append(resultSpan);



        break;
      default: break;

    }
  }catch(e){
    console.log(e);
  }
}

  //  let content = `<h2>${formatTitle(statementType)}</h2>
  //        <table>
  //        <thead>
  //        <tr>
  //        <th>Account</th>
  //        <th>Debit</th>
  //        <th>Credit</th>
  //        </tr>
  //        </thead>
  //        <tbody>
  //        <!-- Add your data rows here -->
  //        </tbody>
  //        </table>`;
  //
  //  outputDiv.innerHTML = content;
  //} catch (error) {
  //  console.error('Error generating statement:', error);
  //}


function formatTitle(statementType) {
    return statementType.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function formatMoney(num){
   return Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2, }).format(num);
}



