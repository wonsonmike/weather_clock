import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";
import { today } from "user-activity";
import { battery } from "power";
import * as messaging from "messaging";

function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

//----------variables-----------------------

// Update the clock every second
clock.granularity = "seconds";
clock.ontick = evt => {onTick(evt.date)}

// Get a handle on the <text> element
const myTime = document.getElementById("myTime");
const myDate = document.getElementById("myDate");
const myHeart = document.getElementById("myHeart");
const mySteps = document.getElementById("mySteps");
const myDistance = document.getElementById("myDistance");
const myBattery = document.getElementById("myBattery");
const ninetyFive = document.getElementById("ninetyFive");
const ninety = document.getElementById("ninety");
const eightyFive = document.getElementById("eightyFive");
const eighty = document.getElementById("eighty");
const seventyFive = document.getElementById("seventyFive");
const seventy = document.getElementById("seventy");
const sixtyFive = document.getElementById("sixtyFive");
const sixty = document.getElementById("sixty");
const fiftyFive = document.getElementById("fiftyFive");
const fifty = document.getElementById("fifty");
const fourtyFive = document.getElementById("fourtyFive");
const fourty = document.getElementById("fourty");
const thirtyFive = document.getElementById("thirtyFive");
const thirty = document.getElementById("thirty");
const twentyFive = document.getElementById("twentyFive");
const twenty = document.getElementById("twenty");
const fifteen = document.getElementById("fifteen");
const ten = document.getElementById("ten");
const five = document.getElementById("five");
const zero = document.getElementById("zero");
const myUV = document.getElementById("myUV");
const zeroUv = document.getElementById("zeroUv");
const oneUv = document.getElementById("oneUv");
const twoUv = document.getElementById("twoUv");
const threeUv = document.getElementById("threeUv");
const fourUv = document.getElementById("fourUv");
const fiveUv = document.getElementById("fiveUv");
const sixUv = document.getElementById("sixUv");
const sevenUv = document.getElementById("sevenUv");
const eightUv = document.getElementById("eightUv");
const nineUv = document.getElementById("nineUv");
const myWeather = document.getElementById("myWeather");
const oneTemp = document.getElementById("oneWeather");
const twoTemp = document.getElementById("twoWeather");
const threeTemp = document.getElementById("threeWeather");
const oneTime = document.getElementById("oneTime");
const twoTime = document.getElementById("twoTime");
const threeTime = document.getElementById("threeTime");
const fourTime = document.getElementById("fourTime");
const oneIcon = document.getElementById("oneIcon");
const twoIcon = document.getElementById("twoIcon");
const threeIcon = document.getElementById("threeIcon");
const fourIcon = document.getElementById("fourIcon");
const heartIcon = document.getElementById("heartIcon");
const stepsIcon = document.getElementById("stepsIcon");
const distanceIcon = document.getElementById("distanceIcon");
const myLocation = document.getElementById("myLocation");

const heartSensor = new HeartRateSensor({ frequency: 1})

let heartStaleTimer

//----------set-up----------------------------

;(function() {
    heartSensor.addEventListener("reading", onHeartReading)

    myHeart.text = '—'
    heartSensor.start()

    //if (display.aodAvailable) display.aodAllowed = true
    display.onchange = onDisplayChange

    myUV.text = "UV";

})()

function stopHeartSensor() {
    heartSensor.stop()

    if(heartStaleTimer !== undefined) {
        clearTimeout(heartStaleTimer)
        heartStaleTimer = undefined
    }
}

//--------running------------

// Update the date and time every minute
function onTick(now) {

  //set date
  const date = now.getDate()
  const month = now.getMonth()
  const day = now.getDay()
  switch(now.getMonth()) {
    case 0: month = "Jan "; break
    case 1: month = "Feb "; break
    case 2: month = "March "; break
    case 3: month = "Apr "; break
    case 4: month = "May "; break
    case 5: month = "Jun "; break
    case 6: month = "Jul "; break
    case 7: month = "Aug "; break
    case 8: month = "Sep "; break
    case 9: month = "Oct "; break
    case 10: month = "Nov "; break
    case 11: month = "Dec "; break
  }
  switch(now.getDay()) {
    case 0: day = "Sun"; break
    case 1: day = "Mon"; break
    case 2: day = "Tue"; break
    case 3: day = "Wed"; break
    case 4: day = "Thr"; break
    case 5: day = "Fri"; break
    case 6: day = "Sat"; break
  }
  myDate.text = month + date + ", " + day

  // set time
  let hours = now.getHours();
  // 12h format
  if (preferences.clockDisplay === "12h") {
    hours = hours % 12 || 12;
  } 
  // 24h format
  else {
    hours = zeroPad(hours);
  }
  let min = now.getMinutes();
  min = zeroPad(min);
  myTime.text = `${hours}:${min}`;

  //set activity
  //if (!display.aodActive && display.on) {
  if(display.on) {
  mySteps.text = today.adjusted.steps.toLocaleString();
  stepsIcon.href = "icons/steps.png";
  myDistance.text = (today.adjusted.distance * .001).toFixed(2);
  distanceIcon.href = "icons/distance.png";
  heartIcon.href = "icons/heart.png";
  }

  //set battery
  setBattery();

  //set weather time
  now.getHours() > 12 ? (oneTime.text = (now.getHours() - 12) + "pm") : (oneTime.text = now.getHours() + "am");
  (now.getHours() + 1) > 12 ? ((now.getHours() + 1) > 24 ? (twoTime.text = (now.getHours() - 23) + "am") : (twoTime.text = (now.getHours() - 11) + "pm")) : (twoTime.text = (now.getHours() + 1) + "am");
  (now.getHours() + 2) > 12 ? ((now.getHours() + 2) > 24 ? (threeTime.text = (now.getHours() - 22) + "am") : (threeTime.text = (now.getHours() - 10) + "pm")) : (threeTime.text = (now.getHours() + 2) + "am");
  (now.getHours() + 3) > 12 ? ((now.getHours() + 3) > 24 ? (fourTime.text = (now.getHours() - 21) + "am") : (fourTime.text = (now.getHours() - 9) + "pm")) : (fourTime.text = (now.getHours() + 3) + "am");

}

function setBattery() {
    myBattery.text = `${Math.floor(battery.chargeLevel)}%`;
    battery.chargeLevel <= 95 ? (ninetyFive.style.fill = "#004400") : (ninetyFive.style.fill = "#00cd00");
    battery.chargeLevel <= 90 ? (ninety.style.fill = "#0C4700") : (ninety.style.fill = "#24D400");
    battery.chargeLevel <= 85 ? (eightyFive.style.fill = "#184900") : (eightyFive.style.fill = "#49DB00");
    battery.chargeLevel <= 80 ? (eighty.style.fill = "#244B00") : (eighty.style.fill = "#6DE200");
    battery.chargeLevel <= 75 ? (seventyFive.style.fill = "#314E00") : (seventyFive.style.fill = "#92EA00");
    battery.chargeLevel <= 70 ? (seventy.style.fill = "#3D5000") : (seventy.style.fill = "#B6F100");
    battery.chargeLevel <= 65 ? (sixtyFive.style.fill = "#495300") : (sixtyFive.style.fill = "#DBF800");
    battery.chargeLevel <= 60 ? (sixty.style.fill = "#555500") : (sixty.style.fill = "#FFFF00");
    battery.chargeLevel <= 55 ? (fiftyFive.style.fill = "#555101") : (fiftyFive.style.fill = "#FFF204");
    battery.chargeLevel <= 50 ? (fifty.style.fill = "#554C03") : (fifty.style.fill = "#FFE409");
    battery.chargeLevel <= 45 ? (fourtyFive.style.fill = "#554804") : (fourtyFive.style.fill = "#FFD70D");
    battery.chargeLevel <= 40 ? (fourty.style.fill = "#554306") : (fourty.style.fill = "#FFC911");
    battery.chargeLevel <= 35 ? (thirtyFive.style.fill = "#553F07") : (thirtyFive.style.fill = "#FFBC16");
    battery.chargeLevel <= 30 ? (thirty.style.fill = "#553A09") : (thirty.style.fill = "#FFAE1A");
    battery.chargeLevel <= 25 ? (twentyFive.style.fill = "#553007") : (twentyFive.style.fill = "#FF9116");
    battery.chargeLevel <= 20 ? (twenty.style.fill = "#552706") : (twenty.style.fill = "#FF7411");
    battery.chargeLevel <= 15 ? (fifteen.style.fill = "#551D04") : (fifteen.style.fill = "#FF570D");
    battery.chargeLevel <= 10 ? (ten.style.fill = "#551303") : (ten.style.fill = "#FF3A09");
    battery.chargeLevel <= 5 ? (five.style.fill = "#550A01") : (five.style.fill = "#FF1D04");
    battery.chargeLevel <= 2 ? (zero.style.fill = "#550000") : (zero.style.fill = "#FF0000");
}

function setUv(uv) {
    myUV.text = uv;
    uv < 10 ? (nineUv.style.fill = "#550000") : (nineUv.style.fill = "#FF0000");
    uv < 9 ? (eightUv.style.fill = "#551303") : (eightUv.style.fill = "#FF3A09");
    uv < 8 ? (sevenUv.style.fill = "#552706") : (sevenUv.style.fill = "#FF7411");
    uv < 7 ? (sixUv.style.fill = "#553A09") : (sixUv.style.fill = "#FFAE1A");
    uv < 6 ? (fiveUv.style.fill = "#554306") : (fiveUv.style.fill = "#FFC911");
    uv < 5 ? (fourUv.style.fill = "#554C03") : (fourUv.style.fill = "#FFE409");
    uv < 4 ? (threeUv.style.fill = "#555500") : (threeUv.style.fill = "#FFFF00");
    uv < 3 ? (twoUv.style.fill = "#3D5000") : (twoUv.style.fill = "#B6F100");
    uv < 2 ? (oneUv.style.fill = "#244B00") : (oneUv.style.fill = "#6DE200");
    uv < 1 ? (zeroUv.style.fill = "#0C4700") : (zeroUv.style.fill = "#24D400");
}

function onHeartReading() {
    if (heartStaleTimer !== undefined) clearTimeout(heartStaleTimer)
    heartStaleTimer = setTimeout(onHeartStale, 20000)
    myHeart.text = heartSensor.heartRate
}

function onHeartStale() {
    heartStaleTimer = undefined
    myHeart.text = "-"
}

//-------Display--Change--------------

function onDisplayChange() {
    //if (display.aodAllowed && display.aodEnabled) { // entering or leaving AOD
    //  clock.granularity = display.aodActive? 'minutes' : 'seconds'
    //  displayCommon(!display.aodActive && display.on)
    //} else {
      displayCommon(display.on)
    //}
  }
  
  function displayCommon(normal) {  // display.onchange stuff common to AOD and not AOD
    // normal: if non-AOD, display is coming on; if AOD, display is leaving AOD
  
    if (normal) {   // display going on or leaving AOD
    heartSensor.start()
    } 
    else {    // not normal: display going off or into AOD
        myHeart.text = "";
        mySteps.text = "";
        myDistance.text = "";
    
        stopHeartSensor()
    }
  }


//---------Weather-----

// Request weather data from the companion
function fetchWeather() {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      // Send a command to the companion
      messaging.peerSocket.send({
        command: 'weather'
      });
    }
  }
  
  function setIcon(icon) {
    switch(icon) {
        case "01d": return "icons/sunny.png"; break
        case "01n": return "icons/night.png"; break
        case "02d": return "icons/partlyCloudyDay.png"; break
        case "02n": return "icons/partlyCloudyNight.png"; break
        case "03d": return "icons/cloudyClearDay.png"; break
        case "03n": return "icons/cloudyClearNight.png"; break
        case "04d": return "icons/cloudy.png"; break
        case "04n": return "icons/cloudy.png"; break
        case "09d": return "icons/heavyRain.png"; break
        case "09n": return "icons/heavyRain.png"; break
        case "10d": return "icons/scatteredShowersDay.png"; break
        case "10n": return "icons/scatteredShowersNight.png"; break
        case "11d": return "icons/severeThunder.png"; break
        case "11n": return "icons/severeThunder.png"; break
        case "13d": return "icons/snow.png"; break
        case "13n": return "icons/snow.png"; break
        case "50d": return "icons/fog.png"; break
        case "50n": return "icons/fog.png"; break
        default: return "icons/sunny.png"; break
    }
  }

  // Display the weather data received from the companion
  function processWeatherData(data) {

    myWeather.text = data.temp;
    oneIcon.href = setIcon(data.icon);

    oneTemp.text = data.oneTemp;
    twoIcon.href = setIcon(data.oneIcon);

    twoTemp.text = data.twoTemp;
    threeIcon.href = setIcon(data.twoIcon);

    threeTemp.text = data.threeTemp;
    fourIcon.href = setIcon(data.threeIcon);



    myLocation.text = data.location;

    //myWeather.text = data.temp
    setUv(data.uv);

  }
  
  // Listen for the onopen event
  messaging.peerSocket.onopen = function() {
    // Fetch weather when the connection opens
    fetchWeather();
  }
  
  // Listen for messages from the companion
  messaging.peerSocket.onmessage = function(evt) {
    if (evt.data) {
      processWeatherData(evt.data);
    }
  }
  
  // Fetch the weather every (30*60) sec (30 minutes)
setInterval(fetchWeather, 30 * 60 * 1000);

//green: 00cd00
//yellow:FFFF00
//orange:FFAE1A
//red:FF0000