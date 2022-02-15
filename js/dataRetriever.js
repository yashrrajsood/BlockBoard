// Function to get CMC ID from ticker through APIs ==> https://pro-api.coinmarketcap.com/v1/cryptocurrency/map

function getTickerIdFromMap(ticker) {
    const axios = require("axios");

    let response = null;
    return new Promise(async (resolve, reject) => {
        try {
            response = await axios.get(
                "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map",
                {
                    headers: {
                        "X-CMC_PRO_API_KEY":
                            "165f3a64-8fa3-425a-8717-933738c927af",
                    },
                }
            );
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
            for (var i = 0; i < tickerMap["data"].length; i++) {
                if (ticker.toUpperCase() == tickerMap["data"][i]["symbol"]) {
                    //console.log("Ticker found with ID: ", tickerMap['data'][i]['id'])
                    found = true;
                    resolve(tickerMap["data"][i]["id"]);
                    break;
                }
            }
            if (found != true) {
                //console.log("Ticker not found in database: -1")
                resolve(-1);
            }
        }
    });
}

// Function to get general information about the currency through APIs ==> https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest

function getCoinGeneralInfo(id) {
    const axios = require("axios");

    let response = null;
    return new Promise(async (resolve, reject) => {
        try {
            response = await axios.get(
                "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
                {
                    headers: {
                        "X-CMC_PRO_API_KEY":
                            "165f3a64-8fa3-425a-8717-933738c927af",
                    },
                }
            );
        } catch (ex) {
            response = null;
            // error
            console.log(ex);
            reject(ex);
        }
        if (response) {
            // success
            const json = response.data;

            var returnedData = json;
            var found = false;
            for (var i = 0; i < returnedData["data"].length; i++) {
                if (id == returnedData["data"][i]["id"]) {
                    found = true;
                    //console.log(output);
                    //resolve(returnedData.data[i]["name"]);
                    resolve(returnedData["data"][i]);
                    break;
                }
            }
            if (found != true) {
                //console.log("Ticker not found in database: -1")
                resolve(-1);
            }
        }
    });
}

// Function to get LOGO, description, socials through APIs ==> https://pro-api.coinmarketcap.com/v2/cryptocurrency/info

function getCoinSecondaryInfo(id) {
    const axios = require("axios");

    let response = null;
    let apiURL = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?&id=" + String(id);
    return new Promise(async (resolve, reject) => {
        try {
            response = await axios.get(
                apiURL,
                {
                    headers: {
                        "X-CMC_PRO_API_KEY":
                            "165f3a64-8fa3-425a-8717-933738c927af",
                    },
                }
            );
        } catch (ex) {
            response = null;
            // error
            console.log("Error");
            reject(ex);
        }
        if (response) {
            // success
            const json = response.data;
            var returnedData = json;
            //console.log(returnedData.data)  
            resolve(returnedData.data[String(id)]); 
        }
    });
}

// Function to get currencies historical data through APIs ==> GET /v1/cryptocurrency/category

function getCoinHistoricalInfo(id) {}

// Tester

var tickerToSearch = "BTC";
getTickerIdFromMap(tickerToSearch).then(function (res) {
    if (res != -1) {
        //console.log(tickerToSearch + "'s CoinMarketCap ID is: " + res);
        var tickerIdToSearch = res;

        getCoinGeneralInfo(tickerIdToSearch).then(function (res2) {
            if (res2 != -1) {
                console.log(
                    res2["name"] + "'s General Data is: CMC ID: " + tickerIdToSearch + ", Ticker: " + res2["symbol"] + ", Max-Supply: " + 
                        res2["max_supply"] + ", Rank: " + res2["cmc_rank"] //+ " and some random test: " + res2["last_updated"]
                );
            } else {
                console.log("General info was not found :(");
            }
        });

        getCoinSecondaryInfo(tickerIdToSearch).then(function (res3){
            if (res3 != -1) {
                console.log("Description: " + res3["description"])
            }else{
                console.log("Secondary info was not found :(")
            }
        });


    } else {
        console.log("Ticker does not exist");
    }
});