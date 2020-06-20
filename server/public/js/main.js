import '/jquery.min.js';
import { Application } from './application.js';

window.$ = window.jQuery = jQuery;

(function () {
    $((_) => {
        new Application();
    });
})();
