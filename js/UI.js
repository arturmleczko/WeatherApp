export class UI {
    UISelectors = {
        form: '[data-form]',
        input: '[data-input]',
        status: '[data-status]',
        statusInfo: '[data-status-info]',
        statusCloseBtn: '[data-close]',
        places: '[data-places]',
        locateBtn: '[data-locate-btn]',
        unitBtn: '[data-unit-btn]',
        clearBtn: '[data-clear-btn]',
        searchBtn: '[data-search-btn]'
    }

    getElement(selector) {
        return document.querySelector(selector);
    }

    getElements(selector) {
        return document.querySelectorAll(selector);
    }
}