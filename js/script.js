const weather = {
  apiKey: '9734498c7079908570ab29759f5001ea',

  getGeoWeather: function () {
    navigator.geolocation.getCurrentPosition((success) => {
      const longitude = success.coords.longitude;
      const latitude = success.coords.latitude;

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ru&appid=${this.apiKey}`
      )
        .then((response) => {
          if (!response.ok) {
            alert(
              `Локация не определена \n Попробуйте воспользоваться поиском по названию города`
            );
          }
          return response.json();
        })
        .then((data) => {
          return this.displayWeather(data);
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
        }
        return response.json();
      })
      .then((data) => {
        return this.displayWeather(data);
      });
  },

  getDate: function (date) {
    let day = date.substring(0, 3);
    let num = date.substring(5, 7);
    let month = date.substring(8, 11);
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
    document.querySelector('.weather').style.display = 'block';
    const name = data.name;
    const currentDate = new Date(
      (data.dt + data.timezone) * 1000
    ).toUTCString();
    const description = data.weather[0]['description'];
    const mainIcon = data.weather[0]['icon'];
    const temp = Math.round(data.main.temp);
    const feelsTemp = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed);
    const pressure = (data.main.pressure / 1.33).toFixed();
    document.querySelector('.city').innerText = name;
    document.querySelector('.date').innerText = this.getDate(currentDate);
    document.querySelector('.description').innerText = description;
    document.querySelector(
      '.icon-main'
    ).innerHTML = `<img src="https://openweathermap.org/img/wn/${mainIcon}@2x.png">`;
    if (temp >= 1) {
      document.querySelector('.temp').innerText = `+${temp}°C`;
    } else {
      document.querySelector('.temp').innerText = `${temp}°C`;
    }
    if (feelsTemp >= 1) {
      document.querySelector(
        '.feels-temp'
      ).innerText = `ощущается как +${feelsTemp}°C`;
    } else {
      document.querySelector(
        '.feels-temp'
      ).innerText = `ощущается как ${feelsTemp}°C`;
    }
    document.querySelector(
      '.info-humidity'
    ).innerText = `влажность \n ${humidity} %`;
    document.querySelector(
      '.info-wind'
    ).innerText = `скорость ветра \n ${windSpeed} м/с`;
    document.querySelector(
      '.info-pressure'
    ).innerText = `давление \n ${pressure} мм рт.ст.`;
  },

  search: function () {
    this.getWeather(document.querySelector('.search-bar').value);
  },
};

document.querySelector('.location-btn').addEventListener('click', function () {
  weather.getGeoWeather();
});

document.querySelector('.search-btn').addEventListener('click', function () {
  weather.search();
  document.querySelector('.search-bar').value = '';
});

document
  .querySelector('.search-bar')
  .addEventListener('keyup', function (event) {
    if (event.key == 'Enter') {
      weather.search();
      document.querySelector('.search-bar').value = '';
    }
  });
