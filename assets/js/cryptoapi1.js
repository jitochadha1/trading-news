// function getCoinInfo (){
//     console.log(working);
//     fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false')
//     .then(response => response.json())
//     .then(data => (data.data));
    
// };
// getCoinInfo();

function getCoinInfo() {
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false`)
    .then(function(response){
      return response.json();
    }).then(function(data) {
      console.log(data);
    })
};
getCoinInfo();

function displayStock(stock) {
  let card = $(`<div id="${stock.ticker}"></div>`);
  card.addClass("card stock-card");
  card.click(() => handleStockClick(stock.ticker));

// function getTickerImages(tickers) {
//     let items = 50;
//     fetch(`https://stocknewsapi.com/api/v1?tickers=${tickers.join()}&items=${items}&token=tvqftcxiwedbpjfxkixyqylbrjwvx3cjeoqmuvj8`)