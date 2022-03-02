const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000
app.use(cors());

var data_to_save = {
    "name" : null,
    "ticker": null,
    "max_supply": null,
    "circulating_supply": null,
    "description": null,
    "price": null,
    "cmc_rank": null,
    "logo": null,
    "percent_change_1h": null,
    "percent_change_24h": null,
    "percent_change_7d": null,
    "percent_change_30d": null,
    "market_cap": null
}

var sample_data = {
    circulating_supply: 13123230,
    cmc_rank: 1,
    description: "Bitcoin (BTC) is a cryptocurrency . Users are able to generate BTC through the process of mining. Bitcoin has a current supply of 18,962,493. The last known price of Bitcoin is 40,295.73276291 USD and is down -1.12 over the last 24 hours. It is currently trading on 9168 active market(s) with $21,888,043,886.56 traded over the last 24 hours. More information can be found at https://bitcoin.org/."
    ,max_supply: 21000000
    ,name: "Bitcoin"
    ,percent_change_1h: -0.14056561
    ,percent_change_7d: 4.57531657
    ,percent_change_24h: -1.11798969
    ,percent_change_30d: -4.07603769
    ,price: 40295.732762907595
    ,ticker: "BTC"
    ,logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"
    ,market_cap: 728326680331.4109
}

app.get('/', (req, res) => {
  res.send('Server running as per normal.')
})

app.get('/coinTEST/:coinID', (req, response) => {
    response.send(sample_data)
    console.log("Sent Sample Data for", req.params["coinID"])
})

app.get('/coin/:coinID', (req, response) => {
    console.log("REAL Coin Information to Search: ",req.params["coinID"])
    getTickerIdFromMap(req.params["coinID"]).then(function (res) {
        if (res != -1) {
            //console.log(tickerToSearch + "'s CoinMarketCap ID is: " + res);
            var tickerIdToSearch = res;
            //console.log("========================== DATA RECEIVED ==========================")
            console.log(" ")
            Promise.all([getCoinGeneralInfo(tickerIdToSearch), getCoinSecondaryInfo(tickerIdToSearch), getCoinLatestInfo(tickerIdToSearch)]).then((values) => {
                if(values[0] != -1 && values[1] != -1 && values[2] != -1){
                    data_to_save["name"] = values[0]["name"];
                    data_to_save["ticker"] = values[0]["symbol"];
                    data_to_save["max_supply"] = values[0]["max_supply"]
                    data_to_save["circulating_supply"] = values[0]["circulating_supply"]
                    data_to_save["cmc_rank"] = values[0]["cmc_rank"];
                    data_to_save["description"] = values[1]["description"]
                    data_to_save["logo"] = values[1]["logo"]
                    data_to_save["price"] = values[2]["quote"]["USD"]["price"]
                    data_to_save["percent_change_1h"] = values[2]["quote"]["USD"]["percent_change_1h"]
                    data_to_save["percent_change_24h"] = values[2]["quote"]["USD"]["percent_change_24h"]
                    data_to_save["percent_change_7d"] = values[2]["quote"]["USD"]["percent_change_7d"]
                    data_to_save["percent_change_30d"] = values[2]["quote"]["USD"]["percent_change_30d"]
                    data_to_save["market_cap"] = values[2]["quote"]["USD"]["market_cap"]
                    
                    //console.log(data_to_save)
                }
                console.log("Data for " + values[0]["name"] + " sent!")
                //console.log(values);
                response.send(data_to_save)
                //response.send("Ok soldier")
            }).catch((reason) => {
                console.log(reason);
            });
        } else {
            console.log("Error: Unable to retrieve Data");
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



