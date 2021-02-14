// update every UPDATE milliseconds
const UPDATE = 60000
const WEATHER_MINUTES = 15

EVENTS = [
    {day_name: "Saturday", text: "12:00 - visitor"},
    {day_name: "Sunday", text: "12:00 - visitor"},
    {day_name: "Monday", text: "12:00 - visitor"},
    {day_name: "Tuesday", text: "12:00 - visitor"},
    {day_name: "Wednesday", text: "12:00 - visitor"},
    {day_name: "Thursday", text: "12:00 - visitor"},
    {day_name: "Friday", text: "12:00 - visitor"},
    {date: "February 16, 2021", text: "Groceries"},
]

ZONES = new Array(  // first is primary, others are for reference
    {name: "Christchurch", zone: "Pacific/Auckland", hemisphere: 'S'},
    {name: "Duluth", zone: "America/Chicago", hemisphere: 'N'},
    {name: "London", zone: "Europe/London", hemisphere: 'N'},
)

const HOUR = new Array(
    "middle of night",  // 0
    "night time (before dawn)",  // 1
    "night time (before dawn)",  // 2
    "night time (before dawn)",  // 3
    "night time (before dawn)",  // 4
    "very early morning",  // 5
    "very early morning",  // 6
    "early morning",  // 7
    "early morning",  // 8
    "morning",  // 9
    "morning",  // 10
    "around midday",  // 11
    "around midday",  // 12
    "early afternoon",  // 13
    "afternoon",  // 14
    "afternoon",  // 15
    "early evening",  // 16
    "evening",  // 17
    "evening",  // 18
    "late evening",  // 19
    "late evening",  // 20
    "night time",  // 21
    "night time",  // 22
    "middle of night",  // 23
)

const SEASON = {
    N: ["Winter","Winter","Spring","Spring","Spring","Summer",
        "Summer","Summer","Autumn","Autumn","Autumn", "Winter"],
    S: ["Summer","Summer","Autumn","Autumn","Autumn","Winter",
        "Winter","Winter","Spring","Spring","Spring", "Summer"],
}


// for testing
// time run started
const START_TIME = new Date()
// time (seconds) to advance per update, 0 => use real time
// you probably want to set UPDATE to a low (300) value too
const TIME_INCREMENT = 0
// the timestep we're on now, in TIME_INCREMENT != 0
TIME_STEP = 0

function getTime(offset=0) {
    // get time with offset (for tomorrow's events) and acceleration for
    // debugging
    let date = new Date()
    if (TIME_INCREMENT != 0) {  //debugging acceleration
        date.setSeconds(START_TIME.getSeconds() + TIME_INCREMENT * TIME_STEP)
        TIME_STEP += 1
    }
    date.setSeconds(date.getSeconds()+offset)
    return date
}

function getpart() {
    // get DOM elements that receive changing values
    return {
        main: document.getElementById("main_box"),
        day_name: document.querySelector("#main_box .day_name"),
        time_name: document.querySelector("#main_box .time_name"),
        time: document.querySelector("#main_box .time"),
        date: document.querySelector("#main_box .date"),
        season: document.querySelector(".season"),
        weather: document.querySelector(".weather"),
        zones: document.getElementById("zones"),
        events: document.getElementById("events"),
    }
}

function getEvents() {
    // get events for today / tomorrow
    let events = []
    for (let day_offset=0; day_offset < 2; day_offset++) {
        let day = day_offset == 0 ? "Today" : "Tomorrow"
        let time = getZones(offset=24*60*60*day_offset).shift()
        EVENTS.forEach((event_) => {
            if (event_.day_name == time.day_name) {
                events.push(`${day}: ${event_.text}`)
            }
            else if (event_.date == time.date) {
                events.push(`${day}: ${event_.text}`)
            }
        })
    }
    return(events)
}

function setContent(part) {     
    // put changing values into DOM
    let zones = getZones()
    let time = zones.shift()
    part.day_name.innerHTML = time.day_name
    part.time_name.innerHTML = time.time_name
    part.time.innerHTML = time.time
    part.date.innerHTML = time.date
    part.season.innerHTML = time.season
    // events listing
    while (part.events.firstChild) {
        part.events.removeChild(part.events.firstChild)
    }
    getEvents().forEach((event_) => {
        let div = document.createElement('DIV')
        div.appendChild(document.createTextNode(event_))
        part.events.appendChild(div)
    })
    // zones listing
    while (part.zones.firstChild) {
        part.zones.removeChild(part.zones.firstChild)
    }
    zones.forEach((zone) => {
        let div = document.createElement('DIV')
        let time_name = zone.time_name.replace(/ \(.*\)/, '')
        div.appendChild(document.createTextNode(`${zone.name}: ${time_name} ${zone.time}`))
        part.zones.appendChild(div)
    })

}

function getdims(part) {
    // calculate sizes
    let body_width = window.innerWidth
    let body_height = window.innerHeight
    let main_width = part.main.offsetWidth / body_width * 100
    let main_height = part.main.offsetHeight / body_height * 100
    let main_left = Math.random() * (100 - main_width)
    let main_top = Math.random() * (100 - main_height)
    if (TIME_INCREMENT != 0) {
        // don't bounce around while testing time formatting
        main_left = 0
        main_top = 0
    }

    return {
        // for logging
        body_width: body_width,
        body_height: body_height,
        main_width: main_width,
        main_height: main_height,

        main_left: main_left,
        main_top: main_top,
    }
}

function moveit() {
    // move to new part of screen every minute
    let part = getpart()
    setContent(part)
    let dim = getdims(part)
    part.main.style.left = `${dim.main_left}vw`
    part.main.style.top = `${dim.main_top}vh`
}

function getZones(offset=0) {
    // get descriptive text for each zone
    let zones = new Array()
    let now = getTime(offset=offset)
    ZONES.forEach((z) => {
        zones.push({
            name: z.name,
            zone: z.zone,
            day_name: now.toLocaleString("en-US", {timeZone:z.zone, weekday: 'long'}),
            time_name: HOUR[parseInt(now.toLocaleString("en-US", {timeZone:z.zone, hourCycle: 'h23', hour: 'numeric'}).replace(/ [AP]M/, ''))],
            time: now.toLocaleString("en-US", {timeZone:z.zone, hour: 'numeric', minute: 'numeric'}),
            date: now.toLocaleString("en-US", {timeZone:z.zone, month: 'long', day: 'numeric', year: 'numeric'}),
            season: SEASON[z.hemisphere][now.getMonth()],
        })
    })
    return zones
}

function set_weather(response) {
    if (response === null) {
        return
    }
    getpart().weather.innerHTML = `, ${response}`
}

// set content so width is right for moveit()
setContent(getpart())

// allow time for positioning / sizing
// also adjust to put updates close to actual minute changes
let delay = Math.max(0.5, 60 - new Date().getSeconds() % 60)
if (TIME_INCREMENT != 0) {
    delay = 0.5  // don't wait when testing
}
setTimeout(() => {moveit(); setInterval(moveit, UPDATE)}, delay * 1000)
itisnow_weather().then(set_weather)
setInterval(() => {itisnow_weather().then(set_weather)}, WEATHER_MINUTES*60*1000)
// vim:sw=4
