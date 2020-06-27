export const toggleStyle = () => {
    const $body = $('body');
    if ($body.hasClass('dark-mode')) {
        enableLightMode();
        return 'light';
    } else {
        enableDarkMode();
        return 'dark';
    }
};

export const enableDarkMode = () => {
    const $body = $('body');

    if (!$body.hasClass('dark-mode')) {
        $body.addClass('dark-mode');
        $('#style-toggle').attr('checked', true);
    }
};

export const enableLightMode = () => {
    const $body = $('body');

    if ($body.hasClass('dark-mode')) {
        $body.removeClass('dark-mode');
        $('#style-toggle').attr('checked', false);
    }
};
