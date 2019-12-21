const axios = require("axios");
let capitalize = require("capitalize");
let hideVirtualKeyboard = require("hide-virtual-keyboard");
// let countryCodeLookup = require("country-code-lookup");

let url = `https://api.openweathermap.org/data/2.5/forecast?q=`;
const apiKey = `&APPID=d84a3b5a1d8ffa8e702549aec5e6ec79`;

// const [city = "berlin", unit = "metric", forecast = url + city + "&units=" + unit + apiKey] = process.argv.slice(2);

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

let refresh_time = 1000;

let data = "";

const callAPI = (forecast, city_input) => {
  axios
    .get(forecast)
    .then(response => {
      // console.log("city at api start" + city_input);

      data = response.data;

      // get month and day from the weather API
      const getDate = num => {
        let day = num;
        tmpDate = data.list[day].dt_txt.slice(5, 10);
        day = tmpDate.slice(3, 5);
        month = monthArray[tmpDate.slice(0, 2) - 1];
        return `${month} ${day}`;
      };

      // const getCurrentTime = num => {
      //   let day = 39 - num;
      //   let time = data.list[day].dt_txt.slice(5, 10);
      //   console.log("TEST ---------------------------------");
      //   console.log(time);

      //   // .slice(5, 10);
      //   // time = tmpTime.slice(3, 5);
      //   // month = monthArray[tmpTime.slice(0, 2) - 1];

      //   return null;
      // };

      // get temperature from weather API
      const getTemp = num => {
        let day = num;
        let temp = data.list[day].main.temp;
        return temp;
      };

      const getFeelsLikeTemp = num => {
        let day = num;
        let temp = data.list[day].main.feels_like;
        return temp;
      };

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

      const getOvercast = num => {
        let day = num;
        let temp = data.list[day].weather[0].description;
        return temp;
      };

      const getWind = num => {
        let day = num;
        let temp = data.list[day].wind.speed;
        return temp;
      };

      const getWindDirection = num => {
        let day = num;
        let wind = data.list[day].wind.deg;
        return wind;
      };

      const getHumidity = num => {
        let day = num;
        let temp = data.list[day].main.humidity;
        return temp;
      };

      const getIcon = num => {
        let day = num;
        let icon = data.list[day].weather[0].icon;
        return icon;
      };

      let temp = document.getElementById("temp-value");
      let temp_string = getTemp(0).toFixed(1);
      setTimeout(() => {
        temp.innerHTML = temp_string;
      }, refresh_time);

      let temp_symbol = document.getElementById("temp-symbol");
      temp_symbol.style.color = "#cccccc";
      setTimeout(() => {
        if (unit == "metric") {
          temp_symbol.innerHTML = " °C";
        } else if (unit == "imperial") {
          temp_symbol.innerHTML = " °F";
        }
      }, refresh_time);

      let feels_like_temp = document.getElementById("feels-like-temp");
      let feels_like_temp_string = getFeelsLikeTemp(0).toFixed(1);

      setTimeout(() => {
        feels_like_temp.innerHTML = `Feels like <span id="feels-like-temp-value">${feels_like_temp_string}°</span>`;
      }, refresh_time + 50);

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

      let overcast = document.getElementById("overcast");

      setTimeout(() => {
        overcast.innerHTML = getOvercast(0);
      }, refresh_time + 110);

      let wind = document.getElementById("wind");
      let wind_string = getWind(0).toFixed(1);

      setTimeout(() => {
        wind.innerHTML = `Wind: ${getWind(0).toFixed(1)} ${
          unit === "metric" ? `m/s` : "mph"
        }`;
      }, refresh_time + 115);

      let humidity = document.getElementById("humidity");

      setTimeout(() => {
        humidity.innerHTML = `Humidity: ${getHumidity(0)}%`;
      }, refresh_time + 120);

      let country = data.city.country;

      // use last city as fallback for input field
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
      let icon = document.getElementById("icon");
      // icon.src = `img/04n@2x.png`;
      // icon.src = `http://openweathermap.org/img/wn/${getIcon(0)}@2x.png`;

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

      let error_close = document.getElementById("not_found_icon");

      document.addEventListener("click", () => {
        error_msg_box.style.display = "none";
      });
      // error_close.addEventListener("click", () => {
      //   error_msg_box.style.display = "none";
      // });
      console.log(error);
    });

  // clear search input
  city_input != undefined && (city_input.value = "");
  // console.log("CITY: " + city_input.value);

  // hide mobile keyboard after input
  hideVirtualKeyboard();

  mobile_layout();
};

const mobile_layout = () => {
  let circle = document.getElementById("circle");
  let slide_container = document.getElementById("slide-container");
  circle.style.margin = "20px 0";
  slide_container.style.display = "block";

  window.scrollTo(0, 1);
};

// loading Berlin as default
let forecast = url + city + "&units=" + unit + apiKey;
// let display_city = document.getElementById("display_city");
// display_city.innerHTML = `Berlin, DE`;
callAPI(forecast);

let celsius = document.getElementById("celsius");
let imperial = document.getElementById("imperial");

celsius.addEventListener("click", () => {
  unit = "metric";

  celsius.classList.add("buttonOn");
  imperial.classList.add("buttonOff");
  celsius.classList.remove("buttonOff");
  imperial.classList.remove("buttonOn");

  let city_input = document.getElementById("city-input").value;
  city_input = document.getElementById("city-input").value;

  console.log("-------------" + city_input);
  city_input.slice(0, 2);

  let forecast = "";
  // city_input != ""
  //   ? (forecast = url + city_input + "&units=" + unit + apiKey)
  //   : (forecast = url + city + "&units=" + unit + apiKey);

  forecast = url + city_input + "&units=" + unit + apiKey;
  console.log(forecast);

  callAPI(forecast);
});

imperial.addEventListener("click", () => {
  unit = "imperial";

  imperial.classList.add("buttonOn");
  celsius.classList.add("buttonOff");
  imperial.classList.remove("buttonOff");
  celsius.classList.remove("buttonOn");

  let city_input = document.getElementById("city-input").value;
  city_input = document.getElementById("city-input").value;

  let forecast = "";
  // city_input != ""
  //   ? (forecast = url + city_input + "&units=" + unit + apiKey)
  //   : (forecast = url + city + "&units=" + unit + apiKey);
  forecast = url + city_input + "&units=" + unit + apiKey;

  console.log(city_input);

  console.log(forecast);

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
        ev.stopPropagation(); //this is important! If removed, you'll get both alerts
      },
      false
    );
  }, 100);
};

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

// const date1 = new Date("August 19, 1975 23:15:30 GMT+07:00");
// console.log(date1.getTimezoneOffset());

// var offset = -8;
// let time = new Date(new Date().getTime() + offset * 3600 * 1000)
//   .toUTCString()
//   .replace(/ GMT$/, "");
// console.log(time);

// let seconds = TimeZone.current.secondsFromGMT();

// let hours = seconds / 3600;
// let minutes = abs(seconds / 60) % 60;

// let tz = String((format = "%+.2d:%.2d"), hours, minutes);
// console.log(tz);

// print(tz); // "+01:00"
