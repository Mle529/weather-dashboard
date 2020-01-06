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

var tempSearchHis = localStorage.getItem("storedHistory");
if (tempSearchHis != null)
    storedHistory = tempSearchHis.split(",");

// Search button click event
searchBtn.on("click", function () {

    currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchBar.val() + weatherKey;

    forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchBar.val() + weatherKey;

    $(".currentCast").empty();
    $(".forecast-head").empty();
    $("#fiveForecast").empty();

    generateCurrentWeather();
    generateForecast();
});

// Function and ajax call to the current weather
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

function generateForecast() {

    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)

        $("#fiveForecast").empty();
        $(".forecast-head").empty();
        $(".forecast-head")

        var forecastHead = $('<h5>5-Day Forecast:</h5>');
        $(".forecast-head").append(forecastHead);

        for (i = 0; i <= 4; i++) {
            console.log(i)

            var newDay = moment().add(1 + i, 'days').format('MM/DD/YYYY');
            var iconForecast = response.list[i].weather[0].icon;
            var iconImgURL = "http://openweathermap.org/img/w/" + iconForecast + ".png";
            var tempForecast = Math.round(response.list[i].main.temp);
            var humidityForecast = response.list[i].main.humidity;

            $("#fiveForecast")
                .append($("<div>").addClass("col-lg-2 days")
                    .append($("<p>").html(newDay))
                    .append($("<img src=" + iconImgURL + ">"))
                    .append($("<p>").html("Temp: " + tempForecast + " °F"))
                    .append($("<p>").html("Humidity: " + humidityForecast + "%")))

        }

    });

}

