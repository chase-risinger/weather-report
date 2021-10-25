var apiKey = "a1da61a2076b9999e91d055fc18c9db4"

// var address = document.getElementById("#address").value; make this a function later

var now = moment().format('MMMM Do YYYY');
var cityDisplayEl = document.querySelector("#city-display")
var cityButtonEl = document.querySelector("#city-buttons")
var dayList = document.querySelector('#day-list')
var day1El = document.querySelector("#day1")
var day2El = document.querySelector("#day2")
var day3El = document.querySelector("#day3")
var day4El = document.querySelector("#day4")
var day5El = document.querySelector("#day5")


var buttonClickHandler = function (event) {
    event.preventDefault();
    // get the language attribute from the clicked element
    var cityName = event.target.innerText;
    console.log(cityName)
    if (cityName == "Austin") {
        var lat = "30.26";
        var lon = "-97.74";
    }
    else if (cityName == "Chicago") {
        var lat = "41.87";
        var lon = "-87.63";
    }
    else if (cityName == "Atlanta") {
        var lat = "33.75";
        var lon = "-84.39";
    }
    else if (cityName == "Seattle") {
        var lat = "47.61";
        var lon = "-122.33";
    }
    else if (cityName == "Denver") {
        var lat = "39.74";
        var lon = "-104.99";
    }

    getCityWeather(cityName, lat, lon);
};


var getCityWeather = function (address, lat, lon) {
    cityDisplayEl.textContent = address + ": " + now


    // format the github api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;

    // make a get request to url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data)
                    var curTemp = ("Temp: " + data['current']['temp'] + "°F");
                    var windSpeed = ("Wind: " + data['current']['wind_speed'] + "MPH");
                    var humidity = ("Humidity: " + data['current']['humidity'] + "%");
                    var uvIndex = ("UV Index: " + data['current']['uvi']);
                    assembleDataCurr(curTemp, windSpeed, humidity, uvIndex)
                    for (i = 1; i < 6; i++) {
                        var date = moment().add(i, "day").format("MMM D");
                        var fTemp = ("Temp: " + data['daily'][i]['temp']['day'] + "°F")
                        var fWind = ("Wind: " + data['daily'][i]['wind_speed'] + "MPH");
                        var fHumidity = ("Humidity: " + data['daily'][i]['humidity'] + "%");
                        assembleDataDaily(date, fTemp, fWind, fHumidity, i)


                        console.log(date)
                    }
                })

            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to Weather API");
        });


};

var assembleDataCurr = function (curTemp, windSpeed, humidity, uvIndex) {
    var currentWeatherList = [];
    currentWeatherList.push(curTemp);
    currentWeatherList.push(windSpeed);
    currentWeatherList.push(humidity);
    currentWeatherList.push(uvIndex);
    dayList.innerHTML = "";


    for (var i = 0; i < currentWeatherList.length; i++) {
        var listItemEl = document.createElement("li");
        listItemEl.textContent = currentWeatherList[i];
        dayList.appendChild(listItemEl);

    }
}

var assembleDataDaily = function (date, fTemp, fWind, fHumidity, counter) {
    var dailyWeatherList = [];
    dailyWeatherList.push(date);
    dailyWeatherList.push(fTemp);
    dailyWeatherList.push(fWind);
    dailyWeatherList.push(fHumidity);
    var elements = document.getElementsByClassName('forecast');
    for (var i = 1; i <= elements.length; i++) {
        if (i == counter) {
            elements[i - 1].innerHTML = "<h3>" + date + "</h3><p>" + fTemp + "</p><p>" + fWind + "</p><p>" + fHumidity + "</p>"



        }
    }
}






cityButtonEl.addEventListener("click", buttonClickHandler)


