const UPDATE = 100
HEIGHT = null

function gettime() {
    return {
        day_name: "Saturday",
        time_name: "Nearly now",
        time: "12:12 p.m.",
        date: "January 31, 2022",
        season: "winter",
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
    console.log(HEIGHT)
    let body_width = window.innerWidth
    let body_height = window.innerHeight
    let main_width = part.main.offsetWidth / body_width * 100
    let main_height = HEIGHT / body_height * 100
    return {
        // for logging
        body_width: body_width,
        body_height: body_height,
        main_width: main_width,
        main_height: main_height,

        main_left: Math.random() * (100 - main_width),
        main_top: Math.random() * (100 - main_height),
    }
}

function moveit() {
    let part = getpart()
    let dim = getdims(part)
    console.log(dim)
    part.main.style.position = "fixed"
    part.main.style.left = `${dim.main_left}vw`
    part.main.style.top = `${dim.main_top}vh`
    setContent(part)

}

function startup() {
    HEIGHT = document.querySelector("body").offsetHeight
    setInterval(moveit, UPDATE)
}

// set content so width is right for moveit()
let part = getpart()
console.log(part)
setContent(part)

setTimeout(startup, 1000)  // allow time for positioning / sizing

// vim:sw=4

