let fmpApiKey = `790c2982fd01273e3a03a32d42eb3273`
let companyNameEl = document.querySelector("#company-name");
let stockSymbolEl = document.querySelector("#stock-symbol");
let formEl = document.querySelector("#single-stock-form");

// format currency data with toUSD.format(num)
let toComSep = new Intl.NumberFormat('en-US');
let toUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });


let getStock = function() {
  let qArr = document.location.search.substring(1).split("&");
  let qObj = {}
  for (let i = 0; i < qArr.length; i++) {
    let eachQ = qArr[i].split("=");
    qObj[eachQ[0]] = eachQ[1];
  }

  // let companyName = qObj.name;
  // ^ not using anymore
  let stockSymbol = qObj.symbol;
  if(stockSymbol) {
    fetchStockQuote(stockSymbol);
    fetchIncomeStatement(stockSymbol);
  } else {
    document.location.replace("./index.html");
  }
};

function displayHeaders(name, symbol) {
  companyNameEl.textContent = name.replace("%20"," ");
  stockSymbolEl.textContent = symbol;
}

function fetchStockQuote(stockSymbol) {
  fetch(`https://financialmodelingprep.com/api/v3/quote/${stockSymbol}?apikey=${fmpApiKey}`)
    .then(response => response.json())
    .then(data => preparePriceTable(data[0]));
};

function preparePriceTable(data) {
  // clear tables already there
  $("#price-div").empty();

  // change headers
  displayHeaders(data.name, data.symbol)
  
  // create an array of table data rows as objects
  // prepare table 1 data
  let table1 = [
    {
      key: "Price",
      value: toUSD.format(data.price)
    },
    {
      key: "Percent Change",
      value: data.changesPercentage + '%'
    },
    {
      key: "Open",
      value: toUSD.format(data.open)
    },
    {
      key: "High",
      value: toUSD.format(data.dayHigh)
    },
    {
      key: "Low",
      value: toUSD.format(data.dayLow)
    },
    {
      key: "Volume",
      value: toComSep.format(data.volume)
    }
  ];

  // prepare table 2 data
  let table2 = [
    {
      key: "Market Cap",
      value: "$" + toComSep.format(data.marketCap)
    },
    {
      key: "EPS",
      value: toUSD.format(data.eps)
    },
    {
      key: "PE",
      value: toComSep.format(data.pe)
    },
    {
      key: "52 Week High",
      value: toUSD.format(data.yearHigh)
    },
    {
      key: "52 Week Low",
      value: toUSD.format(data.yearLow)
    },
    {
      key: "Avg Volume",
      value: toComSep.format(data.avgVolume)
    }
  ];
  displayPriceTable(table1);
  displayPriceTable(table2);
};

function displayPriceTable(tableData) {
  // create table and body
  let tableEl = $("<table>").addClass("cell medium-6 unstriped")
  let tableBodyEl = $("<tbody>")
  tableEl.append(tableBodyEl);

  // append table data objects as a rows
  for (let i = 0; i < tableData.length; i++) {
    let tableRowEl = $("<tr>");
    
    let tdOne = $("<td>")
      .text(tableData[i].key);

    let tdTwo = $("<td>")
      .text(tableData[i].value)
      .addClass("float-right");
    
      tableRowEl.append(tdOne, tdTwo);
    tableBodyEl.append(tableRowEl);
  }

  $("#price-div").append(tableEl);
};

function fetchIncomeStatement(stockSymbol) {
  fetch(`https://financialmodelingprep.com/api/v3/income-statement/${stockSymbol}?limit=5&apikey=${fmpApiKey}`)
    .then(response => response.json())
    .then(data => prepareIncomeStatement(data));
}

function prepareIncomeStatement(arr) {
  // clear tables already there
  $("#income-div").empty();

  var tableData = {}
    tableData.date = ["Date"];
    tableData.revenue = ["Sales"];
    tableData.costOfRevenue = ["Cost of Sales"];
    tableData.grossProfit = ["Gross Profit"];
    tableData.grossProfitRatio = ["Gross Margin"];
    tableData.sellingAndMarketingExpenses = ["Marketing Expenses"];
    tableData.generalAndAdministrativeExpenses = ["G&A Expenses"];
    tableData.researchAndDevelopmentExpenses = ["R&D Expenses"];
    tableData.operatingExpenses = ["Operating Expenses"];
    tableData.operatingIncome = ["Operating Income"];
    tableData.totalOtherIncomeExpensesNet = ["Tot. Oth. Inc. Exp. Net"];
    tableData.otherExpenses = ["Other Expenses"];
    tableData.incomeBeforeTax = ["Income Before Taxes"];
    tableData.incomeTaxExpense = ["Income Tax Expense"];
    tableData.netIncome = ["Net Income"];
    tableData.netIncomeRatio = ["NI Margin"];
    tableData.interestExpense = ["Interest Expense"];
    tableData.depreciationAndAmortization = ["Deprec. And Amort."];
    tableData.ebitda = ["EBITDA"];
    tableData.eps = ["EPS"];
    tableData.epsdiluted = ["EPS diluted"];

  for (let i = 0; i < arr.length; i++) {
    tableData.date.push(arr[i].date);
    tableData.revenue.push(toComSep.format(arr[i].revenue));
    tableData.costOfRevenue.push(toComSep.format(arr[i].costOfRevenue));
    tableData.grossProfit.push(toComSep.format(arr[i].grossProfit));
    tableData.grossProfitRatio.push(toComSep.format(arr[i].grossProfitRatio * 100) + '%');
    tableData.sellingAndMarketingExpenses.push(toComSep.format(arr[i].sellingAndMarketingExpenses));
    tableData.generalAndAdministrativeExpenses.push(toComSep.format(arr[i].generalAndAdministrativeExpenses));
    tableData.researchAndDevelopmentExpenses.push(toComSep.format(arr[i].researchAndDevelopmentExpenses));
    tableData.operatingExpenses.push(toComSep.format(arr[i].operatingExpenses));
    tableData.operatingIncome.push(toComSep.format(arr[i].operatingIncome));
    tableData.totalOtherIncomeExpensesNet.push(toComSep.format(arr[i].totalOtherIncomeExpensesNet));
    tableData.otherExpenses.push(toComSep.format(arr[i].otherExpenses));
    tableData.incomeBeforeTax.push(toComSep.format(arr[i].incomeBeforeTax));
    tableData.incomeTaxExpense.push(toComSep.format(arr[i].incomeTaxExpense));
    tableData.netIncome.push(toComSep.format(arr[i].netIncome));
    tableData.netIncomeRatio.push(toComSep.format(arr[i].netIncomeRatio * 100) + '%');
    tableData.interestExpense.push(toComSep.format(arr[i].interestExpense));
    tableData.depreciationAndAmortization.push(toComSep.format(arr[i].depreciationAndAmortization));
    tableData.ebitda.push(toComSep.format(arr[i].ebitda));
    tableData.eps.push(toComSep.format(arr[i].eps));
    tableData.epsdiluted.push(toComSep.format(arr[i].epsdiluted));
  }
  displayIncomeStatement(tableData);
};

// WIP
function displayIncomeStatement(tableData) {
  // create table and body
  let tableEl = $("<table>").addClass("cell unstriped")
  let tableBodyEl = $("<tbody>")
  tableEl.append(tableBodyEl);

  // append table data as a rows
  for (const arr in tableData) {
    var tableRowEl = $("<tr>");
    for (let i = 0; i < tableData[arr].length; i++) {
      var tdEl = $("<td>")
      if(i === 0) {
        tdEl.addClass("td-left")
      } else {
        tdEl.addClass("td-right")
      }

      tdEl.text(tableData[arr][i]);
      console.log(tableData[arr][i]);
      tableRowEl.append(tdEl);
    }
    tableEl.append(tableRowEl);
  }
  $("#income-div").append(tableEl);
};

let formHandler = function(event) {
  event.preventDefault();
  let symbolEl = event.target.querySelector("#symbol")
  document.location.search = `?symbol=${symbolEl.value}`;
  symbolEl.value = "";
}

// Event Listeners
formEl.addEventListener("submit",formHandler)

// ON LOAD
getStock();