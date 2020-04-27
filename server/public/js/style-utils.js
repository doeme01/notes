import { urlParamHandler } from './router.js';

export let toggleStyle = () => {
    let $body = $('body');
    if ($body.hasClass('dark-mode')) {
        enableLightMode();
    } else {
        enableDarkMode();
    }
};

export let enableDarkMode = () => {
    let $body = $('body');

    if (!$body.hasClass('dark-mode')) {
        $body.addClass('dark-mode');
        $('#style-toggle').attr('checked', true);
    }
    persistUrlState(urlParamHandler.viewMode.identifier, 'dark');
};

export let enableLightMode = () => {
    let $body = $('body');

    if ($body.hasClass('dark-mode')) {
        $body.removeClass('dark-mode');
        $('#style-toggle').attr('checked', false);
    }

    persistUrlState(urlParamHandler.viewMode.identifier, 'light');
};

let persistUrlState = (queryParamName, queryParamValue) => {
    let url = new URL(window.location.href);
    url.searchParams.set(queryParamName, queryParamValue);
    // change url without reloading page
    history.pushState({}, null, url.href);
};
