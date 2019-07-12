/* *************************************
*  Weather Site JavaScript Functions
************************************* */

// Calculate the Windchill
function buildWC(speed, temp){
    const feelTemp = document.getElementById('feelTemp');

    // Compute the windchill
    let wc = 35.74 + 0.6215 * temp - 35.75 * Math.pow(speed, 0.16) + 0.4275 * temp * Math.pow(speed, 0.16);
    console.log(wc);

    // Round the answer down to integer
    wc = Math.floor(wc);

    // If chill is greater than temp, return the temp
    wc = (wc > temp)?temp:wc;

    // Display the windchill
    console.log(wc);
    wc = 'Feels like ' + wc + '&deg;F';
    return wc;
}

// Wind Dial Function
function windDial(direction){
    // Get the wind dial container
    const dial = document.getElementById("dial");
    // Determine the dial class
    switch (direction){
        case "North":
        case "N":
        dial.setAttribute("class", "n"); //"n" is the CSS rule selector
        break;
        case "NE":
        case "NNE":
        case "ENE":
        dial.setAttribute("class", "ne");
        break;
        case "NW":
        case "NNW":
        case "WNW":
        dial.setAttribute("class", "nw");
        break;
        case "South":
        case "S":
        dial.setAttribute("class", "s");
        break;
        case "SE":
        case "SSE":
        case "ESE":
        dial.setAttribute("class", "se");
        break;
        case "SW":
        case "SSW":
        case "WSW":
        dial.setAttribute("class", "sw");
        break;
        case "East":
        case "E":
        dial.setAttribute("class", "e");
        break;
        case "West":
        case "W":
        dial.setAttribute("class", "w");
        break;
    }
}

// Get Condition Function
function getCondition(phrase){
    let input = phrase;
    switch (input){
        case "clear":
        case "Clear":
        case "Nothing":
            input = "Clear";
            break;
        case "Cloudy":
        case "cloudy":
        case "Clouds":
        case "clouds":
        case "Partly Cloudy":
        case "partly cloudy":
        case "Partly cloudy":
            input = "Clouds";
            break;
        case "Fog":
        case "fog":
        case "Foggy":
        case "fog":
            input = "Fog";
            break;
        case "Rain":
        case "rain":
        case "Rainy":
        case "rainy":
        case "Thunderstorms":
            input = "Rain";
            break;
        case "snow":
        case "Snow":
        case "snowy":
        case "Snowy":
            input = "Snow";
            break;
    }
    console.log(input);
    return input; 
}

function changeSummaryImage(weather){
    // Get the picture container
    const weatherPic = document.getElementById("weatherPic");
    const curWeather = document.getElementById("curWeather");
    switch(weather){
        case "Clear":
        weatherPic.setAttribute("class", "clear");
        curWeather.setAttribute("class", "clear");
        break;
        case "Clouds":
        weatherPic.setAttribute("class", "cloudy");
        curWeather.setAttribute("class", "cloudy");
        break;
        case "Fog":
        weatherPic.setAttribute("class", "fog");
        curWeather.setAttribute("class", "fog");
        break;
        case "Rain":
        weatherPic.setAttribute("class", "rain");
        curWeather.setAttribute("class", "rain");
        break;
        case "Snow":
        weatherPic.setAttribute("class", "snow");
        curWeather.setAttribute("class", "snow");
        break;
    }
}   

function convertMeters(meters){
    feet = Math.floor(meters * 3.28);
    return feet;
}

// Convert hours into 12 hour format
function time_format(hour){
    if(hour > 23){
        hour -= 24;
    }
    let amPM = (hour > 11) ? "pm" : "am";
    if(hour > 12){
        hour -= 12;
    }
    if(hour == 0){
        hour = "12";
    }
    return hour + amPM;
}

console.log("test");

// Build the hourly temperature list
function buildHourlyData(nextHour, hourlyTemps) {
    // Data comes from a JavaScript object of hourly temp name - value pairs
    // Next hour should have a value between 0-23
    // The hourlyTemps variable holds an array of temperatures
    // Line 8 builds a list item showing the time for the next hour 
    // and then the first element (value in index 0) from the hourly temps array
    let hourlyListItems = '<li>' + time_format(nextHour) + ': ' + hourlyTemps[0] + '&deg;F</li>' + "  |  ";
    // Build the remaining list items using a for loop
    for (let i = 1, x = hourlyTemps.length; i < x; i++) {
        hourlyListItems += '<li>' + time_format(nextHour+i) + ': ' + hourlyTemps[i] + '&deg;F</li>' + "  |  ";
    }
    // console.log('HourlyList is: ' +hourlyListItems);
    return hourlyListItems;
    }



// Set global variable for custom header required by NWS API
var idHeader = {
    headers: {
        "User-Agent": "Student Learning Project - mar18016@byui.edu"
    }
};

// Local Storage variable
let storage = window.localStorage;

// Gets location information from the NWS API
function getLocation(locale){
    const URL = "https://api.weather.gov/points/" + locale;
    // NWS User-Agent header is second parameter

    // Fetch fucntion
    fetch(URL, idHeader)
        .then(function(response){
            if(response.ok){
                return response.json();
            }
            throw new Error("Response not OK.");
        })
        .then(function(data) {
            // Check 
            console.log("Json object from getLocation function: ");
            console.log(data);
            // Store in localstorage
            storage.setItem("locName", data.properties.relativeLocation.properties.city);
            storage.setItem("locState", data.properties.relativeLocation.properties.state);
            
            // Get link to hourly data
            let hourlyLink = data.properties.forecastHourly;
            getHourly(hourlyLink);

            // Get link to forecast
            let forecastURL = data.properties.forecast;
            getForecast(forecastURL);

            // Get link to weather station ID
            let stationsURL = data.properties.observationStations;
            // Call getStationId function
            getStationID(stationsURL);
        })
        .catch(error => console.log("There was a getLocation error: ", error))
}

// Gets weather station list and finds ID
function getStationID(stationsURL){
    fetch(stationsURL, idHeader)
    .then(function(response){
        if(response.ok){
            return response.json();
        }
        throw new Error("Response not OK.");
    })
    .then(function(data){
        // Check collected data
        console.log("From getStationId function:");
        console.log(data);
    

    // Store station ID and elevation
    let stationId = data.features[0].properties.stationIdentifier;
    let stationElevation = data.features[0].properties.elevation.value;
    // Check
    console.log("Station and Elevation are " + stationId, stationElevation);

    // Data to localstorage
    storage.setItem("stationId", stationId);
    storage.setItem("stationElevation", stationElevation);

    // Request current weather for specific station
    getWeather(stationId);
    })
    .catch(error => console.log("There was a getStationId error: ", error))
}

// Gets current weather information for specific station
function getWeather(stationId){
    // Url for current observation data
    const URL = "https://api.weather.gov/stations/" + stationId + "/observations/latest";
    
    fetch(URL, idHeader)
    .then(function(response){
        if(response.ok){
            return response.json();
        }
        throw new ERROR("Response not OK.");
    })
    .then(function(data){
        // Check data
        console.log("From getWeather function:");
        console.log(data);

        // Store weather information 
        let curWeather = data.properties.textDescription;
        let windGust = data.properties.windGust.value;

        // Local storage
        storage.setItem("curWeather", curWeather);
        storage.setItem("windGust", windGust);
    })
    .catch(error => console.log("There was a getWeather error: ", error))
}

function getHourly(hourlyLink){
    fetch(hourlyLink, idHeader)
        .then(function(response){
            if(response.ok){
                return response.json();
            }
            throw new Error("Response not OK.");
        })
        .then(function(data) {
            // Check 
            console.log("Json object from getHourly function: ");
            console.log(data);

            // Store Hourly Information
            let hourly = [];

            for (let i = 0; i < 13; i++){
                hourly[i] = data.properties.periods[i].temperature;
            }
            
            // Get Wind Direction
            let windDirection = data.properties.periods[0].windDirection;
            let windSpeed = data.properties.periods[0].windSpeed;
            let temperature = data.properties.periods[0].temperature;

            // Local Storage
            storage.setItem("hourly", hourly);
            storage.setItem("windDirection", windDirection);
            storage.setItem("windSpeed", windSpeed);
            storage.setItem("temperature", temperature);
        })
        .catch(error => console.log("There was a getHourly error: ", error))
}

function getForecast(forecastURL){
    fetch(forecastURL, idHeader)
        .then(function(response){
            if(response.ok){
                return response.json();
            }
            throw new Error("Response not OK.");
        })
        .then(function(data) {
            // Check 
            console.log("Object from getForecast function: ");
            console.log(data);

            // Store Forecast information
            let high = data.properties.periods[0].temperature;
            let low = data.properties.periods[1].temperature;
            let icon = data.properties.periods[0].icon;
            let detailedForecast = data.properties.periods[0].detailedForecast;

            // Local storage
            storage.setItem("high", high);
            storage.setItem("low", low);
            storage.setItem("icon", icon);
            storage.setItem("detailedForecast", detailedForecast);
        })
        .catch(error => console.log("There was a getForecast error: ", error))
}

buildPage();
function buildPage(){

    // SET TITLE INFORMATION
    let pageTitle = document.getElementById('pageTitle');
    // Combine state and city
    let fullName = storage.getItem("locName") + ", " + storage.getItem("locState");
    let fullNameNode = document.createTextNode(fullName);
    // Change title and h1
    pageTitle.insertBefore(fullNameNode, pageTitle.childNodes[0]);
    document.getElementById('pageHeader').innerHTML = fullName;
    
    // SET LOCATION INFORMATION
    // Set elevation
    let se = storage.getItem("stationElevation");
    let elevation = convertMeters(se);
    document.getElementById("elevation").innerHTML = elevation;
    console.log("Elevation in feet: " + elevation);
    // Set location
    let lat = storage.getItem("latitude");
    let long = storage.getItem("longitude");
    let latCardinal = "";
    let longCardinal = "";
    lat = Math.round(lat * 100) / 100;
    long = Math.round(long * 100) / 100;
    if(Math.sign(lat) == 1){
        latCardinal = "&deg;N, "
    }
    else{
        latCardinal = "&deg;S, "
    }
    if(Math.sign(long) == 1){
        longCardinal = "&deg;E | "
    }
    else{
        longCardinal = "&deg;W | "
    }
    console.log("Updated lat and long are: " + lat + ", " + long); 
    document.getElementById("location").innerHTML = lat + latCardinal + long + longCardinal;


    // SET TEMPERATURE INFORMATION
    let curTemp = storage.getItem("temperature");
    // Set high temp
    let high = storage.getItem("high");
    document.getElementById("high").innerHTML = high + "&deg;F";
    // Set low temp
    let low = storage.getItem("low");
    document.getElementById("low").innerHTML = low + "&deg;F";
    // Set current temp
    document.getElementById("curTemp").innerHTML = curTemp + "&deg;F";
    console.log("Current temperature is " + curTemp + ", High: " + storage.getItem("high") + ", Low: " + storage.getItem("low"));

    // SET WIND INFORMATION
    let windSpeed = storage.getItem("windSpeed");
    let ws = windSpeed.charAt(0);
    // Set gusts (This needs to be refined)
    document.getElementById("gusts").innerHTML = storage.getItem("windGust") + " mph";
    // Set wind speed
    document.getElementById("mph").innerHTML = windSpeed;
    // Set wind direction
    let windDirection = storage.getItem("windDirection");
    document.getElementById("direction").innerHTML = windDirection
    // Change dial direction
    windDial(windDirection); 

    // Set feels like
    document.getElementById("feelsLike").innerHTML = buildWC(ws, curTemp);


    // SET WEATHER INFORMATION
    let curWeather = storage.getItem("curWeather");
    // Set summary title
    document.getElementById("weatherTitle").innerHTML = curWeather;
    // Set summary image
    let summary = getCondition(curWeather);
    changeSummaryImage(summary);
    // Test
    console.log("Weather description is: " + curWeather);


    // SET HOURLY INFORMATION
    // Set the hourly temperature information
    // Create new date and get the hour
    let date = new Date();
    let nextHour = date.getHours() + 1;
    // Get hourly data
    let hourlyStorage = storage.getItem("hourly");
    // Convert into array
    let hourlyData = hourlyStorage.split(",");
    console.log(hourlyData);
    // Call function to buildHourlyData and set it on website
    hourlyUL.innerHTML = buildHourlyData(nextHour, hourlyData);

    // Change the status of the containers
    pageContent.setAttribute('class', ''); // removes the hide class
    statusMessage.setAttribute('class', 'hide'); // hides the status container
}

function convertToFahrenheit(c){
    let f = c * (9/5) + 32;
    return f;
}