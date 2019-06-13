// Set the variables

//Get DOM
const sessions = document.querySelectorAll('.session-title');
const tracks = document.querySelectorAll('.track');
const locations = document.querySelectorAll('.location');
const sessTime = document.querySelectorAll('.session-time');

// Define emojis for tracks
const tools = "🔧";
const theory = "💡";
const theme = "🗄️";
const aspect = "⚖️";
const bio = "🧫"
const chem = "⚗️";
// const earth = 
// const math =
// const med =
// const physics =
// const social =
// const tech =
// For months
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Data
let program = [];

// Get the program
fetch('../dist/csv/convertcsv.json')
    .then((response) => response.json())
    .then((responseJSON) => {

        program.push(...responseJSON);

        // Sort by start time 
        // Will have to add sort by date first

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

        program.sort(compareTime);

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
        console.table(uniqueTracks.toString());

        // Parcel out program


        let result = [];

        let loopsToRun = Math.ceil(program.length / 6);

        for (let p = 0; p < loopsToRun; p++) {
            result[p] = program.slice(0 + (p * 6), 6 + (p * 6));
        }

        
        


        
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


                const sessStart = (program[i]['Start Time'].length < 8) ? "0" + program[i]['Start Time'].substring(0, 4) : program[i]['Start Time'].substring(0, 5);

                const sessEnd = (program[i]['End Time'].length < 8) ? "0" + program[i]['End Time'].substring(0, 4) : program[i]['End Time'].substring(0, 5);

                const sessTime = `${sessStart}&ndash;${sessEnd}`;

                e.innerHTML = sessTime;
            })
        }



        writeToDom();
    })




// Adds leading zero to date and time
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

// Spell out the month
function spellMonth(i) {
    return months[i];
}

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

    let now = new Date();
    let date = addZero(now.getDate());
    let month = spellMonth(now.getMonth());
    let hour = addZero(now.getHours());
    let hourToTwelve = (hour < 12) ? hour : hour - 12;
    let hourIcon = "";
    let min = addZero(now.getMinutes());

    

    switch (hourToTwelve) {
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


    timeDiv.innerHTML = `${hourIcon}&nbsp;${hour}:${min}`;
    dateDiv.innerHTML = `📅&nbsp;${date} ${month} ${now.getFullYear()}`;

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
// const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=2745912&units=imperial&appid=94e8ffdaf0cec6782fa67b86afe1a450";

// fetch(forecastURL)
//     .then((response) => response.json())
//     .then((forecastData) => {
//         const dt = moment(forecastData.list[0].dt);
//         console.log(moment.unix(dt).format("DD MMMM YYYY"));

//     })