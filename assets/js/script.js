var apiKey = "a1da61a2076b9999e91d055fc18c9db4"

// var address = document.getElementById("#address").value; make this a function later

var now = moment().format('MMMM Do YYYY');
var cityDisplayEl = document.querySelector("#city-display")
var cityButtonEl = document.querySelector("#city-buttons")
var dayList = document.querySelector('#day-list')


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
                    var curTemp = ("Temp: " + data['current']['temp'] + "°F");
                    var windSpeed = ("Wind: " + data['current']['wind_speed'] + "MPH");
                    var humidity = ("Humidity: " + data['current']['humidity'] + "%");
                    var uvIndex = ("UV Index: " + data['current']['uvi']);
                    assembleDataCurr(curTemp, windSpeed, humidity, uvIndex)
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
    console.log(currentWeatherList);
    dayList.innerHTML = "";


    for (var i = 0; i < currentWeatherList.length; i++) {
        console.log(currentWeatherList[i])
        var listItemEl = document.createElement("li");
        listItemEl.textContent = currentWeatherList[i];
        dayList.appendChild(listItemEl);

    }
}



cityButtonEl.addEventListener("click", buttonClickHandler)
// getCityWeather(address)

