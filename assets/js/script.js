var searchBtn = document.getElementById("searchBtn");
var searches = [];

function search(searchVal){
    getWeather(searchVal);
    searchVal = prettyName(searchVal);
    saveSearches();
}

function getWeather(searchVal){
    searchVal = searchVal.trim();
    var locationApiUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" + searchVal + "&units=imperial&appid=4852546d34bdfbce6e737eb8f7262605"
    fetch(locationApiUrl).then(function(response){
        response.json().then(function(data){
            if (data.cod === "404"){
                window.alert("Invalid city, please try again");
                return;
            }
            searchVal = prettyName(searchVal);
            createSaveButtons(searchVal);
            var lat = data.coord.lat;
            var lon = data.coord.lon;
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
    var icon = data.current.weather[0].icon;
    var iconEl = document.createElement("img")
    iconEl.src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    h2El.appendChild(iconEl);
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
    today.appendChild(uviEl);
    uviEl.innerHTML ="<p>UV Index: <span id='highlight'>" + uvi + "</span></p>";
    var highlight = document.getElementById("highlight");
    if (uvi <= 2){
        highlight.classList.add("favorable");
    } else if (uvi <= 5){
        highlight.classList.add("moderate");
    } else {
        highlight.classList.add("severe");
    }
    displayForecast(data);
}

function displayForecast(data){
    var weatherData = document.getElementById("weather-data");
    var forecast = document.createElement("div");
    forecast.setAttribute("id", "forecast");
    var text = document.createElement("h2");
    text.textContent = "5-Day Forecast:"
    weatherData.appendChild(text);
    weatherData.appendChild(forecast);
    for (var i = 0; i < 5; i++){
        var today = new Date();
        var newDay = new Date(today)
        newDay.setDate(newDay.getDate() + (i + 1));
        var date =
          (newDay.getMonth() + 1) +
          "/" +
          newDay.getDate() +
          "/" +
          newDay.getFullYear();
        var temp = data.daily[i].temp.day;
        var wind = data.daily[i].wind_speed;
        var humidity = data.daily[i].humidity;
        var icon = data.daily[i].weather[0].icon;
        var iconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
        var cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", "card");
        cardDiv.setAttribute("style", "width: 15rem;")
        cardDiv.innerHTML =
          "<div class='card-body'><h5 class='card-title'>" +
          date +
          "<br><img src='" +
          iconUrl + 
          "'></h5><p class='card-text'>Temp: " +
          temp +
          "\u00B0 F <br>Wind: " +
          wind +
          " MPH <br>Humidity: "+
          humidity + 
          "%</p> </div>";
        forecast.appendChild(cardDiv);

    }
    console.log(data);
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
    searchVal = searchVal.trim();
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
}

//create history buttons on load
function createHistoryButtons(){
    for (var i = 0; i < searches.length; i++){
        var btn = document.createElement("button");
        btn.classList = "btn btn-secondary";
        btn.textContent = searches[i];
        var searchArea = document.getElementById("search-area");
        searchArea.appendChild(btn);
        btn.addEventListener("click", searchFromSave);
    }
}

function saveSearches(){
    localStorage.setItem("searches", JSON.stringify(searches)
    );
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

function loadSearches() {
    var saved = localStorage.getItem("searches");     
    saved = JSON.parse(saved);     
    if (saved){         
        searches = saved;         
    } else {
        searches = [];
    }
    createHistoryButtons();
}


searchBtn.addEventListener("click", captureSearchVal);
loadSearches();
