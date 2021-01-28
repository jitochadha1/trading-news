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




// function handleInitialSubmission() {
// 	let initialsInput = document.getElementById("initials");
// 	let initialsValue = initialsInput.value;

// let submitInitials = document.getElementById("submitscore");
// submitInitials.addEventListener("click", handleInitialSubmission);