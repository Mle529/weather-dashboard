// Varible for current date
var currentDate = moment().format('MM/DD/YYYY');

// This is the API key and key with imperial units
var APIKey = "3f57d1d0ccb27e3179f39171730967ec";
var weatherKey = "&units=imperial&APPID=3f57d1d0ccb27e3179f39171730967ec";

var searchBar = $("#search-bar");
var searchBtn = $("#search-btn");
var history = $("#history");
var currentCast = $(".currentCast");
var searchSaves = [];
var forecastURL;
var currentWeatherURL;

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

        //Stores the weather data 
        currentWeatherInfo = {
            location: response.name,
            date: currentDate,
            weatherIcon: response.weather[0].icon,
            temp: Math.round(response.main.temp),
            wind: response.wind.speed,
            humidity: response.main.humidity,
            uvIndex: 0,
            uvLevel: ""
        };

        // UV call
        var lat = response.coord.lat;
        var long = response.coord.lon;
        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&appid=" + APIKey;

        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (responseUV) {
            console.log(responseUV);
            currentWeatherInfo.uvIndex = responseUV.value;

            // This is the assign the UV levels
            if (currentWeatherInfo.uvIndex >= 8)
                currentWeatherInfo.uvLevel = "high";
            else if (currentWeatherInfo.uvIndex < 3)
                currentWeatherInfo.uvLevel = "low";
            else
                currentWeatherInfo.uvLevel = "medium";


            console.log(currentWeatherInfo);

            // This generates a card with all the weather data for the searched location (generates it .currentCast)
            var currentForecast = $('<div class="card"><div class="card-body"><h5 class="card-title">' + currentWeatherInfo.location + ' (' + currentWeatherInfo.date + ') ' +
                '<img id="weather-icon" src="http://openweathermap.org/img/wn/' + currentWeatherInfo.weatherIcon + '@2x.png"></h5>' +
                '<p class="card-text">Temperature: ' + currentWeatherInfo.temp + ' °F</p>' +
                '<p class="card-text">Humidity: ' + currentWeatherInfo.humidity + '%</p>' +
                '<p class="card-text">Wind Speed: ' + currentWeatherInfo.wind + ' MPH</p>' +
                '<p class="card-text">UV Index: <span class="badge badge-secondary ' + currentWeatherInfo.uvIndex + '">' + currentWeatherInfo.uvLevel + '</span>')
            $(".currentCast").append(currentForecast);

        });

    });
}

// function to get and generate a 5-day forecast
function generateForecast() {

    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)

        // This is generte the 5-Day header into .forecast-head
        var forecastHead = $('<h5>5-Day Forecast:</h5>');
        $(".forecast-head").append(forecastHead);

        // This for loop gets the 5-day forecast data after the API call
        for (i = 0; i <= 4; i++) {
            console.log(i)

            // It was easier to make the data into varibles then append it to #fiveForecast
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

