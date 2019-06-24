"use strict";





//To get values from webpage.
let pageNav = document.getElementById('page-nav');
let statusContainer = document.getElementById('status');
let contentContainer = document.getElementById('main-content');
let weatherURL ="js/weather.json";

fetchData(weatherURL);

function fetchData(weatherURL){
  let cityName = 'Greenville'; // The data we want from the weather.json file
  fetch(weatherURL)
  .then(function(response) {
  if(response.ok){
  return response.json();
  }
  throw new ERROR('Network response was not OK.');
  })
  .then(function(data){
    // Check the data object that was retrieved
    console.log(data);
    // data is the full JavaScript object, but we only want the greenville part
    // shorten the variable and focus only on the data we want to reduce typing
    let g = data[cityName];

    // ************ Get the content ******************************

    // Get the location data
    let locName = g.City;
    let locState = g.State;
    // Put them together
    let fullName = locName+', '+locState;
    // See if it worked
    console.log('fullName is: '+fullName);

    // Get the temperature data
    let temp = g.Temp;
    console.log("Temperature: " + temp)

    // Get the wind data 
    let wind = g.Wind;
    console.log("Wind: " + wind)
    // document.getElementById("gust-speed").innerHTML=wind+" mph";

    // Get the current conditions
    let summary = g.Summary;
    console.log(summary); 

    // Get the hourly data 
    let hourly = g.Hourly;
    console.log("Hourly: " + hourly)

    // Zipcode
    let zip = g.Zip;
    console.log("Zipcode: " + zip)

    // Elevation
    let elevation = g.Elevation;
    console.log("Elevation: " + elevation)

        // Direction
    let direction = g.Direction;
    console.log("Direction: " + direction)

    // Gust
    let gust = g.Gusts;
    console.log("Gust: " + gust)

    // High
    let high = g.High;
    console.log("High: " + high)


    // Longitude
    let longitude = g.Longitude;
    console.log("Longitude: " + longitude)


    // Latitude
    let latitude = g.Latitude;
    console.log("Latitude: " + latitude)

    //  low
    let low = g.Low;
    console.log("Low: " + low)

    // Precip
    let precip = g.Precip;
    console.log("Precip: " + precip)

    // State
    let state = g.State;
    console.log("State: " + state)

    


    // ************ Display the content ******************************
    // Set the title with the location name at the first
    // Gets the title element so it can be worked with
    let pageTitle = document.getElementById('page-title');
    // Create a text node containing the full name 
    let fullNameNode = document.createTextNode(fullName);
    // inserts the fullName value before any other content that might exist
    pageTitle.insertBefore(fullNameNode, pageTitle.childNodes[0]);
    // When this is done the title should look something like this:
    // Greenville, SC | The Weather Site

    // Set the Location information
    // Get the h1 to display the city location
    let contentHeading = document.getElementById('city-section1');
    contentHeading.innerHTML = fullName;
    // The h1 in main h1 should now say "Greenville, SC"


    // Set the temperature information
    let tempEl = document.getElementById("tem1");
    tempEl.innerHTML=temp + "&deg;F";
    // Set the wind information
    let windEl = document.getElementById("ivalue");
    windEl.innerHTML=wind + "mph";
    // Set the current conditions information
    let summaryEl = document.getElementById("summary");
    summaryEl.innerHTML=summary;
    // Set the hourly temperature information
    let hourlyEl = document.getElementById("hourly");
    hourlyEl.innerHTML=buildHourlyData(nextHour,hourly);
    
    // Zipcode
    let zipEl = document.getElementById("zip");
    zipEl.innerHTML=zip;
    // Elevation
    let elevationEl = document.getElementById("elevation");
    elevationEl.innerHTML=elevation;
    // Location
    let locationEl= document.getElementById("location");
    locationEl.innerHTML= longitude+" "+latitude;

    // direction
    let directionEl = document.getElementById("wind-direction");
    directionEl.innerHTML=direction;
    // gust
    let gustEl = document.getElementById("gust-speed");
    gustEl.innerHTML=gust;
    
    windDial(direction);

    // feels like
    let feelsLikeEl = document.getElementById("feelTemp");
    buildWC(wind, temp);
    
    //change background image
    let newcondition = getCondition(summary);
    ChangeSummaryImage(newcondition);

    // Change the status of the containers
    contentContainer.setAttribute('class', ''); // removes the hide class
    statusContainer.setAttribute('class', 'hide'); // hides the status container
  })
  .catch(function(error){
  console.log('There was a fetch problem: ', error.message);
  statusContainer.innerHTML = 'Sorry, the data could not be processed.';
  })
}