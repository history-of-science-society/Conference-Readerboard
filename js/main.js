// Set the variables

// Time check
// let now = moment.tz('Europe/Amsterdam');
let now = moment();


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
fetch('./csv/convertcsv.json')
    .then((response) => response.json())
    .then((responseJSON) => {

        program.push(...responseJSON);


        // Sort by start time
        // Will have to add sort by date first

        function compareProgram(a, b) {
            if (a.Date > b.Date) {
                return 1;
            } else if (a.Date < b.Date) {
                return -1;
            }

            if (a['Start Time'] > b['Start Time']) {
                return 1;
            } else if (a['Start Time'] < b['Start Time']) {
                return -1;
            }
            if (a['Session Name'] > b['Session Name']) {
                return 1;
            } else if (a['Session Name'] < b['Session Name']) {
                return -1;
            }

            return 0;
        }



        program.sort(compareProgram);
        console.log(program);


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



        // Filter out constant events
        function removeEvents(v) {
            if (['Book Exhibit & HSS Cafe', 'Registration', 'Quiet Space', 'Meeting Point', 'Nursing Mother\'s Room'].includes(v['Session Name'])) {
                return;
            } else {
                return v;
            };
        }

        let eventsRemoved = program.filter(removeEvents);

        return eventsRemoved;

    }).then((result) => {

        function filterProgram(sess) {

            const earlierThanNow = moment(now).subtract(165, 'm');
            const laterThanNow = moment(now).add(330, 'm');
            const startTime = moment(sess['Start Time'], 'HH mm ss');
            const endTime = moment(sess['End Time'], 'HH mm ss');
            const sessDate = moment(sess['Date'], 'YYYY-MM-DD');
            const dateNow = moment('2019-07-24');

            if (startTime.isAfter(earlierThanNow) && endTime.isBefore(laterThanNow) && sessDate.isSame(dateNow)) {
                return sess;
            }
        }
        //Filter results based on time and date
        let filteredResult = result.filter(sess => filterProgram(sess));

        let filteredLength = filteredResult.length;
        console.log(filteredLength, filteredResult);
        let pass = 0;
        let slicedResult = [];

        function sliceResult() {

            if (pass + 6 <= filteredLength) {

                slicedResult = filteredResult.slice(pass, pass + 6);
                pass += 6;

                return slicedResult;
            } else {

                let firstSlice = filteredResult.slice(pass, filteredLength);

                let secondSlice = filteredResult.slice(0, 6 - (filteredLength - pass));

                slicedResult = [...firstSlice, ...secondSlice];

                pass = 6 - (filteredLength - pass);
                return slicedResult;
            }



        }

        sliceResult();
        setInterval(() => {
            sliceResult();
            writeToDom();
        }, 30000);
        // ((el, idx) => {
        //     if (moment(el['Start Time'], 'HH mm ss').isAfter(moment(now).subtract(165, 'm')) && moment(el['End Time'], 'HH mm ss').isBefore(moment(now).add(165, 'm')) && moment(el['Date'], 'YYYY-MM-DD').isSame(moment('2019-07-24'))) {
        //         return el;
        //     }
        // })


        // Write content to DOM
        function writeToDom() {

            // Write session title to DOM
            sessions.forEach(function (e, i) {
                e.innerHTML = (slicedResult[i]['Session Name'] != null) ? `${slicedResult[i]['Session Name']}` : "";
            });

            // Write topics to DOM
            tracks.forEach(function (e, i) {
                let track = ((slicedResult[i]['Session Track'] != "") ? `${slicedResult[i]['Session Track'].toLowerCase().replace(/\s|\//g,"-")}` : "no-track");
                e.className = '';
                e.className = "track " + track;
            })

            // Write venue to DOM
            locations.forEach(function (e, i) {
                let location = slicedResult[i]['Venue'];
                e.innerHTML = location;
            })

            // Write start and end time to DOM
            sessTime.forEach(function (e, i) {

                const sessStart = (slicedResult[i]['Start Time'].length < 8) ? "0" + slicedResult[i]['Start Time'].substring(0, 4) : slicedResult[i]['Start Time'].substring(0, 5);
                const sessEnd = (slicedResult[i]['End Time'].length < 8) ? "0" + slicedResult[i]['End Time'].substring(0, 4) : slicedResult[i]['End Time'].substring(0, 5);
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
//Need to alter for smaller viewports
const header = document.querySelector('.header-container').offsetHeight;
const container = document.querySelector('.container');
const sessionContainer = document.querySelectorAll('.session-title-container');

//Set initial size of container & items
container.style.minHeight = `${window.innerHeight - header - 50}px`;
sessionContainer.forEach(row => row.style.height = `${(window.innerHeight - header - 240)/6}px`);

// Resize container depending on window size
function resizeWindow() {
    container.style.minHeight = `${window.innerHeight - header - 50}px`;
    sessionContainer.forEach(row => row.style.height = `${(window.innerHeight - header - 240)/6}px`);
}

window.onresize = resizeWindow;