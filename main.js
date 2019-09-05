const url = `https://api.openweathermap.org/data/2.5/weather?q=`;
const apiKey = `&units=metric&APPID=d84a3b5a1d8ffa8e702549aec5e6ec79`;
let forecast = `https://api.openweathermap.org/data/2.5/forecast?q=`;
let finalUrl;
let data;
let urlArray = [];
let today;

const presentDay = [`Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`];
const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

// get user input
let cityName = document.getElementById("input");
cityName.addEventListener("keyup", function(event) {
    event.preventDefault();

    if (event.keyCode === 13) {
        forecast = `https://api.openweathermap.org/data/2.5/forecast?q=`;
        finalUrl = "";
        urlArray = [];
        finalUrl = url + cityName.value + apiKey;
        forecast = forecast + cityName.value + apiKey;
        urlArray.push(finalUrl, forecast);
        getWeatherData();
    }
});

//**************************************************************************************++

let x = 1;

function getWeatherData() {
    Promise.all(urlArray.map(u => fetch(u)))
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(weather => {
            outputData(weather[0], weather[1]);
        });
}

// fetch API
// async function getWeatherData() {
//     const response = await fetch(finalUrl);
//     console.log(response);
//     data = await response.json();
//     console.log(data);
//     outputData(data);
//     return data;
// }

// function getWeatherData() {
//     Promise.all([fetch(finalUrl), fetch(forecast)])
//         .then(resp => resp.json()) // Transform the data into json
//         .then(function(data) {
//             console.log(data);
//         })

//         .catch(err => {
//             console.log(err);
//         });
// }

//*******************************************************************************

// write data to html elements
function outputData(city, forecast) {
    document.querySelector(`.two`).innerText = `Temp: ${city.main.temp}° C`;
    document.querySelector(`.three`).innerText = city.name;
    document.querySelector(`.four`).innerText = `Wind Speed: ${city.wind.speed} km/s`;
    const [day, time, thirdDay, fourthDay, fifthDay] = getDate();
    document.querySelector(`.five`).innerText = `${presentDay[day]}, ${time}`;
    document.querySelector(`.six`).innerText = `Humidity: ${city.main.humidity}`;
    document.querySelector(`.seven`).innerText = `${city.weather[0].description}`;
    document.querySelector(`.ten`).innerText = `${thirdDay}`;
    document.querySelector(`.eleven`).innerText = `${fourthDay}`;
    document.querySelector(`.twelve`).innerText = `${fifthDay}`;

    // min max temp
    document.querySelector(`.fourteen`).innerText = `Temp: ${city.main.temp_min}° C`;
    document.querySelector(`.twenty`).innerText = `Temp: ${city.main.temp_max}° C`;

    // look in object for highest/lowest temps for next days
    let highLowTemps = highLowTemp(forecast);
    // console.log(highLowTemps);

    document.querySelector(`.fifteen`).innerText = `Temp: ${forecast.list[4].main.temp_max}° C`;
    document.querySelector(`.twenty_one`).innerText = `Temp: ${forecast.list[4].main.temp_min}° C`;
}

// get day and time
function getDate() {
    let date = new Date();
    let day = date.getDay();
    let time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    let thirdDay = ("0" + (date.getDate() + 2)).slice(-2) + ". " + month[date.getMonth()].slice(0, 3);
    let fourthDay = ("0" + (date.getDate() + 3)).slice(-2) + ". " + month[date.getMonth()].slice(0, 3);
    let fifthDay = ("0" + (date.getDate() + 4)).slice(-2) + ". " + month[date.getMonth()].slice(0, 3);
    today =
        date.getFullYear() +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + (date.getDay() + 1)).slice(-2);

    return [day, time, thirdDay, fourthDay, fifthDay];
}

function highLowTemp(forecast) {
    let highTempArray = [];
    let lowTempArray = [];
    let highTmp = [];
    let lowTmp = [];

    let counter = 0;
    for (let i = 0; i < 7; i++) {
        if (typeof result[i][6] === `string`) {
            if (result[i][6].substring(8, 10) === presentDay) {
                counter++;
            }
        }
        if (typeof result[i][7] === `string`) {
            if (result[i][7].substring(8, 10) === presentDay) {
                counter++;
            }
        }
    }

    let countVar = counter;
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 8; i++) {
            highTmp.push(forecast.list[i + countVar].main.temp_max);
            lowTmp.push(forecast.list[i + countVar].main.temp_min);
        }
        countVar++;
    }
    highTempArray.push(Math.max.apply(Math, highTmp));
    lowTempArray.push(Math.max.apply(Math, lowTmp));

    result = forecast.list.map(Object.values);

    let date = new Date();
    let presentDay = ("0" + (date.getDay() + 1)).slice(-2);

    // console.log(result[0][6].substring(8, 10));
    // console.log(presentDay);
    console.log(counter);
    // console.log(result);
    // console.log(result[0][6]);

    // for (var i in forecast) console.log([i, forecast]);

    // for (var i in forecast) result.push([i, forecast.list[i]]);
    // console.log(forecast.list);

    // console.log(result);

    // console.log(forecast);
    // console.log(Array.from(forecast));

    // console.log(lowTmp);
    // console.log(lowTempArray);
    // console.log(highTmp);
    // console.log(highTempArray);

    return [Math.max.apply(Math, highTempArray), Math.min.apply(Math, lowTempArray)];
}
