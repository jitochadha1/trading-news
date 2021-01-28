// var userInput = $("#symbol");



var getNews = function () {
    let userInput = document.querySelector('#symbol').value;
    fetch(`https://stocknewsapi.com/api/v1?tickers=${userInput}&items=50&token=tvqftcxiwedbpjfxkixyqylbrjwvx3cjeoqmuvj8`)
        .then(response => response.json())
        .then(data => console.log(data));
};

function saveSymbol() {
    $("#symbol").on("click", $())
}
function fetchNews() {
    let fetchNewsButton = document.getElementById("button");
    fetchNewsButton.addEventListener("click", getNews);
}
fetchNews();

function getTrending() {
    fetch("https://financialmodelingprep.com/api/v3/stock/actives?apikey=790c2982fd01273e3a03a32d42eb3273")
    .then(response => response.json())
    .then(data => displaySymbols(data.mostActiveStock));
};
getTrending();

function displaySymbols(activeStockList) {
    activeStockList.forEach(stock => console.log(stock.ticker));
    
};


