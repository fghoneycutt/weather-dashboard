var searchBtn = document.getElementById("searchBtn");
var searches = [];

function search(searchVal){
    getWeather(searchVal);
    createSaveButtons(searchVal);
}

function getWeather(searchVal){
    //location api receives lat and lon, plugs them into weather API, which for some reason only takes lat and lon and not location
    var locationApiUrl =
      "http://open.mapquestapi.com/geocoding/v1/address?key=kKR5YQEn8QmWD5fSh9nqAfyD1jOJe5VZ&location=" +
      searchVal;
    fetch(locationApiUrl).then(function(response){
        response.json().then(function(data){
            var lat = data.results[0].locations[0].displayLatLng.lat;
            var lon = data.results[0].locations[0].displayLatLng.lng;
            var weatherApiUrl =
              "https://api.openweathermap.org/data/2.5/onecall?lat=" +
              lat +
              "&lon=" +
              lon +
              "&units=imperial&appid=4852546d34bdfbce6e737eb8f7262605";
            fetch(weatherApiUrl).then(function(response){
                response.json().then(function(data){
                    // figure out an error message if invalid
                    // if (data.count == 0){
                    //     window.alert("Invalid city, please try again.");
                    // }
                    displayWeather(data, searchVal);
                })
            })
        })
    })
}

function displayWeather(data, city){
    var div = document.getElementById("weather-data");
    div.innerHTML = "";
    var temp = data.current.temp;
    var wind = data.current.wind_speed;
    var humidity = data.current.humidity;
    var uvi = data.current.uvi;
    city = prettyName(city);
    var today = document.createElement("div");
    today.setAttribute("id", "today-weather")
    today.classList.add("border", "border-dark")
    div.appendChild(today);
    var h2El = document.createElement("h2");
    var thisDay = new Date();
    var date = "(" +
      (thisDay.getMonth() +
      1) +
      "/" +
      thisDay.getDate() +
      "/" +
      thisDay.getFullYear() + ")"
    h2El.textContent = city + " " + date;
    today.appendChild(h2El);
    var tempEl = document.createElement("h3")
    tempEl.textContent = "Temp: " + temp + "\u00B0 F";
    today.appendChild(tempEl);
    var windEl = document.createElement("h3")
    windEl.textContent = "Wind: " + wind + " mph";
    today.appendChild(windEl);
    var humidityEl = document.createElement("h3")
    humidityEl.textContent = "Humidity: " + humidity + "%";
    today.appendChild(humidityEl);
    var uviEl = document.createElement("h3")
    uviEl.textContent = "UV Index: " + uvi;
    today.appendChild(uviEl);
    displayForecast(data);
}

function displayForecast(data){
    console.log("reached forecast function");
}

//function to make the input city name uniform for display
function prettyName(string) {
    string = string.toLowerCase();
    string = string.split(" ");
    for (var i = 0; i < string.length; i++){
        string[i] = string[i][0].toUpperCase()+ string[i].substr(1);
    }
    string = string.join(" ");
    return string;
}

//create history buttons after search
function createSaveButtons(searchVal){
    if (!searches.includes(searchVal)){
        searches.push(searchVal);
        var btn = document.createElement("button");
        btn.classList = "btn btn-secondary"
        searchVal = prettyName(searchVal);
        btn.textContent = searchVal;
        var searchArea = document.getElementById("search-area");
        searchArea.appendChild(btn);
        btn.addEventListener("click", searchFromSave);
    }
    console.log(searches);
}

function searchFromSave(){
    var searchVal = this.textContent;
    search(searchVal);
}

function captureSearchVal(){
    var searchVal = document.getElementById("input").value;
    document.getElementById("input").value = "";
    search(searchVal);
}

searchBtn.addEventListener("click", captureSearchVal)
