let fmpApiKey = `790c2982fd01273e3a03a32d42eb3273`
let companyNameEl = document.querySelector("#company-name");
let stockSymbolEl = document.querySelector("#stock-symbol");
let formEl = document.querySelector("#single-stock-form");
let accordionEl = document.querySelector("#accordion-el")

// format currency data with toUSD.format(num)
let toComSep = new Intl.NumberFormat('en-US');
let toUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

// get user inputs and load to url
let getStock = function() {
  let qArr = document.location.search.substring(1).split("&");
  let qObj = {}
  for (let i = 0; i < qArr.length; i++) {
    let eachQ = qArr[i].split("=");
    qObj[eachQ[0]] = eachQ[1];
  }

  // let companyName = qObj.name;
  // ^ not using anymore
  let stockSymbol = qObj.symbol.toUpperCase();
  if(stockSymbol) {
    $(accordionEl).removeClass("d-none");
    fetchStockQuote(stockSymbol);
    fetchIncomeStatement(stockSymbol);
    fetchBalanceSheet(stockSymbol);
    fetchCashFLow(stockSymbol);
  } 
};

function displayHeaders(name, symbol) {
  companyNameEl.textContent = name.replace("%20"," ");
  stockSymbolEl.textContent = symbol;
}

// PRICE TABLE START
function fetchStockQuote(stockSymbol) {
  fetch(`https://financialmodelingprep.com/api/v3/quote/${stockSymbol}?apikey=${fmpApiKey}`)
    .then(response => response.json())
    .then(data => preparePriceTable(data[0]));
};

function preparePriceTable(data) {
  // clear table
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
// END PRICE TABLE

// INCOME STATEMENT START
function fetchIncomeStatement(stockSymbol) {
  fetch(`https://financialmodelingprep.com/api/v3/income-statement/${stockSymbol}?limit=5&apikey=${fmpApiKey}`)
    .then(response => response.json())
    .then(data => prepareIncomeStatement(data));
}

function prepareIncomeStatement(arr) {
  console.log(arr)
  if(arr.length === 0) {
    $("#income-li").addClass("d-none");
    return;
  };
  // clear tables already there hide li if empty
  $("#income-div").empty();
  $("#income-li").removeClass("d-none");
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
      tableRowEl.append(tdEl);
    }
    tableEl.append(tableRowEl);
  }
  $("#income-div").append(tableEl);
};
// END INCOME STATEMENT

// BALANCE SHEET START
function fetchBalanceSheet(stockSymbol) {
  let periods = 5
  fetch(`https://financialmodelingprep.com/api/v3/balance-sheet-statement/${stockSymbol}?limit=${periods}&apikey=${fmpApiKey}`)
    .then(response => response.json())
    .then(data => prepareBalanceSheet(data));
}

function prepareBalanceSheet(arr) {
  if(arr.length === 0) {
    $("#balance-sheet-li").addClass("d-none");
    return false;
  };
  // clear tables already there hide li if empty
  $("#balance-sheet-div").empty();
  $("#balance-sheet-li").removeClass("d-none");
  var tableData = {}
    tableData.date = ["Date"];
    tableData.cashAndCashEquivalents = ["Cash & Cash Equivalents"]
    tableData.shortTermInvestments = ["Short Term Investments"]
    tableData.cashAndShortTermInvestments = ["Cash & Short Term Investments"]
    tableData.netReceivables = ["Net Receivables"]
    tableData.inventory = ["Inventory"]
    tableData.otherCurrentAssets = ["Other Current Assets"]
    tableData.totalCurrentAssets = ["Total Current Assets"]
    tableData.propertyPlantEquipmentNet = ["PP&E Net"]
    tableData.goodwill = ["Goodwill"]
    tableData.intangibleAssets = ["Intangible Assets"]
    tableData.goodwillAndIntangibleAssets = ["Goodwill & Intangible Assets"]
    tableData.longTermInvestments = ["Long Term Investments"]
    tableData.taxAssets = ["Tax Assets"]
    tableData.otherNonCurrentAssets = ["Other Non Current Assets"]
    tableData.totalNonCurrentAssets = ["Total Non Current Assets"]
    tableData.otherAssets = ["Other Assets"]
    tableData.totalAssets = ["Total Assets"]
    tableData.accountPayables = ["Accounts Payable"]
    tableData.shortTermDebt = ["Short Term Debt"]
    tableData.taxPayables = ["Tax Payable"]
    tableData.deferredRevenue = ["Deferred Revenue"]
    tableData.otherCurrentLiabilities = ["Other Current Liabilities"]
    tableData.totalCurrentLiabilities = ["Total Current Liabilities"]
    tableData.longTermDebt = ["Long Term Debt"]
    tableData.deferredRevenueNonCurrent = ["Non-Current Deferred Revenue"]
    tableData.deferredTaxLiabilitiesNonCurrent = ["Non-Current Deferred Tax Liabilities"]
    tableData.otherNonCurrentLiabilities = ["Other Non Current Liabilities"]
    tableData.totalNonCurrentLiabilities = ["Total Non Current Liabilities"]
    tableData.otherLiabilities = ["Other Liabilities"]
    tableData.totalLiabilities = ["Total Liabilities"]
    tableData.commonStock = ["Common Stock"]
    tableData.retainedEarnings = ["Retained Earnings"]
    tableData.accumulatedOtherComprehensiveIncomeLoss = ["Accumulated Other Comprehensive Income (Loss)"]
    tableData.othertotalStockholdersEquity = ["Other Total Stockholders Equity"]
    tableData.totalStockholdersEquity = ["Total Stockholders Equity"]
    tableData.totalLiabilitiesAndStockholdersEquity = ["Total Liabilities And Stockholders Equity"]
    tableData.totalInvestments = ["Total Investments"]
    tableData.totalDebt = ["Total Debt"]
    tableData.netDebt = ["Net Debt"]
  for (let i = 0; i < arr.length; i++) {
    tableData.date.push(arr[i].date);
    tableData.cashAndCashEquivalents.push(toComSep.format(arr[i].cashAndCashEquivalents));
    tableData.shortTermInvestments.push(toComSep.format(arr[i].shortTermInvestments));
    tableData.cashAndShortTermInvestments.push(toComSep.format(arr[i].cashAndShortTermInvestments));
    tableData.netReceivables.push(toComSep.format(arr[i].netReceivables));
    tableData.inventory.push(toComSep.format(arr[i].inventory));
    tableData.otherCurrentAssets.push(toComSep.format(arr[i].otherCurrentAssets));
    tableData.totalCurrentAssets.push(toComSep.format(arr[i].totalCurrentAssets));
    tableData.propertyPlantEquipmentNet.push(toComSep.format(arr[i].propertyPlantEquipmentNet));
    tableData.goodwill.push(toComSep.format(arr[i].goodwill));
    tableData.intangibleAssets.push(toComSep.format(arr[i].intangibleAssets));
    tableData.goodwillAndIntangibleAssets.push(toComSep.format(arr[i].goodwillAndIntangibleAssets));
    tableData.longTermInvestments.push(toComSep.format(arr[i].longTermInvestments));
    tableData.taxAssets.push(toComSep.format(arr[i].taxAssets));
    tableData.otherNonCurrentAssets.push(toComSep.format(arr[i].otherNonCurrentAssets));
    tableData.totalNonCurrentAssets.push(toComSep.format(arr[i].totalNonCurrentAssets));
    tableData.otherAssets.push(toComSep.format(arr[i].otherAssets));
    tableData.totalAssets.push(toComSep.format(arr[i].totalAssets));
    tableData.accountPayables.push(toComSep.format(arr[i].accountPayables));
    tableData.shortTermDebt.push(toComSep.format(arr[i].shortTermDebt));
    tableData.taxPayables.push(toComSep.format(arr[i].taxPayables));
    tableData.deferredRevenue.push(toComSep.format(arr[i].deferredRevenue));
    tableData.otherCurrentLiabilities.push(toComSep.format(arr[i].otherCurrentLiabilities));
    tableData.totalCurrentLiabilities.push(toComSep.format(arr[i].totalCurrentLiabilities));
    tableData.longTermDebt.push(toComSep.format(arr[i].longTermDebt));
    tableData.deferredRevenueNonCurrent.push(toComSep.format(arr[i].deferredRevenueNonCurrent));
    tableData.deferredTaxLiabilitiesNonCurrent.push(toComSep.format(arr[i].deferredTaxLiabilitiesNonCurrent));
    tableData.otherNonCurrentLiabilities.push(toComSep.format(arr[i].otherNonCurrentLiabilities));
    tableData.totalNonCurrentLiabilities.push(toComSep.format(arr[i].totalNonCurrentLiabilities));
    tableData.otherLiabilities.push(toComSep.format(arr[i].otherLiabilities));
    tableData.totalLiabilities.push(toComSep.format(arr[i].totalLiabilities));
    tableData.commonStock.push(toComSep.format(arr[i].commonStock));
    tableData.retainedEarnings.push(toComSep.format(arr[i].retainedEarnings));
    tableData.accumulatedOtherComprehensiveIncomeLoss.push(toComSep.format(arr[i].accumulatedOtherComprehensiveIncomeLoss));
    tableData.othertotalStockholdersEquity.push(toComSep.format(arr[i].othertotalStockholdersEquity));
    tableData.totalStockholdersEquity.push(toComSep.format(arr[i].totalStockholdersEquity));
    tableData.totalLiabilitiesAndStockholdersEquity.push(toComSep.format(arr[i].totalLiabilitiesAndStockholdersEquity));
    tableData.totalInvestments.push(toComSep.format(arr[i].totalInvestments));
    tableData.totalDebt.push(toComSep.format(arr[i].totalDebt));
    tableData.netDebt.push(toComSep.format(arr[i].netDebt));
  }
  displayBalanceSheet(tableData);
};

function displayBalanceSheet(tableData) {
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
      tableRowEl.append(tdEl);
    }
    tableEl.append(tableRowEl);
  }
  $("#balance-sheet-div").append(tableEl);
};
// END BALANCE SHEET

// CASH FLOW START
function fetchCashFLow(stockSymbol) {
  fetch(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${stockSymbol}?limit=5&apikey=${fmpApiKey}`)
    .then(response => response.json())
    .then(data => prepareCashFlow(data));
}

function prepareCashFlow(arr) {
  if(arr.length === 0) {
    $("#cash-flow-li").addClass("d-none");
    return false;
  };
  // clear tables already there hide li if empty
  $("#cash-flow-div").empty();
  $("#cash-flow-li").removeClass("d-none");
  var tableData = {};
    tableData.date = ["Date"];
    tableData.cashAtBeginningOfPeriod = ["Cash at Beginning of Period"];
    tableData.operatingCashFlow = ["Operating Cash Flow"];
    tableData.capitalExpenditure = ["Capital Expenditure"];
    tableData.freeCashFlow = ["Free Cash Flow"];
    tableData.netCashUsedProvidedByFinancingActivities = ["Cash Flow from Financing"];
    tableData.netChangeInCash = ["Net Change in Cash"];
    tableData.cashAtEndOfPeriod = ["Cash at End of Period"];
  for (let i = 0; i < arr.length; i++) {
    tableData.date.push(arr[i].date);
    tableData.cashAtBeginningOfPeriod.push(toComSep.format(arr[i].cashAtBeginningOfPeriod));
    tableData.operatingCashFlow.push(toComSep.format(arr[i].operatingCashFlow));
    tableData.capitalExpenditure.push(toComSep.format(arr[i].capitalExpenditure));
    tableData.freeCashFlow.push(toComSep.format(arr[i].freeCashFlow));
    tableData.netCashUsedProvidedByFinancingActivities.push(toComSep.format(arr[i].netCashUsedProvidedByFinancingActivities));
    tableData.netChangeInCash.push(toComSep.format(arr[i].netChangeInCash));
    tableData.cashAtEndOfPeriod.push(toComSep.format(arr[i].cashAtEndOfPeriod));
  };
  displayCashFlow(tableData);
};

function displayCashFlow(tableData) {
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
      tableRowEl.append(tdEl);
    }
    tableEl.append(tableRowEl);
  }
  $("#cash-flow-div").append(tableEl);
};
// END CASH FLOW

// Handlers
let formHandler = function(event) {
  event.preventDefault();
  let symbolEl = event.target.querySelector("#symbol")
  document.location.search = `?symbol=${symbolEl.value}`;
  symbolEl.value = "";
}

// Event Listeners
formEl.addEventListener("submit",formHandler)

// On Load
getStock();