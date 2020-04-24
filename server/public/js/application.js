import * as router from './router.js';
import * as styleUtils from './style-utils.js';

export let onInit = () => {
    router.navigateTo(router.routes.home);
    loadDomListeners();
};

let loadDomListeners = () => {
    $('#link-new').on('click', () => {
        router.navigateTo(router.routes.new);
    });

    $('#link-myNotes').on('click', () => {
        router.navigateTo(router.routes.myNotes);
    });

    $('#link-home').on('click', () => {
        router.navigateTo(router.routes.home);
    });

    $('#style-toggle').on('click', () => {
        styleUtils.toggleStyle();
    });
};
