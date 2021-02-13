// this function will be called every WEATHER_MINUTES minutes
// it should return a Promise that resolves to a string describing
// the weather at the target location.

function itisnow_weather() {
    return new Promise( resolve => {
        resolve(null)
    })
}

// here's an example using Open Weather Map

const CITY = "6696480" // look it up at https://openweathermap.org/
const APIKEY = "YOUR_KEY_HERE"

// delete the function above and rename this one 'itisnow_weather'
async function OWM_itisnow_weather() {
    // console.log("Fetching weather", new Date())
    return fetch(
        `//api.openweathermap.org/data/2.5/weather?id=${CITY}&appid=${APIKEY}`
    ).then(response => response.json().then(format_weather))
}

function format_weather(response) {
    return `${Math.round(response.main.temp - 273.15)} C`
}
