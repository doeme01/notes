import '/jquery.min.js';
import { Application } from './application.js';

// eslint-disable-next-line no-undef
window.$ = window.jQuery = jQuery;

(function () {
    $(() => {
        new Application();
    });
})();
