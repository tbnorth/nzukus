const CITY = "2185148"
const APIKEY = "ddf9c6c8ad10362df958e1a938c1c4e1"

async function itisnow_weather() {
    // console.log("Fetching weather", new Date())
    return fetch(
        `http://api.openweathermap.org/data/2.5/weather?id=${CITY}&appid=${APIKEY}`
    ).then(response => response.json().then(format_weather))
}

function format_weather(response) {
    return `${Math.round(response.main.temp - 273.15)} C`
}
