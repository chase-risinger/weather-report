var apiKey = "a1da61a2076b9999e91d055fc18c9db4"

// var address = document.getElementById("#address").value; make this a function later

var now = moment().format('MMMM Do YYYY');
var cityDisplayEl = document.querySelector("#city-display")
var prevCityButtonEl = document.querySelector("#city-buttons")
var dayList = document.querySelector('#day-list')
var day1El = document.querySelector("#day1")
var day2El = document.querySelector("#day2")
var day3El = document.querySelector("#day3")
var day4El = document.querySelector("#day4")
var day5El = document.querySelector("#day5")
var searchEl = document.querySelector("#address")
var searchBtnEl = document.querySelector(".search-btn")



var loadCities = function () {
    try {
        citiesArray = JSON.parse(localStorage.getItem("cities"));
        if (!citiesArray) { citiesArray = [] }
        citiesCounter = 0;
    }

    // if nothing in localStorage, create a new object to track all favorites
    catch {
        citiesArray = [];
        citiesCounter = 0;
    }
    if (citiesArray.length > 0) {
        citiesCounter = citiesArray.length
        for (i = 0; i < citiesArray.length; i++) {
            //console.log(favsArray)
            var cityButtonEl = document.createElement("btn");
            cityButtonEl.setAttribute('id', citiesArray[i])
            cityButtonEl.classList.add("btn")
            cityButtonEl.classList.add("btn-dark")
            cityButtonEl.classList.add("city-btn")
            cityButtonEl.innerText = citiesArray[i];
            prevCityButtonEl.appendChild(cityButtonEl)
        }
    }
};

var buttonClickHandler = function (event) {
    event.preventDefault();
    // get the language attribute from the clicked element
    var cityName = event.target.innerText;

    getLatLon(cityName);
};

searchBtnEl.addEventListener("click", (event) => {
    event.preventDefault();
    //get the city name
    var searchEl = document.querySelector("#address").value;
    citiesArray.push(searchEl);


    //save to local storage 
    localStorage.setItem("cities", JSON.stringify(citiesArray));
    getLatLon(searchEl)
})

var getLatLon = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {

                    var lat = (data['coord']['lat']);
                    var lon = (data['coord']['lon']);
                    getCityWeather(city, lat, lon);

                })
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to Weather API");
        });

}


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
                    var uvIndexJustNumber = data['current']['uvi'];
                    if (uvIndexJustNumber <= 2) {
                        var color = 'green'
                    }
                    else if (uvIndexJustNumber <= 7) {
                        var color = 'yellow'
                    }
                    else {
                        var color = 'red'
                    }
                    var weatherIcon = (data['current']['weather'][0]['icon'])
                    assembleDataCurr(curTemp, windSpeed, humidity, uvIndex, weatherIcon, color);

                    for (i = 1; i < 6; i++) {
                        var date = moment().add(i, "day").format("MMM D");
                        var fTemp = ("Temp: " + data['daily'][i]['temp']['day'] + "°F")
                        var fWind = ("Wind: " + data['daily'][i]['wind_speed'] + "MPH");
                        var fHumidity = ("Humidity: " + data['daily'][i]['humidity'] + "%");
                        var weatherIconDaily = (data['daily'][i]['weather'][0]['icon'])
                        assembleDataDaily(date, fTemp, fWind, fHumidity, i, weatherIconDaily)

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

var assembleDataCurr = function (curTemp, windSpeed, humidity, uvIndex, weatherIcon, color) {
    var currentWeatherList = [];
    currentWeatherList.push(curTemp);
    currentWeatherList.push(windSpeed);
    currentWeatherList.push(humidity);
    currentWeatherList.push(uvIndex);
    weatherIconEl = "<img src = 'http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png'>";
    console.log(color)

    currentWeatherList.push(weatherIconEl)
    dayList.innerHTML = "";


    for (var i = 0; i < currentWeatherList.length; i++) {
        var listItemEl = document.createElement("li");
        if (i == 3) {
            listItemEl.classList.add(color);
            console.log(listItemEl)
            listItemEl.textContent = currentWeatherList[i];
        }
        if (i == 4) {
            listItemEl.innerHTML = currentWeatherList[i]
        }
        else {
            listItemEl.textContent = currentWeatherList[i];
        }
        dayList.appendChild(listItemEl);

    }
}

var assembleDataDaily = function (date, fTemp, fWind, fHumidity, counter, weatherIconDaily) {
    var dailyWeatherList = [];
    dailyWeatherList.push(date);
    dailyWeatherList.push(fTemp);
    dailyWeatherList.push(fWind);
    dailyWeatherList.push(fHumidity);
    weatherIconDailyUrl = "<img src = 'http://openweathermap.org/img/wn/" + weatherIconDaily + "@2x.png'>";
    dailyImgIconEl = document.createElement("img")
    dailyImgIconEl.setAttribute('src', weatherIconDailyUrl)
    var elements = document.getElementsByClassName('forecast');
    for (var i = 1; i <= elements.length; i++) {
        if (i == counter) {
            elements[i - 1].innerHTML = "<h3>" + date + "</h3><p>" + fTemp + "</p><p>" + fWind + "</p><p>" + fHumidity + "</p><br>" + weatherIconDailyUrl



        }
    }
}





loadCities();
prevCityButtonEl.addEventListener("click", buttonClickHandler)


