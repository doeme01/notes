import { urlParamHandler } from './router.js';

export const toggleStyle = () => {
    const $body = $('body');
    if ($body.hasClass('dark-mode')) {
        enableLightMode();
    } else {
        enableDarkMode();
    }
};

export const enableDarkMode = () => {
    const $body = $('body');

    if (!$body.hasClass('dark-mode')) {
        $body.addClass('dark-mode');
        $('#style-toggle').attr('checked', true);
    }
    persistUrlState(urlParamHandler.viewMode.identifier, 'dark');
};

export const enableLightMode = () => {
    const $body = $('body');

    if ($body.hasClass('dark-mode')) {
        $body.removeClass('dark-mode');
        $('#style-toggle').attr('checked', false);
    }

    persistUrlState(urlParamHandler.viewMode.identifier, 'light');
};

const persistUrlState = (queryParamName, queryParamValue) => {
    const url = new URL(window.location.href);
    url.searchParams.set(queryParamName, queryParamValue);
    // change url without reloading page
    history.pushState({}, null, url.href);
};
