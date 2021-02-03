const fmpApiKey =  `790c2982fd01273e3a03a32d42eb3273`
let portfolioTickers = [
    // {
//     // ticker: "aapl",
//     // shares: "100",
//     // companyName: "apple",
//     // price: "200",
//     // changesPercentage: "5"
// }
];

initializePage();

function getNews (tickers, items) {
    fetch(`https://stocknewsapi.com/api/v1?tickers=${tickers.join()}&items=${items}&token=tvqftcxiwedbpjfxkixyqylbrjwvx3cjeoqmuvj8`)
        .then(response => response.json())
        .then(data => displayNewsList(data.data));
};

function getTickerImages(tickers) {
    let items = 50;
    fetch(`https://stocknewsapi.com/api/v1?tickers=${tickers.join()}&items=${items}&token=tvqftcxiwedbpjfxkixyqylbrjwvx3cjeoqmuvj8`)
        // .then(function(response) {
        //     return response.json();
        // })
        .then(response => response.json())
        .then(data => displayTickerImages(tickers, data.data));
};

function displayTickerImages(tickers, newsList) {
    for (let ticker of tickers) {
        let imageUrl = getTickerImageUrl(ticker, newsList);
        displayTickerImage(ticker, imageUrl);
    }
}

function getTickerImageUrl(ticker, newsList) {
    const matchingStory = newsList.find(function (newsStory) {
        return newsStory.tickers.includes(ticker);
    });
    if(matchingStory) {
        return matchingStory.image_url;
    
    } else {
        return getTickerImages([ticker]);
    
    }
};

function displayTickerImage(ticker, imageUrl) {
    if(imageUrl === "") return;
    $(`#${ticker} img`).attr("src", imageUrl)
};

function getTrending() {
    fetch(`https://financialmodelingprep.com/api/v3/stock/actives?apikey=${fmpApiKey}`)
        .then(response => response.json())
        .then(data => displayActiveStockList(data.mostActiveStock));
};

function getPortfolioCompanyInfo(ticker) {
    return fetch(`https://financialmodelingprep.com/api/v3/quote/${ticker.toUpperCase()}?apikey=${fmpApiKey}`)
        .then(response => response.json())
        
    
}

function displayActiveStockList(activeStockList) {
    let tickers = activeStockList.map(stock => stock.ticker);
    activeStockList.sort((stockA, stockB) => {
        const stockAChanges = percentChangeToDecimal(stockA.changesPercentage)               
        const stockBChanges = percentChangeToDecimal(stockB.changesPercentage)
        if(stockAChanges > stockBChanges) {
            return -1;
        }   else {
            return 1;
        }            
    })
    activeStockList.forEach(stock => displayStock(stock));
    getTickerImages(tickers);
    // console.log(activeStockList);
};

function displayStock(stock) {
    let card = $(`<div id="${stock.ticker}"></div>`);
    card.addClass("card stock-card");
    card.click(() => handleStockClick(stock.ticker));

    const divider = $(`<div class="card-divider card-header"></div>`);
    const companyName = $(`<a class="company-name" href="./single-stock.html?name=${stock.companyName}&symbol=${stock.ticker}"> <span>${stock.companyName}</span> </br> <span class="stock-symbol"> ${stock.ticker}</span> </a>`);
    const stockDetails = $(`<div class="stock-details"></div>`);
    const stockPrice = $(`<span class="stock-price"> ${stock.price}</span>`);
    let stockChangesPercentage; 
    let percentChange = percentChangeToDecimal(stock.changesPercentage);
    if(percentChange > 0) {
        stockChangesPercentage = $(`<span class="stock-changes-percentage positive-change"> ${stock.changesPercentage}</span>`);
    } else {
        stockChangesPercentage = $(`<span class="stock-changes-percentage negative-change"> ${stock.changesPercentage}</span>`);
    };
    const stockImage = $(`<img class="stock-image"></img>`);
    divider.append(companyName);
    stockDetails.append(stockPrice);
    stockDetails.append(stockChangesPercentage);
    divider.append(stockDetails);
    card.append(divider);
    card.append(stockImage);
    $("#results-list").append(card);
}

function percentChangeToDecimal(percentChange) {
    percentChange = percentChange.replace("%", "")
    percentChange = percentChange.replace("(", "")
    percentChange = percentChange.replace(")", "")
    return +percentChange;
}

function handleStockClick(ticker) {
    // getNews(["gme", "tsla", "aapl"], 4);
    getNews([ticker], 5);
}

function displayNewsList(newsList) {
    clearNewsList();
    newsList.forEach(newsStory => displayStory(newsStory));
}

function displayStory(newsStory) {
    let listItem = $("<li></li>");
    listItem.html(`<a target="_blank" href="${newsStory.news_url}">${newsStory.title}</a>`);
    $("#news-list").append(listItem);
}

function handleFetchNewsSubmit(e) {
    e.preventDefault();
    let tickerInput = document.querySelector('#symbol');
    getNews([tickerInput.value], 10);
    tickerInput.value = "";

}

function clearNewsList() {
    $("#news-list").empty();
}

function initializePage() {
    $("#news-form").submit(handleFetchNewsSubmit);
    $(document).foundation();
    getTrending();
    loadSymbolsFromLocal();
    $("#save-stock-button").click(handleSaveStock);
    displayPortfolio();
}

// add a ticker
function addPortfolioItem(portfolioItem) {
    portfolioTickers.push(portfolioItem);
    saveSymbolsToLocal();
}

function handleSaveStock() {
    const symbol = $("#new-stock").val();
    const shares = $("#number-shares").val();
    getPortfolioCompanyInfo(symbol).then(data => {
        console.log(data[0]);
        let portfolioItem = {
            ticker: symbol,
            shares: shares,
            companyName: data[0].name,
            price: data[0].price,
            changesPercentage: data[0].changesPercentage
        }
        addPortfolioItem(portfolioItem)
    });
    
}

// savings symbols to local storage
function saveSymbolsToLocal() {
    localStorage.setItem('portfolioTickers', JSON.stringify(portfolioTickers));
}
// saveSymbolsToLocal();

// load symbols from local storage
function loadSymbolsFromLocal() {
    localStoragePortfolioTickers = JSON.parse(localStorage.getItem('portfolioTickers'));
}

// delete a ticker
function deleteTicker(deletedTicker) {
    updatedTickers = portfolioTickers.filter(portfolioItem => portfolioItem.ticker !== deletedTicker);
    portfolioTickers = updatedTickers;
    saveSymbolsToLocal();
}

// display cards for each ticker
function displayPortfolio() {
    clearPortfolio();
    portfolioTickers.forEach(portfolioItem => displayPortfolioPosition(portfolioItem));
}

function clearPortfolio() {
    $("#portfolio-cards").empty();
}

// display a single card
function displayPortfolioPosition(position) {
    let card = $(`<div id="portfolio-${position.ticker}"></div>`);
    card.addClass("card position-card");
    card.click(() => handlePositionClick(position.ticker));

    const divider = $(`<div class="card-divider position-card-header"></div>`);
    const companyName = $(`<a class="company-name" href="./single-stock.html?name=${position.companyName}&symbol=${position.ticker}"> <span>${position.companyName}</span> </br> <span class="stock-symbol"> ${position.ticker}</span> </a>`);
    const positionDetails = $(`<div class="position-details"></div>`);
    const positionPrice = $(`<span class="position-price"> ${position.price}</span>`);
    let stockChangesPercentage; 
    let percentChange = percentChangeToDecimal(position.changesPercentage);
    if(percentChange > 0) {
        stockChangesPercentage = $(`<span class="position-changes-percentage positive-change"> ${position.changesPercentage}</span>`);
    } else {
        stockChangesPercentage = $(`<span class="position-changes-percentage negative-change"> ${position.changesPercentage}</span>`);
    };
    const stockImage = $(`<img class="stock-image"></img>`);
    divider.append(companyName);
    positionDetails.append(positionPrice);
    positionDetails.append(stockChangesPercentage);
    divider.append(positionDetails);
    card.append(divider);
    card.append(stockImage);
    $("#portfolio-cards").append(card);
}


// hangle user click on card
function handlePositionClick () {

}
// show single stock page
// hide single stock page
// sort favorites
// calculation value of a position
// calculate value of portfolio