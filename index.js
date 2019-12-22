const axios = require("axios");
let hideVirtualKeyboard = require("hide-virtual-keyboard");
// let countryCodeLookup = require("country-code-lookup");

const monthArray = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

let month = "";
let tmpDate = "";

let unit = "metric";
let city = "Berlin";

// for delay when displaying weather data
let refresh_time = 1000;

//  SERVER ********************************************

function callAPI(city) {
  let url = `https://api.openweathermap.org/data/2.5/forecast?q=`;
  const apiKey = `&APPID=d84a3b5a1d8ffa8e702549aec5e6ec79`;
  let forecast = url + city + "&units=metric" + apiKey;

  console.log(forecast);

  return axios.get(forecast);
  // .then(response => {
  //   return response.data;

  // temp = response.data;
  // return response.data;
  // return "API return";
  // });
  // .catch(error => {
  //   city_input.value = `${data.city.name}, ${data.city.country}`;
  //   console.error("City not found, try again ¯\\_(ツ)_/¯");
  //   let error_msg_box = document.getElementById("not_found_container");
  //   error_msg_box.style.display = "flex";

  //   document.addEventListener("click", () => {
  //     error_msg_box.style.display = "none";
  //   });

  //   console.log(error);
  // });
  // console.log("+s+s+s+s+ss+" + data);
  // return temp;
}

//  /SERVER ********************************************

//  CLIENT ********************************************

class WeatherData {
  constructor(city_input) {
    this.city_input = city_input;
    this.data = "";
    // console.log(city_input);
    // console.log(this.city_input);
  }
  update_weather_data(city_input) {
    // this.data = callAPI(city_input);
  }
  // get month and day
  getDate(num) {
    tmpDate = this.data.list[num].dt_txt.slice(5, 10);
    num = tmpDate.slice(3, 5);
    month = monthArray[tmpDate.slice(0, 2) - 1];
    return `${month} ${num}`;
  }
  // get current temperature
  getTemp(num) {
    let temp = this.data.list[num].main.temp;
    return temp;
  }
  // get feels-like-temperature
  getFeelsLikeTemp(num) {
    let day = num;
    let temp = this.data.list[day].main.feels_like;
    return temp;
  }
  // get min-temperature
  getTempMin(num) {
    let temperatures = num;
    let temp_values = [];
    let temp;

    if (num != 0) {
      for (let i = 0; i < 8; i++) {
        temp_values.push(this.data.list[temperatures].main.temp_min);
        temperatures--;
      }
      temp = Math.min(...temp_values);
    } else {
      let day = num;
      temp = this.data.list[0].main.temp_min;
      return temp;
    }
    return temp;
  }
  // get max-temperature
  getTempMax(num) {
    let temperatures = num;
    let temp_values = [];
    let temp;

    if (num != 0) {
      for (let i = 0; i < 8; i++) {
        temp_values.push(this.data.list[temperatures].main.temp_max);
        console.log(temperatures);
        temperatures--;
      }
      temp = Math.max(...temp_values);
    } else {
      let day = num;
      temp = this.data.list[0].main.temp_max;
      return temp;
    }
    return temp;
  }
  // get weather description
  getOvercast(num) {
    let day = num;
    let temp = this.data.list[day].weather[0].description;
    return temp;
  }
  // get wind speed
  getWind(num) {
    let day = num;
    let temp = this.data.list[day].wind.speed;
    return temp;
  }
  // get humidity
  getHumidity(num) {
    let day = num;
    let temp = this.data.list[day].main.humidity;
    return temp;
  }
  // get icon accordingly to weather
  getIcon(num) {
    let day = num;
    let icon = this.data.list[day].weather[0].icon;
    return icon;
  }
}

// set mobile layout to standard (keyboard closed)
const mobile_layout = () => {
  let circle = document.getElementById("circle");
  let slide_container = document.getElementById("slide-container");
  circle.style.margin = "20px 0";
  slide_container.style.display = "block";

  window.scrollTo(0, 1); // macht das was???
};

const mobile_keyboard_open = () => {
  let circle = document.getElementById("circle");
  let slide_container = document.getElementById("slide-container");
  circle.style.margin = "5% 0%";
  slide_container.style.display = "none";
};

// attribute settings back to mobile view without keyboard
const close_mobile_keyboard = () => {
  setTimeout(() => {
    let grid = document.getElementById("grid-selector");
    let except = document.getElementById("city-input");
    grid.addEventListener(
      "click",
      () => {
        mobile_layout();
      },
      false
    );
    except.addEventListener(
      "click",
      ev => {
        null;
        ev.stopPropagation();
      },
      false
    );
  }, 100);
};

const writeDataToDom = () => {
  // write current temp to dom
  let temp = document.getElementById("temp-value");
  let temp_string = weather_data.getTemp(0).toFixed(1);
  setTimeout(() => {
    temp.innerHTML = temp_string;
  }, refresh_time);

  // write temp unit accordingly to choice to dom
  let temp_symbol = document.getElementById("temp-symbol");
  temp_symbol.style.color = "#cccccc";
  setTimeout(() => {
    if (unit == "metric") {
      temp_symbol.innerHTML = " °C";
    } else if (unit == "imperial") {
      temp_symbol.innerHTML = " °F";
    }
  }, refresh_time);

  // write feels-like-temp to dom
  let feels_like_temp = document.getElementById("feels-like-temp");
  let feels_like_temp_string = weather_data.getFeelsLikeTemp(0).toFixed(1);
  setTimeout(() => {
    feels_like_temp.innerHTML = `Feels like <span id="feels-like-temp-value">${feels_like_temp_string}°</span>`;
  }, refresh_time + 50);

  // write min and max temp to dom
  let temp_min = document.getElementById("temp_min");
  let temp_min_string = weather_data.getTempMin(0).toFixed(1);
  let temp_max = document.getElementById("temp_max");
  let temp_max_string = weather_data.getTempMax(0).toFixed(1);
  setTimeout(() => {
    temp_min.innerHTML = `${temp_min_string}° <span id="temp-min-span">Min</span>`;
    document.getElementById("temp-min-span").style.cssText =
      "font-size: 12pt; color: #6ca1d0; text-shadow: 1px 1px 1px #616161;";
    temp_max.innerHTML = `${temp_max_string}° <span id="temp-max-span">Max</span> `;
    document.getElementById("temp-max-span").style.cssText =
      "font-size: 12pt; color: #b94848; text-shadow: 1px 1px 1px #616161;";
  }, refresh_time + 100);

  // write weather description to dom
  let overcast = document.getElementById("overcast");
  setTimeout(() => {
    overcast.innerHTML = weather_data.getOvercast(0);
  }, refresh_time + 110);

  // write wind speed to dom
  let wind = document.getElementById("wind");
  setTimeout(() => {
    wind.innerHTML = `Wind: ${weather_data.getWind(0).toFixed(1)} ${
      unit === "metric" ? `m/s` : "mph"
    }`;
  }, refresh_time + 115);

  // write humidity temp to dom
  let humidity = document.getElementById("humidity");
  setTimeout(() => {
    humidity.innerHTML = `Humidity: ${weather_data.getHumidity(0)}%`;
  }, refresh_time + 120);

  // use last city as fallback for input field
  let country = weather_data.data.city.country;
  if (weather_data.city_input !== undefined) {
    weather_data.city_input.value = `${
      weather_data.city_input == undefined
        ? "Berlin"
        : weather_data.data.city.name
    }, ${country}`;
  }

  // write icon to dom
  setTimeout(() => {
    let image = document.getElementById("icon");
    image.style.display = "inline-block";
    let downloadingImage = new Image();
    downloadingImage.onload = function() {
      image.src = this.src;
    };
    downloadingImage.src = `http://openweathermap.org/img/wn/${weather_data.getIcon(
      0
    )}@2x.png`;
  }, refresh_time);

  // weather forecast for tomorrow
  setTimeout(() => {
    console.log(weather_data.data);

    document.getElementById(
      "day-2-temp-min"
    ).innerHTML = `${weather_data.getTempMin(7).toFixed(1)}°`;
    document.getElementById(
      "day-2-temp-max"
    ).innerHTML = `${weather_data.getTempMax(7).toFixed(1)}°`;
    document.getElementById("day-2-date").innerHTML = weather_data.getDate(7);
    document.getElementById(
      "day-2-icon"
    ).src = `http://openweathermap.org/img/wn/${weather_data.getIcon(
      7
    )}@2x.png`;

    // weather forecast for 2nd day
    document.getElementById(
      "day-3-temp-min"
    ).innerHTML = `${weather_data.getTempMin(15).toFixed(1)}°`;
    document.getElementById(
      "day-3-temp-max"
    ).innerHTML = `${weather_data.getTempMax(15).toFixed(1)}°`;
    document.getElementById("day-3-date").innerHTML = weather_data.getDate(15);
    document.getElementById(
      "day-3-icon"
    ).src = `http://openweathermap.org/img/wn/${weather_data.getIcon(
      15
    )}@2x.png`;

    // weather forecast for 3nd day
    document.getElementById(
      "day-4-temp-min"
    ).innerHTML = `${weather_data.getTempMin(23).toFixed(1)}°`;
    document.getElementById(
      "day-4-temp-max"
    ).innerHTML = `${weather_data.getTempMax(23).toFixed(1)}°`;
    document.getElementById("day-4-date").innerHTML = weather_data.getDate(23);
    document.getElementById(
      "day-4-icon"
    ).src = `http://openweathermap.org/img/wn/${weather_data.getIcon(
      23
    )}@2x.png`;

    // weather forecast for 4nd day
    document.getElementById(
      "day-5-temp-min"
    ).innerHTML = `${weather_data.getTempMin(31).toFixed(1)}°`;
    document.getElementById(
      "day-5-temp-max"
    ).innerHTML = `${weather_data.getTempMax(31).toFixed(1)}°`;
    document.getElementById("day-5-date").innerHTML = weather_data.getDate(31);
    document.getElementById(
      "day-5-icon"
    ).src = `http://openweathermap.org/img/wn/${weather_data.getIcon(
      31
    )}@2x.png`;

    // weather forecast for 5nd day
    document.getElementById(
      "day-6-temp-min"
    ).innerHTML = `${weather_data.getTempMin(39).toFixed(1)}°`;
    document.getElementById(
      "day-6-temp-max"
    ).innerHTML = `${weather_data.getTempMax(39).toFixed(1)}°`;
    document.getElementById("day-6-date").innerHTML = weather_data.getDate(39);
    document.getElementById(
      "day-6-icon"
    ).src = `http://openweathermap.org/img/wn/${weather_data.getIcon(
      39
    )}@2x.png`;
  }, refresh_time + 120);

  // start circle animation
  setTimeout(() => {
    document.getElementById("turning_circle").classList.add("turn");
  }, 300);
  // remove circle animation
  let animate_circle = document.getElementById("turning_circle");
  animate_circle.addEventListener("animationend", () => {
    animate_circle.classList.remove("turn");
  });

  // change units to metric
  let celsius = document.getElementById("celsius");
  let imperial = document.getElementById("imperial");
  celsius.addEventListener("click", () => {
    unit = "metric";
    celsius.classList.add("buttonOn");
    imperial.classList.add("buttonOff");
    celsius.classList.remove("buttonOff");
    imperial.classList.remove("buttonOn");
  });
  // change units to imperial
  imperial.addEventListener("click", () => {
    unit = "imperial";
    imperial.classList.add("buttonOn");
    celsius.classList.add("buttonOff");
    imperial.classList.remove("buttonOff");
    celsius.classList.remove("buttonOn");
  });

  // let search_button = document.getElementById("search_button");
  // search_button.addEventListener("click", () => {
  //   let city_input = document.getElementById("city-input");
  //   if (city_input.value != "") {

  //     callAPI(forecast, city_input);
  //   }
  // });

  // create url with user input
  document
    .querySelector("#city-input")
    .addEventListener("keypress", function(e) {
      let key = e.which || e.keyCode;
      if (key === 13) {
        let city_input = document.getElementById("city-input");
        if (city_input.value != "") {
          console.log(city_input);

          callAPI(city_input.value);
        }
      }
    });

  // change layout, when keyboard is open on mobile devices
  document.getElementById("city-input").addEventListener("click", () => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // attribute settings for open keyboard on mobile phones
      mobile_keyboard_open();
      // close_mobile_keyboard();
    }
  });

  // hide mobile keyboard after input
  hideVirtualKeyboard();

  // set mobile layout to standard (keyboard closed)
  mobile_layout();
};

let weather_data = new WeatherData("Berlin");
let p = callAPI("Berlin");

p.then(response => {
  weather_data.data = response.data;
  writeDataToDom();
}).catch(error => {
  // city_input.value = `${data.city.name}, ${data.city.country}`;
  console.error("City not found, try again ¯\\_(ツ)_/¯");
  let error_msg_box = document.getElementById("not_found_container");
  error_msg_box.style.display = "flex";

  document.addEventListener("click", () => {
    error_msg_box.style.display = "none";
  });

  console.log(error);
});

// clear search input
weather_data.city_input != undefined && (weather_data.city_input.value = "");

// if (city_input != undefined) {
//   city_input.value = "";
// }

//  /CLIENT ********************************************

// attribute settings for open keyboard on mobile phones
