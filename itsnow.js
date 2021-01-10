// update every 61 seconds to guarantee minute change
const UPDATE = 61000

const HEMISPHERE = "N"

const HOUR = new Array(
    "middle of night",  // 0
    "nighttime (before dawn)",  // 1
    "nighttime (before dawn)",  // 2
    "nighttime (before dawn)",  // 3
    "nighttime (before dawn)",  // 4
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
    "nightime",  // 21
    "nightime",  // 22
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
const TIME_INCREMENT = 0
// the timestep we're on now, in TIME_INCREMENT != 0
TIME_STEP = 0

function gettime() {
    let date = new Date()
    if (TIME_INCREMENT != 0) {
        date.setSeconds(START_TIME.getSeconds() + TIME_INCREMENT * TIME_STEP)
        TIME_STEP += 1
    }
    let now = new Intl.DateTimeFormat('en', {dateStyle: 'full', timeStyle: 'long'})
    now = now.formatToParts(date).reduce((o, i) => ({...o, [i.type]: i.value}), {})
    return {
        day_name: `${now.weekday}`,
        time_name: HOUR[date.getHours()],
        time: `${now.hour}:${now.minute} ${now.dayPeriod}`,
        date: `${now.month} ${now.day} ${now.year}`,
        season: SEASON[HEMISPHERE][date.getMonth()]
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
    }
}

function setContent(part) {     
    let time = gettime()
    part.day_name.innerHTML= time.day_name
    part.time_name.innerHTML= time.time_name
    part.time.innerHTML= time.time
    part.date.innerHTML= time.date
    part.season.innerHTML= time.season
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
    let dim = getdims(part)
    part.main.style.left = `${dim.main_left}vw`
    part.main.style.top = `${dim.main_top}vh`
    setContent(part)
}

// set content so width is right for moveit()
setContent(getpart())

// allow time for positioning / sizing
// also adjust to put updates close to actual minute changes
let delay = Math.max(0.5, 60 - new Date().getSeconds() % 60)
setTimeout(() => {moveit(); setInterval(moveit, UPDATE)}, delay * 1000)

// vim:sw=4
