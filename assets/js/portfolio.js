const fmpApiKey = `790c2982fd01273e3a03a32d42eb3273`
// format currency data with toUSD.format(num)
let toComSep = new Intl.NumberFormat('en-US');
let toUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
let portfolioTickers = [
];

initializePage();

function getNews (tickers, items) {
    fetch(`https://financialmodelingprep.com/api/v3/stock_news?tickers=${tickers.join()}&limit=${items}&apikey=${fmpApiKey}`)
        .then(response => response.json())
        .then(data => displayNewsList(data));
        // .then(data => console.log(data))
};

function getTickerImages(tickers) {
    let items = 50;
    fetch(`https://financialmodelingprep.com/api/v3/stock_news?tickers=${tickers.join()}&limit=${items}&apikey=${fmpApiKey}`)
        // .then(function(response) {
        //     return response.json();
        // })
        .then(response => response.json())
        .then(data => displayTickerImages(tickers, data));
};

function displayTickerImages(tickers, newsList) {
    for (let ticker of tickers) {
        let imageUrl = getTickerImageUrl(ticker, newsList);
        displayTickerImage(ticker, imageUrl);
    }
}

function getTickerImageUrl(ticker, newsList) {
    const matchingStory = newsList.find(function (newsStory) {
        return newsStory.symbol === ticker;
    });
    if(matchingStory) {
        return matchingStory.image;
    
    } else {
        return getTickerImages([ticker]);
    
    }
};

function displayTickerImage(ticker, imageUrl) {
    if (imageUrl === "") return;
    $(`#portfolio-${ticker} img`).attr("src", imageUrl)
};

function getPortfolioCompanyInfo(ticker) {
    return fetch(`https://financialmodelingprep.com/api/v3/quote/${ticker.toUpperCase()}?apikey=${fmpApiKey}`)
        .then(response => response.json())


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
    listItem.html(`<a target="_blank" href="${newsStory.url}">${newsStory.title}</a>`);
    $("#news-list").append(listItem);
}

function handleFetchNewsSubmit(e) {
    e.preventDefault();
    let tickerInput = document.querySelector('#symbol');
    getNews([tickerInput.value.toUpperCase()], 10);
    tickerInput.value = "";

}

function clearNewsList() {
    $("#news-list").empty();
}

function initializePage() {
    $("#news-form").submit(handleFetchNewsSubmit);
    $(document).foundation();
    loadSymbolsFromLocal();
    $("#save-stock-button").click(handleSaveStock);
    displayPortfolio();
    calculatePortfolioValue();
}

// add a ticker
function addPortfolioItem(portfolioItem) {
    // todo: check for duplicates
    portfolioTickers.push(portfolioItem);
    saveSymbolsToLocal();
    displayPortfolio();
    calculatePortfolioValue();
}

function handleSaveStock() {
    const symbol = $("#new-stock").val().toUpperCase();
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
    // if local storage portfolio tickers is null then
    if (localStoragePortfolioTickers === null) {
        //add an empyty [] to portfolioTickers, else set portfolioTickers = localStoragePortfolioTickers
        portfolioTickers = [];
    } else {
        portfolioTickers = localStoragePortfolioTickers;
    }

}

// delete a ticker
function deleteTicker(deletedTicker) {
    updatedTickers = portfolioTickers.filter(portfolioItem => portfolioItem.ticker !== deletedTicker);
    portfolioTickers = updatedTickers;
    saveSymbolsToLocal();
    displayPortfolio();
    calculatePortfolioValue();
}

// display cards for each ticker
function displayPortfolio() {
    portfolioTickers.sort((stockA, stockB) => {
        const stockAPositionValue = (stockA.price*stockA.shares)               
        const stockBPositionValue = (stockB.price*stockB.shares)
        if(stockAPositionValue > stockBPositionValue) {
            return -1;
        }   else {
            return 1;
        }            
    })
    clearPortfolio();
    portfolioTickers.forEach(portfolioItem => displayPortfolioPosition(portfolioItem));
    const tickers = getTickers();
    getTickerImages(tickers);
    // console.log(portfolioTickers);
}

function getTickers() {
    let tickers = [];
    portfolioTickers.forEach(position => {
        tickers.push(position.ticker);
    }) 
    return tickers;
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
    const positionValueSummary = $(`<div class="position-value-summary"></div>`);
    const companyName = $(`<a class="company-name" href="./single-stock.html?name=${position.companyName}&symbol=${position.ticker}"> <span>${position.companyName}</span> </br> <span class="stock-symbol"> ${position.ticker}</span> </a>`);
    const positionShares = $(`<span class="position-shares"> ${toComSep.format(position.shares)}</span>`);
    const positionDetails = $(`<div class="position-details"></div>`);
    const positionPrice = $(`<span class="position-price"> ${toUSD.format(position.price)}</span>`);
    const positionValue = $(`<span class="position-value"> ${toUSD.format(position.price * position.shares)}</span>`);
    let stockChangesPercentage;
    let percentChange = position.changesPercentage;
    if (percentChange > 0) {
        stockChangesPercentage = $(`<span class="position-changes-percentage positive-change"> +${percentChange}%</span>`);
    } else {
        stockChangesPercentage = $(`<span class="position-changes-percentage negative-change"> -${percentChange}%</span>`);
    };
    const stockImage = $(`<img class="stock-image"></img>`);
    const deleteButton = $(`<button class="delete-position" id="delete-${position.ticker}"><i class="fa fa-trash-o" aria-hidden="true"></i></button>`);
    deleteButton.click(() => deleteTicker(position.ticker));
    const mainContent = $(`<div class="position-main-content"></div>`)
    divider.append(companyName);
    positionValueSummary.append(positionValue);
    positionValueSummary.append(positionShares);
    divider.append(positionValueSummary);
    positionDetails.append(positionPrice);
    positionDetails.append(stockChangesPercentage);
    divider.append(positionDetails);
    // mainContent.append(deleteButton);
    mainContent.append(stockImage);
    mainContent.click(() => handlePositionClick(position.ticker));
    card.append(divider);
    card.append(mainContent);
    card.append(deleteButton);
    card.mouseover(() => handleMouseOverCard(position.ticker));
    card.mouseout(() => handleMouseOutCard(position.ticker));
    $("#portfolio-cards").append(card);
}


// hangle user click on card
function handlePositionClick(ticker) {
    getNews([ticker], 5);
}
// show single stock page
// hide single stock page
// sort favorites
// calculation value of a position
// calculate value of portfolio

function handleMouseOverCard(ticker) {
    $(`#delete-${ticker}`).addClass("delete-button-visible");
    // console.log("mouseover", ticker);
}

function handleMouseOutCard(ticker) {
    $(`#delete-${ticker}`).removeClass("delete-button-visible");
    // console.log("mouseout", ticker);
}

function calculatePortfolioValue() {
    let portfolioValue = 0;
    portfolioTickers.forEach((stock) => {
        portfolioValue = portfolioValue + (stock.price*stock.shares);
    })

    $("#portfolio-value").text(toUSD.format(portfolioValue));
}
