export class API {
    #apiKey = '5f2fc51e6219e2e568abfb241136d370';

    geolocationAPI(latitude, longitude) {
        return `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.#apiKey}`;
    }

    locationAPI(location) {
        return `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${this.#apiKey}&units=metric`;
    }
}