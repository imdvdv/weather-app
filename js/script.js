const apiKey = 'YOUR_OPENWEATHER_API-KEY',
    url = 'https://api.openweathermap.org/data/2.5/weather',

    weatherWrapper = document.querySelector('.weather-wrapper'),
    title = document.querySelector('.title'),
    searchBar = document.querySelector('.search-bar'),
    searchBtn = document.querySelector('.search-btn'),
    clearBtn = document.querySelector('.clear-btn'),
    locationBtn = document.querySelector('.location-btn'),
    cityNameTag = document.querySelector('.city'),
    dateTag = document.querySelector('.data-date'),
    descriptionTag = document.querySelector('.description'),
    mainIconTag = document.querySelector('.icon-main'),
    tempTag = document.querySelector('.temp'),
    feelsTempTag = document.querySelector('.data-feels-temp'),
    windTag = document.querySelector('.data-wind'),
    pressureTag = document.querySelector('.data-pressure'),
    humidityTag = document.querySelector('.data-humidity');

function displayWeather (data) {
    title.style.display = 'none';
    weatherWrapper.style.display = 'block';

    let cityName = data.name,
        currentDate = new Intl.DateTimeFormat('ru', {dateStyle: 'full', timeZone: 'UTC'}).format((data.dt + data.timezone) * 1000),
        descriptionData = data.weather[0]['description'],
        mainIcon = data.weather[0]['icon'],
        tempData = Math.round(data.main.temp),
        feelsTempData = Math.round(data.main.feels_like),
        humidityData = data.main.humidity,
        windData = Math.round(data.wind.speed),
        pressureData = (data.main.pressure / 1.33).toFixed();

    cityNameTag.innerText = cityName;
    dateTag.innerText = currentDate.slice(0, -8);
    descriptionTag.innerText = descriptionData;
    mainIconTag.innerHTML = `<img src="https://openweathermap.org/img/wn/${mainIcon}@2x.png">`;

    (tempData >= 1) ? tempTag.innerText = `+${tempData}°C` : tempTag.innerText = `${tempData}°C`;
    feelsTempTag.innerText = 'ощущается как';
    (feelsTempData >= 1) ? feelsTempTag.innerText += ` +${feelsTempData}°C` : feelsTempTag.innerText += ` ${feelsTempData}°C`;

    windTag.innerText = `скорость ветра\n ${windData} м/с`;
    pressureTag.innerText = `давление\n ${pressureData} мм рт.ст.`;
    humidityTag.innerText = `влажность\n ${humidityData} %`;
};
    
function getWeatherData (url, alertMessage = 'Что-то пошло не так') {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                alert(alertMessage);
                return false;
            } else {
                return response.json();
            }
        })
        .then((data) => {
            if (data) {
                displayWeather(data);
            }
        });      
};

function getByLocation () {
    navigator.geolocation.getCurrentPosition((success) => {
        let longitude = success.coords.longitude,
            latitude = success.coords.latitude,
            queryParams = `lat=${latitude}&lon=${longitude}&units=metric&lang=ru&appid=${apiKey}`,
            alertMessage = `Локация не определена \n Попробуйте воспользоваться поиском по названию города`;

        getWeatherData(`${url}?${queryParams}`, alertMessage);
    });
};

function getByCityName (city) {
    let queryParams = `q=${city}&units=metric&lang=ru&appid=${apiKey}`,
        alertMessage = `Населенный пункт ${city} не найден`;

    getWeatherData(`${url}?${queryParams}`, alertMessage);
};

(function listenToSearch () {

    locationBtn.addEventListener('click', function () {
        getByLocation();
    });

    searchBar.addEventListener("input", async () => {
        if (searchBar.value !== ''){
            clearBtn.style.visibility = 'visible';
        } else {
            clearBtn.style.visibility = 'hidden';
        }
    });

    clearBtn.addEventListener('click', async () => {
        searchBar.value = '';
        clearBtn.style.visibility = 'hidden';
    });

    searchBar.addEventListener('keyup', function (e) {
        if (e.key === 'Enter' && searchValue !== '') {
            getByCityName(searchBar.value);
        }
    });

    searchBtn.addEventListener('click', function () {
        if (searchBar.value !== '') {
            getByCityName(searchBar.value);
        }
    });

})();