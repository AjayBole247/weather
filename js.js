const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const nameOutput = document.querySelector(".name");
const conditionOutput = document.querySelector(".condition");
const cloudOutput = document.querySelector(".cloud");
const windOutput = document.querySelector(".wind");
const humidityOutput = document.querySelector(".humidity");
const icon = document.querySelector(".icon");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const form = document.getElementById("locationInput");
const cities = document.querySelectorAll(".city");

let cityInput = "Bilaspur";

cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        cityInput = e.target.innerHTML;
        fetchWeatherData(cityInput);
        app.style.opacity = "0";
    });
});

form.addEventListener('submit', (e) => {
    if (search.value.length == 0) {
        alert("Please type a city name");
    } else {
        cityInput = search.value;
        fetchWeatherData(cityInput);
        search.value = "";
        app.style.opacity = "0";
    }
    e.preventDefault();
});

function dayOfTheWeek(day, month, year) {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekday[new Date(`${year}-${month}-${day}`).getDay()];
}

function fetchWeatherData(cityInput) {
    fetch(`http://api.weatherapi.com/v1/current.json?key=819c63fa5b2b4e98913183532252202&q=${cityInput}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            temp.innerHTML = data.current.temp_c + "&#176;";
            conditionOutput.innerHTML = data.current.condition.text;

            const date = data.location.localtime;
            const y = parseInt(date.substr(0, 4));
            const m = parseInt(date.substr(5, 2));
            const d = parseInt(date.substr(8, 2));
            const time = date.substr(11);

            dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m}, ${y}`;
            timeOutput.innerHTML = time;

            nameOutput.innerHTML = data.location.name;

            // Extracting the correct icon path
            const iconId = data.current.condition.icon.split("/").pop();
            // icon.src = `./icon/${iconId}`;

            cloudOutput.textContent = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            windOutput.innerHTML = data.current.wind_kph + " km/h";

            let timeOfDay = data.current.is_day ? "day" : "night";
            const code = data.current.condition.code;

            if (code == 1000) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
                btn.style.background = timeOfDay === "night" ? "#181e27" : "#e5ba92";
            } else if ([1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282].includes(code)) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
                btn.style.background = timeOfDay === "night" ? "#181e27" : "#fa6d1b";
            } else if ([1063, 1069, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1204, 1207, 1240, 1243, 1246, 1249, 1252].includes(code)) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
                btn.style.background = timeOfDay === "night" ? "#325c80" : "#647d75";
            } else {
                app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
                btn.style.background = timeOfDay === "night" ? "#1b1b1b" : "#4d72aa";
            }

            // Ensure opacity update is outside conditional blocks
            app.style.opacity = "1";
        })
        .catch((e) => {
            alert('City not found, please try again');
            console.log(e)
            app.style.opacity = "1";
        });
}

fetchWeatherData(cityInput);
app.style.opacity = "1";
