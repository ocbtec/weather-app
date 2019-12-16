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
  "Dez"
];

let month = "";
let tmpDate = "";

let unit = "metric";
let city = "Berlin";

let data = "";

const callAPI = (forecast, city_input) => {
  axios
    .get(forecast)
    .then(response => {
      // console.log("city at api start" + city_input);
      console.log(forecast);

      data = response.data;

      // get month and day from the weather API
      const getDate = num => {
        let day = 39 - num;
        tmpDate = data.list[day].dt_txt.slice(5, 10);
        day = tmpDate.slice(3, 5);
        month = monthArray[tmpDate.slice(0, 2) - 1];
        return `${month} ${day}`;
      };

      // get temperature from weather API
      const getTemp = num => {
        let day = 39 - num;
        let temp = data.list[day].main.temp;
        return temp;
      };

      const getTempMin = num => {
        let day = 39 - num;
        let temp = data.list[day].main.temp_min;
        return temp;
      };

      const getTempMax = num => {
        let day = 39 - num;
        let temp = data.list[day].main.temp_max;
        return temp;
      };

      const getOvercast = num => {
        let day = 39 - num;
        let temp = data.list[day].weather[0].description;
        return temp;
      };

      const getWind = num => {
        let day = 39 - num;
        let temp = data.list[day].wind.speed;
        return temp;
      };

      const getHumidity = num => {
        let day = 39 - num;
        let temp = data.list[day].main.humidity;
        return temp;
      };

      // print out the the weather forecast for the next 6 days TO console
      // console.log(`It is now ${getTemp(39)} in ${capitalize(city)}`);
      // console.log(`The current weather conditions are: ${data.list[0].weather[0].description}`);
      // console.log(`Forecast for tomorrow: ${data.list[0].main.temp} in ${capitalize(city)}`);
      // console.log(`Forecast for ${getDate(24)}: ${getTemp(24)} in ${capitalize(city)}`);
      // console.log(`Forecast for ${getDate(16)}: ${getTemp(16)} in ${capitalize(city)}`);
      // console.log(`Forecast for ${getDate(8)}: ${getTemp(8)} in ${capitalize(city)}`);
      // console.log(`Forecast for ${getDate(0)}: ${getTemp(0)} in ${capitalize(city)}`);

      let temp = document.getElementById("temp");
      temp.innerHTML =
        getTemp(39)
          .toString()
          .slice(0, 4) + '<span id="temp_symbol"></span>';
      // .toFixed(4)

      console.log(temp.innerHTML);

      let temp_symbol = document.getElementById("temp_symbol");
      if (unit == "metric") {
        temp_symbol.innerHTML = " °C";
      } else if (unit == "imperial") {
        temp_symbol.innerHTML = " °F";
      }

      let temp_min = document.getElementById("temp_min");
      temp_min.innerHTML = `<span id="tempMinSpan">Min</span> ${getTempMin(39)
        .toString()
        .slice(0, 4)}°`;
      document.getElementById("tempMinSpan").style.fontSize = "15pt";

      let temp_max = document.getElementById("temp_max");
      temp_max.innerHTML = `<span id="tempMaxSpan">Max</span> ${getTempMax(39)
        .toString()
        .slice(0, 4)}°`;
      document.getElementById("tempMaxSpan").style.fontSize = "15pt";

      let overcast = document.getElementById("overcast");
      overcast.innerHTML = getOvercast(39);

      let wind = document.getElementById("wind");
      wind.innerHTML = `Wind: ${getWind(39)} km/h`;

      let humidity = document.getElementById("humidity");
      humidity.innerHTML = `Humidity: ${getHumidity(39)}`;

      let country = data.city.country;
      console.log(country);

      display_city.innerHTML = `${
        data.city.name == undefined ? "Berlin" : data.city.name
      }, ${country}`;
    })
    .catch(error => {
      console.error("City not found, try again ¯\\_(ツ)_/¯");

      console.log(error);

      let error_msg_box = document.getElementById("not_found_container");
      error_msg_box.style.display = "flex";

      let error_close = document.getElementById("not_found_icon");
      error_close.addEventListener("click", () => {
        error_msg_box.style.display = "none";
      });
      console.log(error);
    });

  // clear search input
  city_input != undefined && (city_input.value = "");
  // console.log("CITY: " + city_input.value);

  console.log("CITY: " + city);

  // hide mobile keyboard after input
  hideVirtualKeyboard();
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

  let city_input = document.getElementById("city_input").value;
  city_input = document.getElementById("city_input").value;

  let forecast = "";
  city_input != ""
    ? (forecast = url + city_input + "&units=" + unit + apiKey)
    : (forecast = url + city + "&units=" + unit + apiKey);

  console.log(forecast);

  callAPI(forecast);
});

imperial.addEventListener("click", () => {
  unit = "imperial";

  imperial.classList.add("buttonOn");
  celsius.classList.add("buttonOff");
  imperial.classList.remove("buttonOff");
  celsius.classList.remove("buttonOn");

  let city_input = document.getElementById("city_input").value;
  city_input = document.getElementById("city_input").value;

  let forecast = "";
  city_input != ""
    ? (forecast = url + city_input + "&units=" + unit + apiKey)
    : (forecast = url + city + "&units=" + unit + apiKey);

  console.log(city_input);

  console.log(forecast);

  callAPI(forecast);
});

let search_button = document.getElementById("search_button");
search_button.addEventListener("click", () => {
  let city_input = document.getElementById("city_input");
  if (city_input.value != "") {
    let forecast = url + city_input.value + "&units=" + unit + apiKey;
    callAPI(forecast, city_input);
  }
});

document.querySelector("#city_input").addEventListener("keypress", function(e) {
  let key = e.which || e.keyCode;
  if (key === 13) {
    let city_input = document.getElementById("city_input");
    if (city_input.value != "") {
      let forecast = url + city_input.value + "&units=" + unit + apiKey;
      callAPI(forecast, city_input);
    }
  }
});
