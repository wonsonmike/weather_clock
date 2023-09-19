
  export default class Weather {
  
    constructor() {
      this.apiKey = '';
      this.provider = 'owm';
      this.onerror = undefined;
      this.onsuccess = undefined;
      this.feelsLike = true;
      
      this.weather = undefined;
      this.locationName = undefined;
    }
    
      
    get() {
      return this.weather;
    }
    
    setApiKey(apiKey) {
      this.apiKey = apiKey;
    }
    
    setProvider(provider) {
      this.provider = provider;
    }
    
    setFeelsLike(feelsLike) {
      this.feelsLike = feelsLike;
    }
    
    static timeParse(str) {
      var buff = str.split(" ");
      if(buff.length === 2) {
        var time = buff[0].split(":");
        if(buff[1].toLowerCase() === "pm" && parseInt(time[0]) !== 12) {
          time[0] = (parseInt(time[0]) + 12) + "";
        }
      }
  
      var date = new Date();
      date.setHours(parseInt(time[0]));
      date.setMinutes(parseInt(time[1]));
  
      return date;
    }
      
    _queryLocation(latitude, longitude) {
        var url = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=" + this.apiKey;
        fetch(url)
        .then((response) => {return response.json()})
        .then((data) => {this.locationName = data.name})
        .catch((err) => { if(this.onerror) this.onerror(err); });
    }


    _queryOWMWeather(latitude, longitude) {

      var url = 'https://api.openweathermap.org/data/3.0/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=minutely,daily,alerts&units=metric&appid=' + this.apiKey;
      //'https://api.tomorrow.io/v4/timelines?location=' + latitude + "," +longitude + "&fields=temperature&timesteps=1h&units=metric&apikey=" + this.apiKey;
      
  
      fetch(url)
      .then((response) => {return response.json()})
      .then((data) => { 
          
          if(data.current.weather === undefined){
            if(this.onerror) this.onerror(data);
            return;
          }

          this.weather = {
            temp : Math.round(data.current.temp),
            icon : data.current.weather[0].icon,
            location : this.locationName, 
            description : data.current.weather[0].description,
            uv : Math.round(data.current.uvi),
            timestamp : new Date().getTime(),
            oneTemp : Math.round(data.hourly[1].temp),
            oneIcon : data.hourly[1].weather[0].icon,
            twoTemp : Math.round(data.hourly[2].temp),
            twoIcon : data.hourly[2].weather[0].icon,
            threeTemp : Math.round(data.hourly[3].temp),
            threeIcon : data.hourly[3].weather[0].icon
          };
          // Send the weather data to the device
          if(this.onsuccess) this.onsuccess(this.weather);
        

        /*
       //tomorrow.io
        if (data.core.temperature == undefined){
            if(this.onerror) this.onerror(dataa);
            return;
        }

        this.weather = {
            temp : Math.round(data.core.temperature),
            description : data.core.weatherCode,
            uv : data.core.uvIndex

        }
        */
      })
      .catch((err) => { if(this.onerror) this.onerror(err); });
    };
    
    fetch(latitude, longitude) {
        this._queryLocation(latitude, longitude)
        this._queryOWMWeather(latitude, longitude);
    }
    
  }