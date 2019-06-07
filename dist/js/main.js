// Set the variables

//Get DOM
const sessions = document.querySelectorAll('.session-title');
const tracks = document.querySelectorAll('.track');
const locations = document.querySelectorAll('.location');


// For months
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Data
let program = [];

// Get the program
fetch('../dist/csv/convertcsv.json')
    .then((response) => response.json())
    .then((responseJSON) => {

        program.push(...responseJSON);
        sessions.forEach(function (e, i) {


            e.innerHTML = `${i + 1}. ${program[i]['Session Name']}`;
        })

        tracks.forEach(function (e, i) {
            let track = program[i]['Session Track'] == "" ? "" : `<span class="track-format ${program[i]['Session Track']}">${program[i]['Session Track']}</span>`;

            e.innerHTML = track;
        })

        locations.forEach(function (e, i) {
            let location = program[i]['Venue'] == "" ? "" : `<span class="venue-format ${program[i]['Venue']}">📍 ${program[i]['Venue']}</span>`;

            e.innerHTML = location;
        })

    }).then

console.log(program);



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

    const timeDiv = document.querySelector('.time > p');
    const dateDiv = document.querySelector('.date > p');

    let now = new Date();
    let date = addZero(now.getDate());
    let month = spellMonth(now.getMonth());
    let hour = addZero(now.getHours());
    let min = addZero(now.getMinutes());

    timeDiv.innerHTML = `🕥&nbsp;${hour}:${min}`;
    dateDiv.innerHTML = `📆&nbsp;${date} ${month} ${now.getFullYear()}`;

    let interval = setTimeout(setTime, 500);


}

setTime();



// Transition in the elements
let slideIn = document.querySelectorAll('.session-title-container');

slideIn.forEach(e => e.classList.add('stc-active'))

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

// Weather 
const weatherURL = "https://api.openweathermap.org/data/2.5/weather?id=2745912&units=imperial&appid=94e8ffdaf0cec6782fa67b86afe1a450";

fetch(weatherURL)
    .then((response) => response.json())
    .then((responseJSON) => {

        const weather = document.querySelector('.weather > p');
        const tempF = Math.trunc(responseJSON.main.temp);
        const min = Math.trunc(responseJSON.main.temp_min);
        const max = Math.trunc(responseJSON.main.temp_max);
        const weatherDesc = responseJSON.weather[0].description;
        // let id = (responseJSON.weather[0].id == 800) ? "CLEAR" : responseJSON.weather[0].id.toString();
        const id = (responseJSON.weather[0].id == 800) ? "CLEAR" : responseJSON.weather[0].id.toString();


        function celsius(x) {
            return Math.trunc((x - 32) * 5 / 9);
        }

        

        let emoji = icon(weatherDesc);
        // console.log(emoji);


        weather.innerHTML = `${emoji} ${tempF}&deg; F (${celsius(tempF)}&deg; C)
        `;
        
        // Low: ${min}&deg; F (${celsius(min)}&deg; C) F / HIGH: ${max}&deg; F (${celsius(max)}&deg; C) `;


    })

// Forecast
// const forecast =
//     .fetch