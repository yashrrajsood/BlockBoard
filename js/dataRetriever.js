const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Bitcoin is a cryptocurrency')
})

app.get('/coin/:coinID', (req, response) => {
    getTickerIdFromMap(req.params["coinID"]).then(function (res) {
        if (res != -1) {
            //console.log(tickerToSearch + "'s CoinMarketCap ID is: " + res);
            var tickerIdToSearch = res;
            console.log("========================== DATA RECEIVED ==========================")
            console.log(" ")
            Promise.all([getCoinGeneralInfo(tickerIdToSearch), getCoinSecondaryInfo(tickerIdToSearch), getCoinLatestInfo(tickerIdToSearch)]).then((values) => {
                //console.log(values[2]);
                if(values[0] != -1 && values[1] != -1 && values[2] != -1){
                    data_to_save["name"] = values[0]["name"];
                    data_to_save["ticker"] = values[0]["symbol"];
                    data_to_save["max_supply"] = values[0]["max_supply"]
                    data_to_save["circulating_supply"] = values[0]["circulating_supply"]
                    data_to_save["cmc_rank"] = values[0]["cmc_rank"];
                    data_to_save["description"] = values[1]["description"]
                    data_to_save["price"] = values[2]["quote"]["USD"]["price"]
                    data_to_save["percent_change_1h"] = values[2]["quote"]["USD"]["percent_change_1h"]
                    data_to_save["percent_change_24h"] = values[2]["quote"]["USD"]["percent_change_24h"]
                    data_to_save["percent_change_7d"] = values[2]["quote"]["USD"]["percent_change_7d"]
                    data_to_save["percent_change_30d"] = values[2]["quote"]["USD"]["percent_change_30d"]
                    //console.log(data_to_save)
                }
                console.log("Data sent!")
                response.send('Coin Price: ' + data_to_save["price"])
            }).catch((reason) => {
                console.log(reason);
            });
        } else {
            console.log("Ticker does not exist");
        }
        
    });

  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

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

// Function to get currencies latest data through APIs ==> https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest

function getCoinLatestInfo(id) {
    const axios = require("axios");

    let response = null;
    let apiURL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
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
            const json = response;
            var returnedData = json;
            var found = false;
            for (var i = 0; i < returnedData.data.data.length; i++) {
                if (id == returnedData.data.data[i]["id"]) {
                    found = true;
                    //console.log(output);
                    //resolve(returnedData.data[i]["name"]);
                    //console.log(returnedData.data.data[i])
                    resolve(returnedData.data.data[i]);
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

// Save as JSON to provide to the Frontend

var tickerToSearch = "DOT";

var data_to_save = {
    "name" : null,
    "ticker": null,
    "max_supply": null,
    "circulating_supply": null,
    "description": null,
    "price": null,
    "cmc_rank": null,
    "percent_change_1h": null,
    "percent_change_24h": null,
    "percent_change_7d": null,
    "percent_change_30d": null
}

// getTickerIdFromMap(tickerToSearch).then(function (res) {
//     if (res != -1) {
//         //console.log(tickerToSearch + "'s CoinMarketCap ID is: " + res);
//         var tickerIdToSearch = res;
//         console.log("========================== DATA RECEIVED ==========================")
//         console.log(" ")
//         Promise.all([getCoinGeneralInfo(tickerIdToSearch), getCoinSecondaryInfo(tickerIdToSearch), getCoinLatestInfo(tickerIdToSearch)]).then((values) => {
//             //console.log(values[2]);
//             if(values[0] != -1 && values[1] != -1 && values[2] != -1){
//                 data_to_save["name"] = values[0]["name"];
//                 data_to_save["ticker"] = values[0]["symbol"];
//                 data_to_save["max_supply"] = values[0]["max_supply"]
//                 data_to_save["circulating_supply"] = values[0]["circulating_supply"]
//                 data_to_save["cmc_rank"] = values[0]["cmc_rank"];
//                 data_to_save["description"] = values[1]["description"]
//                 data_to_save["price"] = values[2]["quote"]["USD"]["price"]
//                 data_to_save["percent_change_1h"] = values[2]["quote"]["USD"]["percent_change_1h"]
//                 data_to_save["percent_change_24h"] = values[2]["quote"]["USD"]["percent_change_24h"]
//                 data_to_save["percent_change_7d"] = values[2]["quote"]["USD"]["percent_change_7d"]
//                 data_to_save["percent_change_30d"] = values[2]["quote"]["USD"]["percent_change_30d"]
//                 console.log(data_to_save)
//             }
//         }).catch((reason) => {
//             console.log(reason);
//         });
//     } else {
//         console.log("Ticker does not exist");
//     }
// });



