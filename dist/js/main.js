// Set the variables

// Time check
let now = moment.tz('Europe/Amsterdam');

// function timeSwitch() {

//     (now = moment()) ? now = moment.tz('Europe/Amsterdam'): now = moment();
//     setTimeout(timeSwitch, 500);

// }

// if (moment().isSame(moment.tz('Europe/Amsterdam'))) {
//     now = moment();
// } else {
//     console.log('switcher');
//     timeSwitch();
// }



//Get DOM
const sessions = document.querySelectorAll('.session-title');
const tracks = document.querySelectorAll('.track');
const locations = document.querySelectorAll('.location');
const sessTime = document.querySelectorAll('.session-time');



// Data
let program = [];

// Get the program
fetch('../dist/csv/convertcsv.json')
    .then((response) => response.json())
    .then((responseJSON) => {

        program.push(...responseJSON);


        // Sort by start time
        // Will have to add sort by date first

        function compareDate(a, b) {
            a = a.Date;
            b = b.Date;

            let comp = 0;

            if (a > b) {
                comp = 1;
            } else if (a < b) {
                comp = -1;
            }

            return comp;
        }

        function compareTime(a, b) {

            const timeA = (a['Start Time'].length < 8) ? "0" + a['Start Time'] : a['Start Time'];

            const timeB = (b['Start Time'].length < 8) ? "0" + b['Start Time'] : b['Start Time'];

            let comparison = 0;
            if (timeA > timeB) {
                comparison = 1;
            } else if (timeA < timeB) {
                comparison = -1;
            }
            return comparison;
        }

        program.sort(compareDate,compareTime);

        console.table(program);

        // Unique filter ->
        function genTopics(value, index, self) {
            return self.indexOf(value) === index;
        }
        const trackList = [];

        for (e in program) {
            trackList.push(program[e]['Session Track'])
        }

        let uniqueTracks = trackList.filter(genTopics).map(x => x.toLowerCase().replace(/\s|\//g, "-"));

        // Print unique strings to console for copying to stylesheet
        console.table(uniqueTracks);

        // Parcel out program
        let result = [];

        // Filter out constant events
        function removeEvents(v) {
            if (['Book Exhibit & HSS Cafe','Registration','Quiet Space','Meeting Point','Nursing Mother\'s Room'].includes(v['Session Name'])) {
                return;
            } else {
                return v;
            };
        }

        let eventsRemoved = program.filter(removeEvents);



        let loopsToRun = Math.ceil(eventsRemoved.length / 6);

        for (let p = 0; p < loopsToRun; p++) {
            result[p] = eventsRemoved.slice(0 + (p * 6), 6 + (p * 6));
        }
        console.log(result[0]);
        return result[0];

    }).then((result) => {
        // Write content to DOM
        function writeToDom() {

            // Write session title to DOM
            sessions.forEach(function (e, i) {
                e.innerHTML = `${result[i]['Session Name']}`;
            });

            // Write topics to DOM
            tracks.forEach(function (e, i) {
                let track = ((result[i]['Session Track'] != "") ? `${result[i]['Session Track'].toLowerCase().replace(/\s|\//g,"-")}` : "no-track");
                e.classList.add(track);
            })

            // Write venue to DOM
            locations.forEach(function (e, i) {
                let location = result[i]['Venue'];
                e.innerHTML = location;
            })

            // Write start and end time to DOM
            sessTime.forEach(function (e, i) {

                const sessStart = (result[i]['Start Time'].length < 8) ? "0" + result[i]['Start Time'].substring(0, 4) : result[i]['Start Time'].substring(0, 5);
                const sessEnd = (result[i]['End Time'].length < 8) ? "0" + result[i]['End Time'].substring(0, 4) : result[i]['End Time'].substring(0, 5);
                const sessTime = `${sessStart}&ndash;${sessEnd}`;
                e.innerHTML = sessTime;
            })
        }
        writeToDom();
    })

// Set time in the DOM

function setTime() {
    // Define clocks
    const oneClck = "🕐";
    const twoClck = "🕑";
    const threeClck = "🕒";
    const fourClck = "🕓";
    const fiveClck = "🕔";
    const sixClck = "🕕";
    const sevenClck = "🕖";
    const eightClck = "🕗";
    const nineClck = "🕘";
    const tenClck = "🕙";
    const elevenClck = "🕚";
    const twelveClck = "🕛";

    const timeDiv = document.querySelector('.time > p');
    const dateDiv = document.querySelector('.date > p');

    let date = now.format('DD MMM YYYY');
    let time = now.format('HH:mm');
    let hourIcon;
    let hour = parseInt(now.format('hh'));

    switch (hour) {
        case 0:
            hourIcon = twelveClck;
            break;
        case 1:
            hourIcon = oneClck;
            break;
        case 2:
            hourIcon = twoClck;
            break;
        case 3:
            hourIcon = threeClck;
            break;
        case 4:
            hourIcon = fourClck;
            break;
        case 5:
            hourIcon = fiveClck;
            break;
        case 6:
            hourIcon = sixClck;
            break;
        case 7:
            hourIcon = sevenClck;
            break;
        case 8:
            hourIcon = eightClck;
            break;
        case 9:
            hourIcon = nineClck;
            break;
        case 10:
            hourIcon = tenClck;
            break;
        case 11:
            hourIcon = elevenClck;
            break;
        case 12:
            hourIcon = twelveClck;
    }

    // timeDiv.innerHTML = `${hourIcon}&nbsp;${hour}:${min}`;
    timeDiv.innerHTML = `${hourIcon}&nbsp;${time}`;
    dateDiv.innerHTML = `📅&nbsp;${date}`;

    let interval = setTimeout(setTime, 500);
}

setTime();



// Transition in the elements
let slideIn = document.querySelectorAll('.session-title-container');



slideIn.forEach((e, i) => {
    setTimeout(() => e.classList.add('stc-active'), i * 250);
});

// Weather
function icon(weatherID) {

    switch (weatherID.charAt(0)) {
        case "2":
            return "⛈️";
            break;
        case "3":
            return "☁️";
            break;
        case "5":
            return "🌧️";
            break;
        case "6":
            return "🌨️";
            break;
        case "7":
            return "🌫️";
            break;
        case "8":
            return "⛅";
            break;
        default:
            return "☀️";

    };
}

// Convert F to C
function celsius(x) {
    return Math.trunc((x - 32) * 5 / 9);
}

// Weather
const weatherURL = "https://api.openweathermap.org/data/2.5/weather?id=2745912&units=imperial&appid=94e8ffdaf0cec6782fa67b86afe1a450";

fetch(weatherURL)
    .then((response) => response.json())
    .then((responseJSON) => {

        const weather = document.querySelector('.weather > p');
        const tempF = Math.trunc(responseJSON.main.temp);
        const weatherDesc = responseJSON.weather[0].description;
        const id = responseJSON.weather[0].id.toString();

        let emoji = icon(id);

        weather.innerHTML = `${emoji} ${tempF}&deg; F (${celsius(tempF)}&deg; C)
        `;

        // Low: ${min}&deg; F (${celsius(min)}&deg; C) F / HIGH: ${max}&deg; F (${celsius(max)}&deg; C) `;


    })

// Forecast

function getForecast() {
    const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=2745912&units=imperial&appid=94e8ffdaf0cec6782fa67b86afe1a450";

    fetch(forecastURL)
        .then((response) => response.json())
        .then((forecastData) => {



            const tomForecastDom = document.querySelector('.tom-forecast');
            let tomTempArr = [];
            let tomWeatherArr = [];

            for (i in forecastData.list) {
                if (moment.unix(forecastData.list[i].dt).format('dd') ===
                    moment().add(1, 'd').format('dd')) {
                    tomTempArr.push(forecastData.list[i].main.temp);
                    tomWeatherArr.push(forecastData.list[i].weather[0].id)
                }
            }

            let tomTemp = Math.trunc(tomTempArr.reduce((a, b) => a + b) / tomTempArr.length);
            let tomWeatherID = Math.trunc(tomWeatherArr.reduce((a, b) => a + b) / tomWeatherArr.length);
            let emoji = icon(tomWeatherID.toString());
            tomForecastDom.innerHTML = `${emoji} ${tomTemp}&deg F (${celsius(tomTemp)}&deg; C)`
        })

    // Set timeout to return forecast every hour
    setTimeout(getForecast, 3600000);
    console.log('Forecast got')
}

// Get forecast on page load
getForecast();

// Resize element
const header = document.querySelector('.header-container').offsetHeight;
const container = document.querySelector('.container');

//Set initial size of container
container.style.minHeight = `${window.innerHeight - header - 50}px`;

// Resize container depending on window size
function resizeWindow() {
    container.style.minHeight = `${window.innerHeight - header - 50}px`;

}

window.onresize = resizeWindow;