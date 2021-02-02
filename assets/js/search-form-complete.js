apiKey = `373886b34df66a9a6c72c04fa0d29dd8`
https://financialmodelingprep.com/api/v3/search-ticker?query=AA&limit=10&exchange=NASDAQ&apikey=373886b34df66a9a6c72c04fa0d29dd8

// EXCHANGE CHOICES: ETF | MUTUAL_FUND | COMMODITY | INDEX | CRYPTO | FOREX | TSX | AMEX | NASDAQ | NYSE | EURONEXT


function getTickers (str, limit, exchange) {
  fetch(`https://financialmodelingprep.com/api/v3/search-ticker?query=${str}&limit=${limit}&exchange=${exchange}&apikey=${apiKey}`)
      .then(response => response.json())
      .then(data => buildDataList(data))
};

function buildDataList(data) {
  console.log(data);
}

getTickers("",4000,"NASDAQ");