// const e = require("express");

var colorTheme = "dark"
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
let TICKER_CODE = params.code;

window.onload = function what() {
    refreshAllData();
};

function refreshAllData(){
    fetch("http://localhost:3000/coin/" + String(TICKER_CODE))
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

                var myChart = echarts.init(document.getElementById('buySellGauge'));
                var chartValue = buyOrSellIndicator(data["percent_change_1h"], data["percent_change_24h"], data["percent_change_7d"]);
                // Specify the configuration items and data for the chart
                option = {
                    series: [
                    {
                        type: 'gauge',
                        startAngle: 180,
                        endAngle: 0,
                        min: 0,
                        max: 1,
                        splitNumber: 8,
                        axisLine: {
                        lineStyle: {
                            width: 6,
                            color: [
                            [0.45, '#FF6E76'],
                            [0.55, '#FDDD60'],
                            [1, '#7CFFB2']
                            ]
                        }
                        },
                        pointer: {
                        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                        length: '12%',
                        width: 20,
                        offsetCenter: [0, '-60%'],
                        itemStyle: {
                            color: 'auto'
                        }
                        },
                        axisTick: {
                        length: 12,
                        lineStyle: {
                            color: 'auto',
                            width: 2
                        }
                        },
                        splitLine: {
                        length: 20,
                        lineStyle: {
                            color: 'auto',
                            width: 5
                        }
                        },
                        axisLabel: {
                        color: 'white',
                        fontSize: 20,
                        distance: -60,
                        formatter: function (value) {
                            return '';
                        }
                        },
                        title: {
                        offsetCenter: [0, '-40%'],
                        fontSize: 20
                        },
                        detail: {
                        fontSize: 20,
                        offsetCenter: [0, '-20%'],
                        valueAnimation: true,
                        formatter: function (value) {
                            return chartValue[0];
                        },
                        color: 'auto'
                        },
                        data: [
                        {
                            value: chartValue[1],
                            name: 'Indicator'
                        }
                        ]
                    }
                    ]
                };
                // Display the chart using the configuration items and data just specified.
                myChart.setOption(option);

                var myChart2 = echarts.init(document.getElementById('buySellGauge2'));

                const spirit = 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'
                var maxData = 2000;
                option2 = {
                tooltip: {},
                xAxis: {
                    max: maxData,
                    splitLine: { show: false },
                    offset: 10,
                    axisLine: {
                    lineStyle: {
                        color: 'white'
                    }
                    },
                    axisLabel: {
                    margin: 10
                    }
                },
                yAxis: {
                    data: ['2022', '2021', '2020', '2019'],
                    inverse: true,
                    axisTick: { show: false },
                    axisLine: { show: false },
                    axisLabel: {
                    margin: 10,
                    color: 'white',
                    fontSize: 16
                    }
                },
                grid: {
                    top: 'center',
                    height: 200,
                    left: 70,
                    right: 100
                },
                series: [
                    {
                    // current data
                    type: 'pictorialBar',
                    symbol: spirit,
                    symbolRepeat: 'fixed',
                    symbolMargin: '5%',
                    symbolClip: true,
                    symbolSize: 30,
                    symbolBoundingData: maxData,
                    data: [891, 1220, 660, 1670],
                    markLine: {
                        symbol: 'none',
                        label: {
                        formatter: 'max: {c}',
                        position: 'start'
                        },
                        lineStyle: {
                        color: 'green',
                        type: 'dotted',
                        opacity: 0.2,
                        width: 2
                        },
                        data: [
                        {
                            type: 'max'
                        }
                        ]
                    },
                    z: 10
                    },
                    {
                    // full data
                    type: 'pictorialBar',
                    itemStyle: {
                        opacity: 0.2
                    },
                    label: {
                        show: true,
                        formatter: function (params) {
                        return ((params.value / maxData) * 100).toFixed(1) + ' %';
                        },
                        position: 'right',
                        offset: [10, 0],
                        color: 'white',
                        fontSize: 18
                    },
                    animationDuration: 0,
                    symbolRepeat: 'fixed',
                    symbolMargin: '5%',
                    symbol: spirit,
                    symbolSize: 30,
                    symbolBoundingData: maxData,
                    data: [891, 1220, 660, 1670],
                    z: 5
                    }
                ]
                };
                myChart2.setOption(option2);

                dragula([document.querySelector('#mainMegaDivider')]);
                
            });
        })
        .catch((err) => {
            /* handle errors */
            console.log("ERROR on fetch request", err);
            document.getElementById("hideAll").style.display = "none";
            document.getElementById("titlePage").innerHTML = "☹️";   
        })
}

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

function buyOrSellIndicator(oneHour, twentyFourHour, sevenDay){
    
    var buyChance = 0;
    var sellChance = 0;
    
    if (oneHour > 0){
        buyChance += 0.5;
    }else{
        sellChance += 0.5;
    }
    if (twentyFourHour > 0){
        buyChance += 0.5;
    }else{
        sellChance += 0.5;
    }
    if (sevenDay > 0){
        buyChance += 1;
    }else{
        sellChance += 1;
    }
    var numberToReturn;
    var stringToReturn;
    
    if (buyChance > sellChance){
        numberToReturn = getRandomInt(0.56, 1.0)
    }else if(buyChance < sellChance){
        numberToReturn = getRandomInt(0, 0.45)
    }else{
        numberToReturn = 0.5;
        stringToReturn = "Neutral"
    }

    if(numberToReturn >= 0.56 && numberToReturn <= 0.75){
        stringToReturn = "Buy"
    }else if(numberToReturn > 0.75){
        stringToReturn = "Strong Buy";
    }else if(numberToReturn > 0.25 && numberToReturn <= 0.45){
        stringToReturn = "Sell";
    }else if(numberToReturn <= 0.25){
        stringToReturn = "Strong Sell";
    }
    console.log([stringToReturn, numberToReturn])
    return [stringToReturn, numberToReturn];
}

function getRandomInt(min, max) {
    return Math.random() * (max - min) + min
}

function darkModeToggleButton(){
    let root = document.documentElement;
    if(colorTheme == "dark"){
        root.style.setProperty('--tintBackGroundColor', "#EFFFFD");
        root.style.setProperty('--tintBackGroundColorFooter', "#85F4FF");
        root.style.setProperty('--dividerColor', "#B8FFF9");
        root.style.setProperty('--fontColorsInter', "#333333")
        document.getElementById("darkModeToggleButton").src = "Images/setTo_Dark.png"
        colorTheme = "light";
        console.log("color theme set to light");
    }else if (colorTheme == "light"){
        root.style.setProperty('--tintBackGroundColor', "#041C32");
        root.style.setProperty('--tintBackGroundColorFooter', "#064663");
        root.style.setProperty('--dividerColor', "#04293A");
        root.style.setProperty('--fontColorsInter', "white")
        document.getElementById("darkModeToggleButton").src = "Images/setTo_Light.png"
        colorTheme = "dark";
        console.log("color theme set to dark");
    }
}

function accessWallet(){
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask available');
        ethereum.request({ 
            method: 'eth_requestAccounts'
        }).catch(error => alert("Sorry, An Error Occured: " + error.message));
    }else{
        console.log("No wallets available");
    }
}
