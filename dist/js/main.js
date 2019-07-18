// Set the variables

// Time check
// let now = moment.tz('Europe/Amsterdam');
// let now = moment();

const endOfMeeting = [{
    "Session Id": 17,
    "Type": "Session",
    "Session Name": "That's a wrap!",
    "Date": "",
    "Start Time": "",
    "End Time": "",
    "Description": "",
    "Session Track": "",
    "Venue": "",
    "Format": "",
    "Abstract": "",
    "Additional Abstract": "",
    "Speakers": "",
    "Moderators": "",
    "Attendees": "",
    "Capacity": 0,
    "Likes": 0
}, {
    "Session Id": 17,
    "Type": "Session",
    "Session Name": "That's a wrap!",
    "Date": "",
    "Start Time": "",
    "End Time": "",
    "Description": "",
    "Session Track": "",
    "Venue": "",
    "Format": "",
    "Abstract": "",
    "Additional Abstract": "",
    "Speakers": "",
    "Moderators": "",
    "Attendees": "",
    "Capacity": 0,
    "Likes": 0
}, {
    "Session Id": 17,
    "Type": "Session",
    "Session Name": "That's a wrap!",
    "Date": "",
    "Start Time": "",
    "End Time": "",
    "Description": "",
    "Session Track": "",
    "Venue": "",
    "Format": "",
    "Abstract": "",
    "Additional Abstract": "",
    "Speakers": "",
    "Moderators": "",
    "Attendees": "",
    "Capacity": 0,
    "Likes": 0
}, {
    "Session Id": 17,
    "Type": "Session",
    "Session Name": "That's a wrap!",
    "Date": "",
    "Start Time": "",
    "End Time": "",
    "Description": "",
    "Session Track": "",
    "Venue": "",
    "Format": "",
    "Abstract": "",
    "Additional Abstract": "",
    "Speakers": "",
    "Moderators": "",
    "Attendees": "",
    "Capacity": 0,
    "Likes": 0
}, {
    "Session Id": 17,
    "Type": "Session",
    "Session Name": "That's a wrap!",
    "Date": "",
    "Start Time": "",
    "End Time": "",
    "Description": "",
    "Session Track": "",
    "Venue": "",
    "Format": "",
    "Abstract": "",
    "Additional Abstract": "",
    "Speakers": "",
    "Moderators": "",
    "Attendees": "",
    "Capacity": 0,
    "Likes": 0
}, {
    "Session Id": 17,
    "Type": "Session",
    "Session Name": "That's a wrap!",
    "Date": "",
    "Start Time": "",
    "End Time": "",
    "Description": "",
    "Session Track": "",
    "Venue": "",
    "Format": "",
    "Abstract": "",
    "Additional Abstract": "",
    "Speakers": "",
    "Moderators": "",
    "Attendees": "",
    "Capacity": 0,
    "Likes": 0
}];

//Get DOM
const sessions = document.querySelectorAll('.session-title');
const tracks = document.querySelectorAll('.track');
const locations = document.querySelectorAll('.location');
const sessTime = document.querySelectorAll('.session-time');

// Data
let program = [];

// Get the program
fetch('./dist/csv/convertcsv.json')
    .then((response) => response.json())
    .then((responseJSON) => {

        program.push(...responseJSON);

        // Sort by start time

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

        //Write reg, book exhibit, cafe open time to DOM
        function writeOpenEvents() {

            //Define variables
            const reg = 'Registration';
            const regDom = document.getElementById('reg');
            const cafe = document.getElementById('cafe');
            const exhibit = document.getElementById('exhibit');

            // Get DOM Elements
            let todaysProgram = program.filter(
                el => {



                    // Need to update when we go live -->





                    return el['Date'] == moment('2019-07-23').format('YYYY-MM-DD');
                    // return el['Date'] == moment().format('YYYY-MM-DD');








                }
            )

            // Find the first instance of the item for the day
            let foundReg = todaysProgram.find(element => {
                return element['Session Name'] == reg;
            });

            // Format time
            let startReg = moment(foundReg['Start Time'], 'HH:mm:ss');
            let endReg = moment(foundReg['End Time'], 'HH:mm:ss');

            // Check whether current time is between start and close times
            // Add relevant class names to DOM
            if (moment().isBetween(startReg, endReg)) {
                regDom.classList.remove('closed');
                regDom.classList.add('open');
                cafe.classList.remove('closed');
                cafe.classList.add('open');
                exhibit.classList.remove('closed');
                exhibit.classList.add('open');
            } else {
                regDom.classList.remove('open');
                regDom.classList.add('closed');
                cafe.classList.remove('open');
                cafe.classList.add('closed');
                exhibit.classList.remove('open');
                exhibit.classList.add('closed');
            }

            // Run this every hour
            setTimeout(writeOpenEvents, 3600000);
        }

        // Run the function
        function conferenceStarted() {
            if (moment().isBetween('2019-07-23', '2019-07-27')) {
                writeOpenEvents();
            }

            setTimeout(conferenceStarted, 3600000);
        }

        conferenceStarted();

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

            const earlierThanNow = moment().subtract(165, 'm');
            const laterThanNow = moment().add(330, 'm');
            const startTime = moment(sess['Start Time'], 'HH mm ss');
            const endTime = moment(sess['End Time'], 'HH mm ss');
            const sessDate = moment(sess['Date'], 'YYYY-MM-DD');
            const dateNow = moment('2019-07-24');


            if (moment().isAfter(moment('18:00', 'HH:mm')) && moment().isBefore(moment('2019-07-28'))) {
                if (endTime.isBefore(moment('12:00', 'HH:mm')) && sessDate.isSame(dateNow.add(1, 'd'))) {
                    return sess
                }
            } else if (startTime.isAfter(earlierThanNow) && endTime.isBefore(laterThanNow) && sessDate.isSame(dateNow)) {
                return sess;
            }

        }


        //Filter results based on time and date
        let filteredResult = [];
        if (moment().isAfter(moment('13:00', 'HH:mm')) && moment().isSameOrAfter(moment('2019-07-27'))) {
            filteredResult = endOfMeeting;
        } else {
            filteredResult = result.filter(sess => filterProgram(sess));
        }


        let filteredLength = filteredResult.length;

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
            fadeEffect();
            sliceResult();
            setTimeout(writeToDom, 450);
            // writeToDom();
        }, 5000);
        // Set this number higher for production



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

        function fadeEffect() {
            fadeOut();
            setTimeout(fadeIn, 500);
        }
    })

// Set time in the DOM
function setTime() {
    // Define clocks
    const oneClck = "🕐";
    const oneThirtyClck = "🕜";
    const twoClck = "🕑";
    const twoThirtyClck = "🕑";
    const threeClck = "🕒";
    const threeThirtyClck = "🕞";
    const fourClck = "🕓";
    const fourThirtyClck = "🕟";
    const fiveClck = "🕔";
    const fiveThirtyClck = "🕠";
    const sixClck = "🕕";
    const sixThirtyClck = "🕡";
    const sevenClck = "🕖";
    const sevenThirtyClck = "🕢";
    const eightClck = "🕗";
    const eightThirtyClck = "🕣";
    const nineClck = "🕘";
    const nineThirtyClck = "🕤";
    const tenClck = "🕙";
    const tenThirtyClck = "🕥";
    const elevenClck = "🕚";
    const elevenThirtyClck = "🕦";
    const twelveClck = "🕛";
    const twelveThirtyClck = "🕧";

    const timeDiv = document.querySelector('.time > p');
    const dateDiv = document.querySelector('.date > p');

    let date = moment().format('DD MMM YYYY');
    let time = moment().format('HH:mm');
    let hourIcon;
    let hour = parseInt(moment().format('hh'));
    let minute = (parseInt(moment().format('mm')) > 29) ? true : false;


    switch (hour, minute) {
        case 0, false:
            hourIcon = twelveClck;
            break;
        case 0, true:
            hourIcon = twelveThirtyClck;
            break;
        case 1, false:
            hourIcon = oneClck;
            break;
        case 1, true:
            hourIcon = oneThirtyClck;
            break;
        case 2, false:
            hourIcon = twoClck;
            break;
        case 2, true:
            hourIcon = twoThirtyClck;
            break;
        case 3, false:
            hourIcon = threeClck;
            break;
        case 3, true:
            hourIcon = threeThirtyClck;
            break;
        case 4, false:
            hourIcon = fourClck;
            break;
        case 4, true:
            hourIcon = fourThirtyClck;
            break;
        case 5, false:
            hourIcon = fiveClck;
            break;
        case 5, true:
            hourIcon = fiveThirtyClck;
            break;
        case 6, false:
            hourIcon = sixClck;
            break;
        case 6, true:
            hourIcon = sixThirtyClck;
            break;
        case 7, false:
            hourIcon = sevenClck;
            break;
        case 7, true:
            hourIcon = sevenThirtyClck;
            break;
        case 8, false:
            hourIcon = eightClck;
            break;
        case 8, true:
            hourIcon = eightThirtyClck;
            break;
        case 9, false:
            hourIcon = nineClck;
            break;
        case 9, true:
            hourIcon = nineThirtyClck;
            break;
        case 10, false:
            hourIcon = tenClck;
            break;
        case 10, true:
            hourIcon = tenThirtyClck;
            break;
        case 11, false:
            hourIcon = elevenClck;
            break;
        case 11, true:
            hourIcon = elevenThirtyClck;
            break;
        case 12, false:
            hourIcon = twelveClck;
            break;
        case 12, true:
            hourIcon = twelveThirtyClck;
    }

    // timeDiv.innerHTML = `${hourIcon}&nbsp;${hour}:${min}`;
    timeDiv.innerHTML = `${hourIcon}&nbsp;${time}`;
    dateDiv.innerHTML = `📅&nbsp;${date}`;

    setTimeout(setTime, 500);
}

setTime();



// Transition in the elements
let stc = document.querySelectorAll('.session-title-container');

stc.forEach((e, i) => {
    setTimeout(() => e.classList.add('stc-active'), i * 250);
});

function fadeOut() {
    stc.forEach((e, i) => {

        setTimeout(() => e.style.opacity = 0, i * 100);
    });
}

function fadeIn() {
    stc.forEach((e, i) => {

        setTimeout(() => e.style.opacity = 1, i * 100);
    });
}




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

}

// Get forecast on page load
getForecast();

// Resize element
//Need to alter for smaller viewports


// Resize container depending on window size
function resizeWindow() {
    const header = document.querySelector('.header-container').offsetHeight;
    const container = document.querySelector('.container');
    const sessionContainer = document.querySelectorAll('.session-title-container');

    if (window.innerWidth > 1280) {
        console.log(window.innerWidth);
        container.style.height = `${window.innerHeight - header - 50}px`;
        sessionContainer.forEach(row => row.style.height = `${(window.innerHeight - header - 240)/6}px`);
    } else {
        container.style.height = 'auto';
        sessionContainer.forEach(row => row.style.height = 'auto');
    }


}

resizeWindow();
window.onresize = resizeWindow;