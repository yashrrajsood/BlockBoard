const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
let TICKER_CODE = params.code;
window.onload = function what() {
    fetch("http://localhost:3000/coinTEST/" + String(TICKER_CODE))
        .then((res) => {
            res.json().then(function (data) {
                console.log(data);
                document.title = data["name"] + " | Blockboard";
                document.getElementById("crypto_logo").src = data["logo"]
                document.getElementById("titlePage").innerHTML = data["name"] + " (" + data["ticker"] +")";
                document.getElementById("priceDividerTag").innerHTML = "$" + CurrencyFormatted(data["price"]);

                document.getElementById("oneHourChangeDividerTag").innerHTML = data["percent_change_1h"].toFixed(2) + "%";
                if(data["percent_change_1h"] < 0){
                    document.getElementById("oneHourChangeDividerTitle").innerHTML = "1H % 🔻"
                    document.getElementById("oneHourChangeDividerTag").style.color = "#FF5733"
                }else{
                    document.getElementById("oneHourChangeDividerTitle").innerHTML = "1H % 🔺"                    
                    document.getElementById("oneHourChangeDividerTag").style.color = "#99FF00"
                }

                document.getElementById("twentyFourHourChangeDividerTag").innerHTML = data["percent_change_24h"].toFixed(2) + "%";
                if(data["percent_change_24h"] < 0){
                    document.getElementById("twentyFourHourChangeDividerTitle").innerHTML = "24H % 🔻"
                    document.getElementById("twentyFourHourChangeDividerTag").style.color = "#FF5733"
                }else{
                    document.getElementById("twentyFourHourChangeDividerTitle").innerHTML = "24H % 🔺"
                    document.getElementById("twentyFourHourChangeDividerTag").style.color = "#99FF00"
                }

                document.getElementById("sevenDayChangeDividerTag").innerHTML = data["percent_change_7d"].toFixed(2) + "%";
                if(data["percent_change_7d"] < 0){
                    document.getElementById("sevenDayChangeDividerTitle").innerHTML = "7D % 🔻"
                    document.getElementById("sevenDayChangeDividerTag").style.color = "#FF5733"
                }else{
                    document.getElementById("sevenDayChangeDividerTitle").innerHTML = "7D % 🔺"
                    document.getElementById("sevenDayChangeDividerTag").style.color = "#99FF00"
                }

                document.getElementById("marketCapDividerTag").innerHTML = abbreviateNumber(parseInt(data["market_cap"], 10))
                document.getElementById("circulatingSupplyDividerTag").innerHTML = abbreviateNumber(parseInt(data["circulating_supply"], 10))
                document.getElementById("totalSupplyDividerTag").innerHTML = abbreviateNumber(parseInt(data["max_supply"], 10))
                document.getElementById("rankTag").innerHTML = "#" + data["cmc_rank"];
                document.getElementById("descriptionDividerTag").innerHTML = data["description"];
                document.getElementById("hideAll").style.display = "none";
            });
        })
        .catch((err) => {
            /* handle errors */
            console.log("ERROR on fetch request", err);
            document.getElementById("hideAll").style.display = "none";
            document.getElementById("titlePage").innerHTML = "☹️";
            document.getElementById("priceTag").innerHTML = "Aw man, an error popped up - \n" + " " + err;
            
        });
};

function CurrencyFormatted(amount) {
    if (amount > 99999.99999){
        amount = String(amount.toFixed(2));
        amount = amount.slice(0,3) + "," + amount.slice(3)
        return amount
    }
    else if (amount > 9999.99999){
        amount = String(amount.toFixed(2));
        amount = amount.slice(0,2) + "," + amount.slice(2)
        return amount
    }
    else if(amount > 0.009){
        return String(amount.toFixed(2));
    }else{
        return String(amount.toFixed(10));
    }
}

function abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "K", "M", "B","T"];
        var suffixNum = Math.floor( (""+value).length/3 );
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
    // var suffixes = ["", "k", "m", "b","t"];
    // var suffixNum = Math.floor((""+value).length/3);
    // var shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000,suffixNum)) : value).toPrecision(2));
    // if (shortValue % 1 != 0) {
    //     shortValue = shortValue.toFixed(1);
    // }
    // return shortValue+suffixes[suffixNum];
}

function buyOrSellIndicator(){
    return "Buy";
}