import * as router from './router.js';
import * as styleUtils from './style-utils.js';
import { AppRouter } from './router.js';

export class Application {
    router;

    constructor() {
        this.onInit();
        this.router = new AppRouter();
    }

    onInit = () => {
        this.loadDomListeners();
    };

    loadDomListeners = () => {
        $('#link-new').click(() => {
            this.router.navigateTo(router.routes.new);
        });

        $('#link-myNotes').click(() => {
            this.router.navigateTo(router.routes.myNotes);
        });

        $('#link-home').click(() => {
            this.router.navigateTo(router.routes.home);
        });

        $('#style-toggle').click(() => {
            styleUtils.toggleStyle();
        });
    };
}
