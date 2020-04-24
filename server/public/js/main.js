import '/jquery.min.js';
import * as app from './application.js';

window.$ = window.jQuery = jQuery;

$((_) => {
    app.onInit();
});
