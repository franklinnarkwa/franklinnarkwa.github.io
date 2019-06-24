/* *************************************
*  Weather Site JavaScript Functions
************************************* */
// Making sure the JS file is working //
console.log('My JS is being Read.');

//funcution getCondition is created and changes images
function getCondition(){
    const condition = getCondition("clear");
   changeSummaryImage(condition);




//variables  for functions in use
const temp = 31;
const speed = 5;
const direction = "frank";
windDial(direction);
buildWC(speed, temp);

//calling the windDial function to test weather accuracy.
windDial('e');

//calling the convertMeters function
let meters = 1514.246;

console.log("Meters: " + meters);
let feet = convertMeters(meters);
console.log("Feet: " + feet);
}



//Calculating and testing the Windchill
function buildWC(speed, temp) {
   
    const feelsTemp= document.getElementById('feelsTemp');

    //calculation for the maths
    let wc = 35.74 + 0.6215 * temp - 35.75 * Math.pow(speed, 0.16) + 0.4275 * temp * Math.pow(speed, 0.16);
    console.log(wc);

    // round the answer to integer
    wc = Math.floor(wc);

    //determines the smaller temperatures for the result 
    wc = (wc > temp) ? temp: wc;
    console.log(wc);

    //change HTML of your feel in your franklin weather page
    feelsLike.innerHTML = wc;
}

// The wind Dial function
function windDial(direction){
const dial = document.getElementById("dial");
console.log(direction);



//determining the dial class

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