
let resultsList = document.getElementById("results-list");


function getCoinInfo() {
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false`)
    .then(function(response){
      return response.json();
    }).then(function(data) {
        displayActiveCrypto(data);
    })
};


function displayActiveCrypto(coins) {
    console.log(coins);
    for (let i = 0; i < coins.length; i++) {
        let cardElement = document.createElement("div");
        cardElement.classList = "card stock-card";
        cardElement.setAttribute("id",coins[i].symbol );
        let cardHeader = document.createElement("div");
        cardHeader.classList = "card-divider card-header";
        let cardBody = document.createElement("img");
        cardBody.classList = "stock-image";
        cardBody.setAttribute("src",coins[i].image);

        cardElement.appendChild(cardHeader);
        cardElement.appendChild(cardBody);
        let coinName = document.createElement("div")
        coinName.classList = "company-name";
        coinName.innerHTML = `<span>${coins[i].name}</span><br><span>${coins[i].symbol}</span>`
        cardHeader.appendChild(coinName);

        let coinDetails = document.createElement("div");
        coinDetails.classList = "stock-price";
        coinDetails.innerHTML = `<span class="stock-price">${coins[i].current_price}</span><br><span>${coins[i].price_change_percentage_24h}</span>`
        cardHeader.appendChild(coinDetails);
        console.log(cardElement);

        resultsList.appendChild(cardElement);







        
        
    }



};

getCoinInfo();