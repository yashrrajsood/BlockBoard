function getTickerIdFromMap(ticker) {
    const axios = require('axios');

    let response = null;
    return new Promise(async(resolve, reject) => {
        try {
            response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map', {
                headers: {
                    'X-CMC_PRO_API_KEY': '165f3a64-8fa3-425a-8717-933738c927af',
                },
            });
        } catch (ex) {
            response = null;
            // error
            console.log(ex);
            reject(ex);
        }
        if (response) {
            // success
            const json = response.data;

            var tickerMap = json;
            var found = false;
            for (var i = 0; i < tickerMap['data'].length; i++) {
                if (ticker.toUpperCase() == tickerMap['data'][i]['symbol']) {
                    //console.log("Ticker found with ID: ", tickerMap['data'][i]['id'])
                    found = true;
                    resolve(tickerMap['data'][i]['id'])
                    break;
                }
            }
            if (found != true) {
                //console.log("Ticker not found in database: -1")
                resolve(-1)
            }
        }
    })
}

var tickerToSearch = "ET4H"
getTickerIdFromMap(tickerToSearch).then(function(res) {
    if (res != -1) {
        console.log(tickerToSearch + "'s CoinMarketCap ID is: " + res)
    }else{
        console.log("Ticker does not exist")
    }
})


// Function to get general information about the currency through APIs ==> https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest

// Function to get LOGO, description, socials through APIs ==> https://pro-api.coinmarketcap.com/v2/cryptocurrency/info

// Function to get currencies historical data through APIs ==> https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/historical