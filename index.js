const axios = require("axios");
let hideVirtualKeyboard = require("hide-virtual-keyboard");
// let countryCodeLookup = require("country-code-lookup");

let url = `https://api.openweathermap.org/data/2.5/forecast?q=`;
const apiKey = `&APPID=d84a3b5a1d8ffa8e702549aec5e6ec79`;

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

let data = "";

const callAPI = (forecast, city_input) => {
  axios
    .get(forecast)
    .then(response => {
      data = response.data;
      console.log(response);
      console.log(response.data);

      // get month and day
      const getDate = num => {
        let day = num;
        tmpDate = data.list[day].dt_txt.slice(5, 10);
        day = tmpDate.slice(3, 5);
        month = monthArray[tmpDate.slice(0, 2) - 1];
        return `${month} ${day}`;
      };
      // get current temperature
      const getTemp = num => {
        let day = num;
        let temp = data.list[day].main.temp;
        return temp;
      };
      // get feels-like-temperature
      const getFeelsLikeTemp = num => {
        let day = num;
        let temp = data.list[day].main.feels_like;
        return temp;
      };
      // get min-temperature
      const getTempMin = num => {
        let temperatures = num;
        let temp_values = [];
        let temp;

        if (num != 0) {
          for (let i = 0; i < 8; i++) {
            temp_values.push(data.list[temperatures].main.temp_min);
            temperatures--;
          }
          temp = Math.min(...temp_values);
        } else {
          let day = num;
          temp = data.list[0].main.temp_min;
          return temp;
        }
        return temp;
      };
      // get max-temperature
      const getTempMax = num => {
        let temperatures = num;
        let temp_values = [];
        let temp;

        if (num != 0) {
          for (let i = 0; i < 8; i++) {
            temp_values.push(data.list[temperatures].main.temp_max);
            console.log(temperatures);
            temperatures--;
          }
          temp = Math.max(...temp_values);
        } else {
          let day = num;
          temp = data.list[0].main.temp_max;
          return temp;
        }
        return temp;
      };
      // get weather description
      const getOvercast = num => {
        let day = num;
        let temp = data.list[day].weather[0].description;
        return temp;
      };
      // get wind speed
      const getWind = num => {
        let day = num;
        let temp = data.list[day].wind.speed;
        return temp;
      };
      // get humidity
      const getHumidity = num => {
        let day = num;
        let temp = data.list[day].main.humidity;
        return temp;
      };
      // get icon accordingly to weather
      const getIcon = num => {
        let day = num;
        let icon = data.list[day].weather[0].icon;
        return icon;
      };

      // write current temp to dom
      let temp = document.getElementById("temp-value");
      let temp_string = getTemp(0).toFixed(1);
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
      let feels_like_temp_string = getFeelsLikeTemp(0).toFixed(1);
      setTimeout(() => {
        feels_like_temp.innerHTML = `Feels like <span id="feels-like-temp-value">${feels_like_temp_string}°</span>`;
      }, refresh_time + 50);

      // write min and max temp to dom
      let temp_min = document.getElementById("temp_min");
      let temp_min_string = getTempMin(0).toFixed(1);
      let temp_max = document.getElementById("temp_max");
      let temp_max_string = getTempMax(0).toFixed(1);
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
        overcast.innerHTML = getOvercast(0);
      }, refresh_time + 110);

      // write wind speed to dom
      let wind = document.getElementById("wind");
      setTimeout(() => {
        wind.innerHTML = `Wind: ${getWind(0).toFixed(1)} ${
          unit === "metric" ? `m/s` : "mph"
        }`;
      }, refresh_time + 115);

      // write humidity temp to dom
      let humidity = document.getElementById("humidity");
      setTimeout(() => {
        humidity.innerHTML = `Humidity: ${getHumidity(0)}%`;
      }, refresh_time + 120);

      // use last city as fallback for input field
      let country = data.city.country;
      if (city_input !== undefined) {
        city_input.value = `${
          city_input == undefined ? "Berlin" : data.city.name
        }, ${country}`;
      }

      // weather forecast for tomorrow
      setTimeout(() => {
        document.getElementById("day-2-temp-min").innerHTML = `${getTempMin(
          7
        ).toFixed(1)}°`;
        document.getElementById("day-2-temp-max").innerHTML = `${getTempMax(
          7
        ).toFixed(1)}°`;
        document.getElementById("day-2-date").innerHTML = getDate(7);
        document.getElementById(
          "day-2-icon"
        ).src = `http://openweathermap.org/img/wn/${getIcon(7)}@2x.png`;

        // weather forecast for 2nd day
        document.getElementById("day-3-temp-min").innerHTML = `${getTempMin(
          15
        ).toFixed(1)}°`;
        document.getElementById("day-3-temp-max").innerHTML = `${getTempMax(
          15
        ).toFixed(1)}°`;
        document.getElementById("day-3-date").innerHTML = getDate(15);
        document.getElementById(
          "day-3-icon"
        ).src = `http://openweathermap.org/img/wn/${getIcon(15)}@2x.png`;

        // weather forecast for 3nd day
        document.getElementById("day-4-temp-min").innerHTML = `${getTempMin(
          23
        ).toFixed(1)}°`;
        document.getElementById("day-4-temp-max").innerHTML = `${getTempMax(
          23
        ).toFixed(1)}°`;
        document.getElementById("day-4-date").innerHTML = getDate(23);
        document.getElementById(
          "day-4-icon"
        ).src = `http://openweathermap.org/img/wn/${getIcon(23)}@2x.png`;

        // weather forecast for 4nd day
        document.getElementById("day-5-temp-min").innerHTML = `${getTempMin(
          31
        ).toFixed(1)}°`;
        document.getElementById("day-5-temp-max").innerHTML = `${getTempMax(
          31
        ).toFixed(1)}°`;
        document.getElementById("day-5-date").innerHTML = getDate(31);
        document.getElementById(
          "day-5-icon"
        ).src = `http://openweathermap.org/img/wn/${getIcon(31)}@2x.png`;

        // weather forecast for 5nd day
        document.getElementById("day-6-temp-min").innerHTML = `${getTempMin(
          39
        ).toFixed(1)}°`;
        document.getElementById("day-6-temp-max").innerHTML = `${getTempMax(
          39
        ).toFixed(1)}°`;
        document.getElementById("day-6-date").innerHTML = getDate(39);
        document.getElementById(
          "day-6-icon"
        ).src = `http://openweathermap.org/img/wn/${getIcon(39)}@2x.png`;
      }, refresh_time + 120);

      // write icon to dom
      setTimeout(() => {
        let image = document.getElementById("icon");
        image.style.display = "inline-block";
        let downloadingImage = new Image();
        downloadingImage.onload = function() {
          image.src = this.src;
        };
        downloadingImage.src = `http://openweathermap.org/img/wn/${getIcon(
          0
        )}@2x.png`;
      }, refresh_time);

      // start circle animation
      setTimeout(() => {
        document.getElementById("turning_circle").classList.add("turn");
      }, 300);
      // remove circle animation
      let animate_circle = document.getElementById("turning_circle");
      animate_circle.addEventListener("animationend", () => {
        animate_circle.classList.remove("turn");
      });
    })
    .catch(error => {
      city_input.value = `${data.city.name}, ${data.city.country}`;
      console.error("City not found, try again ¯\\_(ツ)_/¯");
      let error_msg_box = document.getElementById("not_found_container");
      error_msg_box.style.display = "flex";

      document.addEventListener("click", () => {
        error_msg_box.style.display = "none";
      });

      console.log(error);
    });

  // clear search input
  city_input != undefined && (city_input.value = "");

  // hide mobile keyboard after input
  hideVirtualKeyboard();

  // set mobile layout to standard (keyboard closed)
  mobile_layout();
};

// set mobile layout to standard (keyboard closed)
const mobile_layout = () => {
  let circle = document.getElementById("circle");
  let slide_container = document.getElementById("slide-container");
  circle.style.margin = "20px 0";
  slide_container.style.display = "block";

  window.scrollTo(0, 1); // macht das was???
};

// loading Berlin as default
let forecast = url + city + "&units=" + unit + apiKey;
// let display_city = document.getElementById("display_city");
// display_city.innerHTML = `Berlin, DE`;
callAPI(forecast);

// change units to metric
let celsius = document.getElementById("celsius");
let imperial = document.getElementById("imperial");
celsius.addEventListener("click", () => {
  unit = "metric";
  celsius.classList.add("buttonOn");
  imperial.classList.add("buttonOff");
  celsius.classList.remove("buttonOff");
  imperial.classList.remove("buttonOn");
  let city_input = document.getElementById("city-input").value;
  city_input.slice(0, 2);
  let forecast = "";
  forecast = url + city_input + "&units=" + unit + apiKey;
  callAPI(forecast);
});
// change units to imperial
imperial.addEventListener("click", () => {
  unit = "imperial";
  imperial.classList.add("buttonOn");
  celsius.classList.add("buttonOff");
  imperial.classList.remove("buttonOff");
  celsius.classList.remove("buttonOn");
  let city_input = document.getElementById("city-input").value;
  let forecast = "";
  forecast = url + city_input + "&units=" + unit + apiKey;
  callAPI(forecast);
});

// let search_button = document.getElementById("search_button");
// search_button.addEventListener("click", () => {
//   let city_input = document.getElementById("city-input");
//   if (city_input.value != "") {
//     let forecast = url + city_input.value + "&units=" + unit + apiKey;
//     callAPI(forecast, city_input);
//   }
// });

// create url with user input
document.querySelector("#city-input").addEventListener("keypress", function(e) {
  let key = e.which || e.keyCode;
  if (key === 13) {
    let city_input = document.getElementById("city-input");
    if (city_input.value != "") {
      let forecast = url + city_input.value + "&units=" + unit + apiKey;
      callAPI(forecast, city_input);
    }
  }
});

// attribute settings for open keyboard on mobile phones
const mobile_keyboard_open = () => {
  let circle = document.getElementById("circle");
  let slide_container = document.getElementById("slide-container");
  circle.style.margin = "5% 0%";
  slide_container.style.display = "none";
};

// attribute settings back to mobile view without keyboard
const close_mobile_keyboard = () => {
  setTimeout(() => {
    var grid = document.getElementById("grid-selector");
    var except = document.getElementById("city-input");
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

// change layout, when keyboard is open on mobile devices
document.getElementById("city-input").addEventListener("click", () => {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    // attribute settings for open keyboard on mobile phones
    mobile_keyboard_open();

    close_mobile_keyboard();
  }
});
