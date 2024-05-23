const weatherWrapper = document.querySelector('.weather-wrapper'),
  title = document.querySelector('.title'),
  searchBar = document.querySelector('.search-bar'),
  searchBtn = document.querySelector('.search-btn'),
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

const weather = {
    apiKey: 'YOUR_OPENWEATHER_API-KEY',

    getGeoWeather: function () {
        navigator.geolocation.getCurrentPosition((success) => {
            const longitude = success.coords.longitude,
              latitude = success.coords.latitude;

            fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ru&appid=${this.apiKey}`
            )
            .then((response) => {

                if (!response.ok) {
                    alert(`Локация не определена \n Попробуйте воспользоваться поиском по названию города`);
                    return false;
                } else {
                    return response.json();
                }
            })
            .then((data) => {
                if (data) {
                    return this.displayWeather(data);
                }
            });
        });
    },

    getWeather: function (city) {
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ru&appid=${this.apiKey}`
        )
        .then((response) => {
            if (!response.ok) {
                alert(`Город ${city} не найден`);
                return false;
            } else {
                return response.json();
            }
        })
        .then((data) => {
            if (data) {
                return this.displayWeather(data);
            }
        });
    },

    getDate: function (date) {
        let day = date.substring(0, 3),
          num = date.substring(5, 7),
          month = date.substring(8, 11);

        switch (day) {
            case 'Mon':
                dayRu = 'понедельник';
                break;
            case 'Tue':
                dayRu = 'вторник';
                break;
            case 'Wed':
                dayRu = 'среда';
                break;
            case 'Thu':
                dayRu = 'четверг';
                break;
            case 'Fri':
                dayRu = 'пятница';
                break;
            case 'Sat':
                dayRu = 'суббота';
                break;
            case 'Sun':
                dayRu = 'воскресенье';
                break;
        }

        zeroCheck = (n) => (date[5] == '0' ? date[6] : n);

        switch (month) {
            case 'Jan':
                monthRu = 'января';
                break;
            case 'Feb':
                monthRu = 'февраля';
                break;
            case 'Mar':
                monthRu = 'марта';
                break;
            case 'Apr':
                monthRu = 'апреля';
                break;
            case 'May':
                monthRu = 'мая';
                break;
            case 'Jun':
                monthRu = 'июня';
                break;
            case 'Jul':
                monthRu = 'июля';
                break;
            case 'Aug':
                monthRu = 'августа';
                break;
            case 'Sep':
                monthRu = 'сентября';
                break;
            case 'Oct':
                monthRu = 'октября';
                break;
            case 'Nov':
                monthRu = 'ноября';
                break;
            case 'Dec':
                monthRu = 'декабря';
                break;
        }
        return `${dayRu}, ${zeroCheck(num)} ${monthRu}`;
    },

    displayWeather: function (data) {
        title.style.display = 'none';
        weatherWrapper.style.display = 'block';

        let cityName = data.name;
          currentDate = new Date((data.dt + data.timezone) * 1000).toUTCString(),
          descriptionData = data.weather[0]['description'],
          mainIcon = data.weather[0]['icon'],
          tempData = Math.round(data.main.temp),
          feelsTempData = Math.round(data.main.feels_like),
          humidityData = data.main.humidity,
          windData = Math.round(data.wind.speed),
          pressureData = (data.main.pressure / 1.33).toFixed();

        cityNameTag.innerText = cityName;
        dateTag.innerText = this.getDate(currentDate);
        descriptionTag.innerText = descriptionData;
        mainIconTag.innerHTML = `<img src="https://openweathermap.org/img/wn/${mainIcon}@2x.png">`;

        (tempData >= 1) ? tempTag.innerText = `+${tempData}°C` : tempTag.innerText = `${tempData}°C`;
        feelsTempTag.innerText = 'ощущается как';
        (feelsTempData >= 1) ? feelsTempTag.innerText += ` +${feelsTempData}°C` : feelsTempTag.innerText += ` ${feelsTempData}°C`;

        windTag.innerText = `скорость ветра\n ${windData} м/с`;
        pressureTag.innerText = `давление\n ${pressureData} мм рт.ст.`;
        humidityTag.innerText = `влажность\n ${humidityData} %`;
    },

    search: function () {
        this.getWeather(searchBar.value);
    },
};

locationBtn.addEventListener('click', function () {
    weather.getGeoWeather();
});

searchBtn.addEventListener('click', function () {
    weather.search();
    searchBar.value = '';
});

searchBar.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        weather.search();
        searchBar.value = '';
    }
});
