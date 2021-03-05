import {UI} from './UI.js'

export class Status extends UI {
    form = null;
    input = null;
    #status = null;
    #statusInfo = null;
    #statusCloseBtn = null;

    #errorColor = 'rgb(238, 151, 151)';
    #successColor = 'rgb(130, 200, 134)';

    initializeStatus() {
        this.#handleElements();
        this.#addStatusCloseBtnEventListener();
    }

    #handleElements() {
        this.form = this.getElement(this.UISelectors.form);
        this.input = this.getElement(this.UISelectors.input);
        this.#status = this.getElement(this.UISelectors.status);
        this.#statusInfo = this.getElement(this.UISelectors.statusInfo);
        this.#statusCloseBtn = this.getElement(this.UISelectors.statusCloseBtn);
    }

    #addStatusCloseBtnEventListener() {
        this.#statusCloseBtn.addEventListener('click', this.#hideImmediately.bind(this));
    }

    #hideImmediately() {
        this.#status.style.opacity = '0';
    }

    #hideAfterTime() {
        setTimeout(() => {
            this.#status.style.opacity = '0';
        }, 7000);
    }

    geolocationError() {
        this.#status.style.opacity = '1';
        this.#status.style.backgroundColor = this.#errorColor;
        this.#statusInfo.innerHTML = `<i class="fas fa-exclamation-triangle"></i>The acquisition of the geolocation information failed`;
        this.#hideAfterTime();
    }

    geolocationSuccess() {
        this.#status.style.opacity = '1';
        this.#status.style.backgroundColor = this.#successColor;
        this.#statusInfo.innerHTML = `<i class="fas fa-check-circle"></i>Successful obtaining the location information.`;
        this.#hideAfterTime();
    }

    searchError() {
        this.#status.style.opacity = '1';
        this.#status.style.backgroundColor = this.#errorColor;
        this.#statusInfo.innerHTML = `<i class="fas fa-bug"></i>The selected location could not be found. Check if you have made a spelling mistake.`;
        this.#hideAfterTime();
    }

    historySuccess() {
        this.#status.style.opacity = '1';
        this.#status.style.backgroundColor = this.#successColor;
        this.#statusInfo.innerHTML = `<i class="fas fa-history"></i>Restore the last searched locations.`;
        this.#hideAfterTime();
    }

    eraseSuccess() {
        this.#status.style.opacity = '1';
        this.#status.style.backgroundColor = this.#successColor;
        this.#statusInfo.innerHTML = `<i class="fas fa-eraser"></i>All locations have been erased, both on the site and on the history.`;
        this.#hideAfterTime();
    }
}