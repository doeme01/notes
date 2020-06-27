import { AppRouter } from './router.js';
import { LandingPage } from './pages/landing-page.js';
import { NewNotePage } from './pages/new-note-page.js';
import { MyNotesPage } from './pages/my-notes-page.js';
import { enableDarkMode, enableLightMode, toggleStyle } from './utils/style-utils.js';

export class Application {
    constructor() {
        this.router = new AppRouter();

        this.startPage = this.generateHomePage();
        this.editPage = this.generateNewNotePage();
        this.overviewPage = this.generateMyNotesPage();

        this.appRoutes = { ...this.startPage, ...this.editPage, ...this.overviewPage };
        this.router.routes = this.appRoutes;
        this.router.queryParamHandlers = this.generateParamHandlers();
        this.router.initialize();

        this.onInit();
    }

    onInit() {
        this.loadDomListeners();
        this.registerCustomHandlebarsHelpers();
    }

    generateHomePage() {
        return {
            home: {
                identifier: 'home',
                isDefault: true,
                location: 'landing-page',
                pageObject: new LandingPage(this.router),
            },
        };
    }

    generateNewNotePage() {
        return {
            new: {
                identifier: 'new',
                location: 'new-notes',
                pageObject: new NewNotePage(this.router),
            },
        };
    }

    generateMyNotesPage() {
        return {
            myNotes: {
                identifier: 'myNotes',
                location: 'my-notes',
                pageObject: new MyNotesPage(this.router),
            },
        };
    }

    generateParamHandlers() {
        return {
            viewMode: {
                identifier: 'viewMode',
                handlers: {
                    dark: enableDarkMode,
                    light: enableLightMode,
                },
            },
            sort: {
                identifier: 'sort',
                activeAtPage: this.appRoutes.myNotes.identifier,
                handlers: {
                    importance: this.appRoutes.myNotes.pageObject.sortByImportance.bind(
                        this.appRoutes.myNotes.pageObject
                    ),
                    dueDate: this.appRoutes.myNotes.pageObject.sortByDueDate.bind(this.appRoutes.myNotes.pageObject),
                },
            },
            includeFinishedNotes: {
                identifier: 'includeFinished',
                activeAtPage: this.appRoutes.myNotes.identifier,
                handlers: {
                    true: this.appRoutes.myNotes.pageObject.toggleFinishedNotes,
                    false: this.appRoutes.myNotes.pageObject.showActiveNotes,
                },
            },
        };
    }

    loadDomListeners() {
        $('#link-new').click(() => {
            this.router.navigateTo(this.appRoutes.new);
        });

        $('#link-myNotes').click(() => {
            this.router.navigateTo(this.appRoutes.myNotes);
        });

        $('#link-home').click(() => {
            this.router.navigateTo(this.appRoutes.home);
        });

        $('#style-toggle').click(() => {
            const queryParamValue = toggleStyle();
            AppRouter.persistQueryParamState(this.router.queryParamHandlers.viewMode.identifier, queryParamValue);
        });
    }

    registerCustomHandlebarsHelpers() {
        // eslint-disable-next-line no-undef
        Handlebars.registerHelper('times', function (n, block) {
            let accum = '';
            for (let i = 0; i < n; ++i) accum += block.fn(i);
            return accum;
        });
    }
}
