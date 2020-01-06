// Varible for current date
var currentDate = moment().format('MM/DD/YYYY');

// This is the API key and key with imperial units
var APIKey = "3f57d1d0ccb27e3179f39171730967ec";
var weatherKey = "&units=imperial&APPID=3f57d1d0ccb27e3179f39171730967ec";

var searchBar = $("#search-bar");
var searchBtn = $("#search-btn");
var searchHis = $("#searchHistor");
var currentCast = $(".currentCast");
var storedHistory = [];
var forecastURL;
var currentWeatherURL;


searchBtn.on("click", function () {

    currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchBar.val() + weatherKey;

    forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchBar.val() + weatherKey;

    $(".currentCast").empty();
    $(".forecast-head").empty();
    $(".fiveDayForecast").empty();

    generateCurrentWeather();
});


function generateCurrentWeather() {
    $.ajax({
        url: currentWeatherURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        currentWeatherInfo = {
            location: response.name,
            date: currentDate,
            weatherIcon: response.weather[0].icon,
            temp: Math.round(response.main.temp),
            wind: response.wind.speed,
            humidity: response.main.humidity,
            uvIndex: 0
        };

        var lat = response.coord.lat;
        var long = response.coord.lon;
        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&appid=" + APIKey;

        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (responseUV) {
            console.log(responseUV);
            currentWeatherInfo.uvIndex = responseUV.value;
        });

        console.log(currentWeatherInfo);

        var currentForecast = $('<div class="card"><div class="card-body"><h5 class="card-title">' + currentWeatherInfo.location + ' (' + currentWeatherInfo.date + ') ' +
            '<img id="weather-icon" src="http://openweathermap.org/img/wn/' + currentWeatherInfo.weatherIcon + '@2x.png"></h5>' +
            '<p class="card-text">Temperature: ' + currentWeatherInfo.temp + ' °F</p>' +
            '<p class="card-text">Humidity: ' + currentWeatherInfo.humidity + '%</p>' +
            '<p class="card-text">Wind Speed: ' + currentWeatherInfo.wind + ' MPH</p>' +
            '<p class="card-text">UV Index: ' + currentWeatherInfo.uvIndex + '</p>')
        $(".currentCast").append(currentForecast);

    });
}




