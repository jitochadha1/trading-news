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
        // .then(response => response.json())
        // .then(data => displayTickerImages(tickers, data.data));
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
    const fmpApiKey =  `373886b34df66a9a6c72c04fa0d29dd8`
    fetch(`https://financialmodelingprep.com/api/v3/stock/actives?apikey=${fmpApiKey}`)
        .then(response => response.json())
        .then(data => displayActiveStockList(data.mostActiveStock));
};

function displayActiveStockList(activeStockList) {
    let tickers = activeStockList.map(stock => stock.ticker);
    activeStockList.forEach(stock => displayStock(stock));
    getTickerImages(tickers);
};

function displayStock(stock) {
    let card = $(`<div id="${stock.ticker}"></div>`);
    card.addClass("card stock-card");
    card.click(() => handleStockClick(stock.ticker));

    const divider = $(`<div class="card-divider card-header"></div>`);
    const companyName = $(`<div class="company-name"> <span>${stock.companyName}</span> </br> <span class="stock-symbol"> ${stock.ticker}</span> </div>`);
    const stockDetails = $(`<div class="stock-details"></div>`);
    const stockPrice = $(`<span class="stock-price"> ${stock.price}</span>`);
    let stockChangesPercentage; 
    let percentChange = stock.changesPercentage.replace("%", "")
    percentChange = percentChange.replace("(", "")
    percentChange = percentChange.replace(")", "")
    if(+percentChange > 0) {
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
    $("#home-nav").click(handleHomeClick);
    $("#trending-nav").click(handleTrendingClick);
    $("#portfolio-nav").click(handlePortfolioClick);
}

function hideHome() {
    $("#home").css("display", "none");
}

function hideTrending() {
    $("#results-list").css("display", "none");
}

function hidePortfolio() {
    $("#portfolio").css("display", "none");
}

function showHome() {
    $("#home").css("display", "flex");
}

function showTrending() {
    $("#results-list").css("display", "flex");
}

function showPortfolio() {
    $("#portfolio").css("display", "flex");
}

function hideAllPages() {
    hideHome();
    hideTrending();
    hidePortfolio();
}

function handleHomeClick() {
    hideAllPages();
    showHome();
}

function handleTrendingClick() {
    hideAllPages();
    showTrending();
}

function handlePortfolioClick() {
    hideAllPages();
    showPortfolio();
}
