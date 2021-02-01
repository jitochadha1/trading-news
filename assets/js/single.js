let fmpApiKey = `790c2982fd01273e3a03a32d42eb3273`
let companyNameEl = document.querySelector("#company-name");
let stockSymbolEl = document.querySelector("#stock-symbol");
let formEl = document.querySelector("#single-stock-form");

let getStock = function() {
  let qArr = document.location.search.substring(1).split("&");
  let qObj = {}
  for (let i = 0; i < qArr.length; i++) {
    let eachQ = qArr[i].split("=");
    qObj[eachQ[0]] = eachQ[1];
  }

  console.log(qObj);
  let companyName = qObj.name;
  let stockSymbol = qObj.symbol;
  if(stockSymbol && companyName) {
    companyNameEl.textContent = companyName.replace("%20"," ");
    stockSymbolEl.textContent = stockSymbol;
    fetchStockQuote(stockSymbol);
  } else {
    // MAKE SURE TO ADD THIS BACK IN
    // document.location.replace("./index.html");
  }
};

function fetchStockQuote(stockSymbol) {
  fetch(`https://financialmodelingprep.com/api/v3/quote/${stockSymbol}?apikey=${fmpApiKey}`)
    .then(response => response.json())
    .then(data => prepareTable(data[0]));
};

function prepareTable(data) {
  // create an array of table data rows as objects
    
  // prepare table 1 data
  let table1 = [
    {
      key: "Price",
      value: data.price
    },
    {
      key: "Percent Change",
      value: data.changesPercentage
    },
    {
      key: "Open",
      value: data.open
    },
    {
      key: "High",
      value: data.dayHigh
    },
    {
      key: "Low",
      value: data.dayLow
    },
    {
      key: "Volume",
      value: data.volume
    }
  ];

  // prepare table 2 data
  let table2 = [
    {
      key: "Market Cap",
      value: data.marketCap
    },
    {
      key: "EPS",
      value: data.eps
    },
    {
      key: "PE",
      value: data.pe
    },
    {
      key: "52 Week High",
      value: data.yearHigh
    },
    {
      key: "52 Week Low",
      value: data.yearLow
    },
    {
      key: "Avg Volume",
      value: data.avgVolume
    }
  ];
  displayTable(table1);
  displayTable(table2);
};

function displayTable(tableData) {
  // create table and body
  let tableEl = $("<table>").addClass("cell medium-6")
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

let formHandler = function(event) {
  event.preventDefault();
  let symbol = event.target.querySelector("#symbol")
  fetchStockQuote(symbol.value);
}

// Event Listeners
formEl.addEventListener("submit",formHandler)


// ON PAGE LOAD 
getStock();
