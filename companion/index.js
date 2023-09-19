// Import the messaging module
import * as messaging from "messaging";
import { geolocation } from "geolocation";

// Import the weather module
import Weather from '../common/weather';

// Create the weather object
let weather = new Weather();
// set your api key
weather.setApiKey("43d129649cf9580e688804762767d3f8");
//openweathermap: 43d129649cf9580e688804762767d3f8
//tomorrow.io: JnNzBkRsflWIoo3v0G1B3tToxIC2H85p
// Set the provider : owm / 
weather.setProvider("owm"); 

// Set the onerror callback
weather.onerror = function(e) {
  console.log("Error : " + JSON.stringify(e) + " " + e);
}

// Set the onsucess callback
weather.onsuccess = function(data) {
  console.log("Success : " + JSON.stringify(data));
  
  // You can also get the last know weather data if you don't want to fetch it again
  // console.log(JSON.stringify(weather.get()));
  
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    messaging.peerSocket.send(data);
  } else {
    console.log("Error: Connection is not open");
  }
}

function locationSuccess(position) {
  //check if lat and long are working
  //console.log("Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude);
  
  // The device requested weather data
  weather.fetch(position.coords.latitude, position.coords.longitude);
}

function locationError(error) {
  console.log("Error: " + error.code, "Message: " + error.message);
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
  console.log("On message " + JSON.stringify(evt));
  if (evt.data && evt.data.command == "weather") {
    geolocation.getCurrentPosition(locationSuccess, locationError, {"enableHighAccuracy" : false, "maximumAge" : 1000 * 3600 * 2});
  }
}