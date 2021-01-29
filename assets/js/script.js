// var userInput = $("#symbol");



var getNews = function (tickers, items) {

    fetch(`https://stocknewsapi.com/api/v1?tickers=${tickers.join()}&items=${items}&token=tvqftcxiwedbpjfxkixyqylbrjwvx3cjeoqmuvj8`)
        .then(response => response.json())
        // .then(data => displayNewsList(data.data));
        .then(data => displayNewsList(data.data));
};
var getTickerImages = function (tickers, items) {

    fetch(`https://stocknewsapi.com/api/v1?tickers=${tickers.join()}&items=${items}&token=tvqftcxiwedbpjfxkixyqylbrjwvx3cjeoqmuvj8`)
        // .then(function(response) {
        //     return response.json();
        // })    
        .then(response => response.json())
    // .then(data => displayNewsList(data.data));
    // .then(data => {
    //     return data.data.map(article => ({
    //         tickers: article.tickers, 
    //         imageURL: article.image_url
    //     }));
    // });
};

// function saveSymbol() {
//     $("#symbol").on("click", $())
// }
// function fetchNews() {
//     let fetchNewsButton = document.getElementById("button");
//     fetchNewsButton.addEventListener("click", getNews);
// }
// fetchNews();

function getTrending() {
    fetch("https://financialmodelingprep.com/api/v3/stock/actives?apikey=790c2982fd01273e3a03a32d42eb3273")
        .then(response => response.json())
        .then(data => displayActiveStockList(data.mostActiveStock));

};
getTrending();

function displayActiveStockList(activeStockList) {
    let tickers = activeStockList.map(stock => stock.ticker);
    activeStockList.forEach(stock => displayStock(stock));
    // getTickerImages(tickers, 30).then(images => {
    //     console.log(images);
    // });

};

function displayStock(stock) {
    console.log(stock);
    let card = $("<div></div>");
    card.addClass("card stock-card");
    card.click(() => handleStockClick(stock.ticker));

    const divider = $(`<div class="card-divider card-header"></div>`);
    const companyName = $(`<span class="company-name"> ${stock.companyName}</span>`);
    const stockDetails = $(`<div class="stock-details"></div>`);
    const stockPrice = $(`<span class="stock-price"> ${stock.price}</span>`);
    const stockChangesPercentage = $(`<span class="stock-changes-percentage"> ${stock.changesPercentage}</span>`);
    const stockSymbol = $(`<span class="stock-symbol"> ${stock.ticker}</span>`);
    const stockImage = $(`<img class="stock-image"></img>`);
    
    divider.append(companyName);
    stockDetails.append(stockPrice);
    stockDetails.append(stockChangesPercentage);
    stockDetails.append(stockSymbol);
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
function handleFetchNewsSubmit() {
    let tickerInput = document.querySelector('#symbol').value;
    getNews([tickerInput], 10);
}
$("#fetch-news-button").click(handleFetchNewsSubmit)

function clearNewsList() {
    $("#news-list").empty();
}