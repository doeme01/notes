import { ROUTES } from './router.js';
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
            this.router.navigateTo(ROUTES.new);
        });

        $('#link-myNotes').click(() => {
            this.router.navigateTo(ROUTES.myNotes);
        });

        $('#link-home').click(() => {
            this.router.navigateTo(ROUTES.home);
        });

        $('#style-toggle').click(() => {
            styleUtils.toggleStyle();
        });
    };
}
