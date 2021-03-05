import {UI} from './UI.js'
import {Memory} from './Memory.js'
import {Status} from './Status.js'
import {API} from './API.js'

class WeatherApp extends UI {
    #places = null;
    #locateBtn = null;
    #unitBtn = null;
    #clearBtn = null;
    #searchBtn = null;

    #locations = [];

    #API = new API();
    #status = new Status();
    #memory = new Memory();

    initializeWeatherApp() {
        this.#status.initializeStatus();
        this.#handleElements();
        this.#addEventListeners();
        this.#searchHistory();
    }

    #handleElements() {
        this.#places = this.getElement(this.UISelectors.places);
        this.#locateBtn = this.getElement(this.UISelectors.locateBtn);
        this.#unitBtn = this.getElement(this.UISelectors.unitBtn);
        this.#clearBtn = this.getElement(this.UISelectors.clearBtn);
        this.#searchBtn = this.getElement(this.UISelectors.searchBtn);
    }

    #addEventListeners() {
        this.#locateBtn.addEventListener('click', this.#searchMyWeather.bind(this));
        this.#unitBtn.addEventListener('click', this.#changeUnit.bind(this));
        this.#clearBtn.addEventListener('click', this.#eraseHistory.bind(this));
        this.#searchBtn.addEventListener('click', this.#searchAnyWeather.bind(this));
    }

    #searchMyWeather() {
        const setPosition = position => {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;

            const API = this.#API.geolocationAPI(latitude, longitude);

            this.#getWeather(API);
            this.#status.geolocationSuccess();

            this.#locateBtn.classList.remove('pulse');
            this.#locateBtn.classList.add('on');
        }

        if('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(setPosition, this.#status.geolocationError());
        }
    }

    #searchAnyWeather(e) {
        e.preventDefault();
        const inputValue = this.#status.input.value;

        const API = this.#API.locationAPI(inputValue);
        this.#getWeather(API);
    }

    #searchHistory() {
        const historyLocations = this.#memory.readLocalStorage();
        if(historyLocations !== null) {
            historyLocations.forEach(historyLocation => {
                const API = this.#API.locationAPI(historyLocation);

                this.#getWeather(API);
                this.#status.historySuccess();
            })
        }
    }

    #eraseHistory() {
        while(this.#places.firstChild) {
            this.#places.removeChild(this.#places.lastChild)
        }
        this.#locations.length = 0;
        localStorage.removeItem(this.#memory.localStorageKey);
        this.#status.eraseSuccess();
    }

    #getWeather(API) {
        const validateTemperature = temperature => {
            const kelvin = 273;

            if(temperature >= 56) {
                temperature -= kelvin;
            }
            return temperature;
        }

        fetch(API) 
            .then(response => {
                const data = response.json();
                return data;
            })
            .then(data => {
                let temperature = Math.round(data.main.temp);
                const description = data.weather[0].description;
                const icon = `icons/${data.weather[0].icon}.svg`;
                const city = data.name;
                const countryCode = data.sys.country;

                this.#locations.push(city);
                this.#memory.writeLocalStorage(this.#locations);

                this.#displayWeather(validateTemperature(temperature), description, icon, city, countryCode);
            })
            .catch(() => this.#status.searchError());

            this.#status.form.reset();
            this.#status.input.focus();
    } 

    #displayWeather(temperature, description, icon, city, countryCode) {
        const place = document.createElement('li');
        place.classList.add('place');

        const markup = `
            <h2 class="place-name" data-name="${city}, ${countryCode}">
                <span class="name">${city}</span>
                <span class="country"></span>
            </h2>
            <div class="place-temp"><span>${temperature}</span><sup>°C</sup></div>
            <figure>
                <img src="${icon}" alt="${description}" class="place-icon">
                <figcaption>${description}</figcaption>
            </figure>`;

        place.innerHTML = markup;
        this.#places.appendChild(place);

        const country = place.querySelector('.country');
        country.style.backgroundImage = `url(countries/${countryCode}.svg)`;
    }

    #changeUnit() {
        const unit = this.#unitBtn.textContent;
        const placesTemp = this.getElements('.place-temp');

        placesTemp.forEach(placeTemp => {
            const tempString = placeTemp.querySelector('span');
            const tempNumber = Number(tempString.textContent);
            const tempUnit = placeTemp.querySelector('sup');

            const celsiusToFahrenheit = temp => Math.round((temp * (9/5)) + 32);
            const fahrenheitToCelsius = temp => Math.round((temp - 32) / (9/5));

            if (unit === "°F" && tempUnit.textContent === "°C") {
                tempString.textContent = celsiusToFahrenheit(tempNumber);
                tempUnit.textContent = "°F";
                this.#unitBtn.textContent = "°C";
                this.#unitBtn.classList.add("on");
            } else if (unit === "°C" && tempUnit.textContent === "°F") {
                tempString.textContent = fahrenheitToCelsius(tempNumber);
                tempUnit.textContent = "°C";
                this.#unitBtn.textContent = "°F";
                this.#unitBtn.classList.remove("on");
            }
        });
    }
}

window.onload = function() {
    const weatherApp = new WeatherApp();
    weatherApp.initializeWeatherApp();
}