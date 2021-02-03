// update every UPDATE milliseconds
const UPDATE = 60000

// set to "N" or "S", default (null) attempts to calc. based on daylight savings
HEMISPHERE  = null

EVENTS = [
    {day_name: "Saturday", text: "12:00 - visitor"},
    {day_name: "Sunday", text: "12:00 - visitor"},
    {day_name: "Monday", text: "12:00 - visitor"},
    {day_name: "Tuesday", text: "12:00 - visitor"},
    {day_name: "Wednesday", text: "12:00 - visitor"},
    {day_name: "Thursday", text: "12:00 - visitor"},
    {day_name: "Friday", text: "12:00 - visitor"},
    {date: "February 4 2021", text: "9:45 Optometrist"},
]

ZONES = new Array(
    {name: "Christchurch", zone: "Pacific/Auckland"},
    {name: "Duluth", zone: "America/Chicago"},
    {name: "London", zone: "Europe/London"},
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
    N: ["winter","winter","spring","spring","spring","summer",
        "summer","summer","autumn","autumn","autumn", "winter"],
    S: ["summer","summer","autumn","autumn","autumn","winter",
        "winter","winter","spring","spring","spring", "summer"],
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
    let date = new Date()
    if (TIME_INCREMENT != 0) {
        date.setSeconds(START_TIME.getSeconds() + TIME_INCREMENT * TIME_STEP)
        TIME_STEP += 1
    }
    date.setSeconds(date.getSeconds()+offset)
    let now = new Intl.DateTimeFormat('en', {dateStyle: 'full', timeStyle: 'long'})
    now = now.formatToParts(date).reduce((o, i) => ({...o, [i.type]: i.value}), {})
    let hemisphere = whatHemisphere()
    let season = ""
    if (hemisphere) {
        season = SEASON[hemisphere][date.getMonth()]
    }

    return {
        day_name: `${now.weekday}`,
        time_name: HOUR[date.getHours()],
        time: `${now.hour}:${now.minute} ${now.dayPeriod}`,
        date: `${now.month} ${now.day} ${now.year}`,
        season: season,
        now: date,
    }
}

function getpart() {
    return {
        main: document.getElementById("main_box"),
        day_name: document.querySelector("#main_box .day_name"),
        time_name: document.querySelector("#main_box .time_name"),
        time: document.querySelector("#main_box .time"),
        date: document.querySelector("#main_box .date"),
        season: document.querySelector("#main_box .season"),
        zones: document.getElementById("zones"),
        events: document.getElementById("events"),
    }
}

function getEvents() {
    let events = []
    for (let offset=0; offset < 2; offset++) {
        let day = offset == 0 ? "Today" : "Tomorrow"
        let time = getTime(offset*24*60*60)
        EVENTS.forEach((event_) => {
            if (event_.day_name == time.day_name) {
                events.push(`${day}: ${event_.text}`)
            }
            if (event_.date == time.date) {
                events.push(`${day}: ${event_.text}`)
            }
        })
    }
    return(events)
}

function setContent(part) {     
    let time = getTime()
    part.day_name.innerHTML= time.day_name
    part.time_name.innerHTML= time.time_name
    part.time.innerHTML= time.time
    part.date.innerHTML= time.date
    part.season.innerHTML= time.season
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
    getZones().forEach((zone) => {
        let div = document.createElement('DIV')
        let hour = time.now.toLocaleTimeString(
                "en-US", {timeZone:zone.zone, hourCycle: "h23", hour: "2-digit"})
        hour = parseInt(hour.replace(/ [AP]M/, ''))
        // description of hour without "(before dawn)" clarification
        hour = HOUR[hour].replace(/ \(.*\)/, '')
        let timestr = time.now.toLocaleTimeString(
                "en-US", {timeZone:zone.zone, hour: "numeric", minute: "numeric"})
        div.appendChild(document.createTextNode(`${zone.name}: ${hour} ${timestr}`))
        part.zones.appendChild(div)
    })

}

function getdims(part) {
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
    let part = getpart()
    setContent(part)
    let dim = getdims(part)
    part.main.style.left = `${dim.main_left}vw`
    part.main.style.top = `${dim.main_top}vh`
}

// https://stackoverflow.com/a/7832023/1072212, but fixed
function whatHemisphere() {
    if (HEMISPHERE) return HEMISPHERE
    let y = new Date()
    if (y.getTimezoneOffset==undefined) return null
    y = y.getFullYear()
    let jan = -(new Date(y, 0, 1, 0, 0, 0, 0).getTimezoneOffset())
    let jul = -(new Date(y, 6, 1, 0, 0, 0, 0).getTimezoneOffset())
    let diff = jan - jul
    if (diff <  0) return 'N'
    if (diff >  0) return 'S'
    return null
}

function getZones() {
    let zones = new Array()
    let now = new Date()
    let nowText = now.toLocaleString("en-US", {timeZoneName: 'short'})
    ZONES.forEach((z) => {
        let thenText = now.toLocaleString("en-US", {timeZone:z.zone, timeZoneName: 'short'})
        if (nowText != thenText) {
            zones.push({
                name: z.name,
                current: (nowText == thenText),
                date: new Date(thenText),
                zone: z.zone,
            })
        }
    })
    return zones
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

// vim:sw=4
