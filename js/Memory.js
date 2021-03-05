export class Memory {
    localStorageKey = 'locations';

    writeLocalStorage(locations) {
        localStorage.setItem(this.localStorageKey, JSON.stringify(locations));
    }

    readLocalStorage() {
        const storedLocations = JSON.parse(localStorage.getItem(this.localStorageKey));
        return storedLocations;
    }
}