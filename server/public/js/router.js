import { NewNotePage } from './pages/new-note-page.js';
import { LandingPage } from './pages/landing-page.js';
import { MyNotesPage } from './pages/my-notes-page.js';
import { enableDarkMode, enableLightMode } from './style-utils.js';

export const ROUTES = {
    // TODO: check if identifier can be read dynamically from name of object
    // TODO: use: Object.getOwnPropertyNames(routes)
    home: { identifier: 'home', location: 'landing-page', pageObject: new LandingPage() },
    new: { identifier: 'new', location: 'new-notes', pageObject: new NewNotePage() },
    myNotes: { identifier: 'myNotes', location: 'my-notes', pageObject: new MyNotesPage() },
};

export const URL_PARAM_HANDLER = {
    viewMode: {
        identifier: 'viewMode',
        handlers: {
            dark: enableDarkMode,
            light: enableLightMode,
        },
    },
    sort: {
        identifier: 'sort',
        handlers: {
            importance: ROUTES.myNotes.pageObject.sortByImportance,
            dueDate: ROUTES.myNotes.pageObject.sortByDueDate,
        },
    },
};

export class AppRouter {
    cachedPages = {};
    currentPage;

    constructor() {
        this.registerUrlChangeListener();
        this.redirectToPageBasedOnUrl();
        this.parseQueryParams();
    }

    get defaultRoute() {
        return ROUTES.home;
    }

    static routeTo(to) {
        // TODO check if router 'instance' can be passed to all pages for routing!
        window.location.hash = to.location;
    }

    navigateTo(to, opts) {
        let options = $.extend({}, this.getDefaultsForNavigateTo(), opts);
        if (ROUTES[to.identifier]) {
            this.currentPage = to;
            if (this.cachedPages[to.identifier]) {
                if (to.pageObject.renderView) {
                    to.pageObject.renderView((content) => this.displayView(content, to, options));
                } else {
                    this.displayView(this.cachedPages[to.identifier], to, options);
                }
            } else {
                $.get(`./pages/${to.location}.html`, (data) => {
                    this.cachePageContent(to, data);
                    this.navigateTo(to, options);
                });
            }
        } else {
            console.error("Pass route from exported 'routes' object! ");
        }
    }

    displayView(pageContent, to, options) {
        $('main').hide().html(pageContent).fadeIn('slow');
        this.updateUrl(to);
        this.onPageLoad(to, options);
    }

    getDefaultsForNavigateTo() {
        return { shouldScrollToContent: false };
    }

    onPageLoad(to, options) {
        this.updatePageTitle(to.pageObject.title);
        this.setActiveLink(to.identifier);
        options.shouldScrollToContent && this.scrollToStartOfContent();
        to.pageObject.onInit && to.pageObject.onInit();
    }

    updateUrl(to) {
        window.location.hash = to.location;
    }

    setActiveLink(currentPageIdentifier) {
        Object.keys(ROUTES).forEach((routeKey) => {
            let currentRoute = ROUTES[routeKey];
            $(`#link-${currentRoute.identifier}`).parent().removeClass('active');
        });
        $(`#link-${currentPageIdentifier}`).parent().addClass('active');
    }

    scrollToStartOfContent() {
        $('body').animate(
            {
                scrollTop: $('main').offset().top,
            },
            750
        );
    }

    updatePageTitle(title) {
        $('title').text(title);
    }

    cachePageContent(to, pageContent) {
        if (this.cachedPages && this.cachedPages[to.identifier]) {
            console.error('Should not call cachePageContent for already cached entry');
        } else {
            this.cachedPages[to.identifier] = pageContent;
            to.pageObject.prepareView && to.pageObject.prepareView(pageContent);
        }
    }

    registerUrlChangeListener() {
        $(window).on('hashchange', this.redirectToPageBasedOnUrl);
    }

    // function is defined as arrow function in order to keep 'this' pointing to class 'AppRouter'
    redirectToPageBasedOnUrl = () => {
        const url = window.location.hash.substr(1);

        if (!url && !this.currentPage) {
            this.navigateTo(this.defaultRoute);
        }

        if (url && (!this.currentPage || this.currentPage.location !== url)) {
            const routeToNavigate = Object.keys(ROUTES).filter((key) => ROUTES[key].location === url);
            if (routeToNavigate && routeToNavigate.length === 1) {
                this.navigateTo(ROUTES[routeToNavigate[0]]);
            } else {
                console.error('passed an unknown route ', url);
                this.navigateTo(this.defaultRoute);
            }
        }
    };

    parseQueryParams() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams) {
            Object.keys(URL_PARAM_HANDLER).forEach((key) => {
                let paramHandler = URL_PARAM_HANDLER[key];
                if (urlParams.has(paramHandler.identifier)) {
                    let paramValue = urlParams.get(paramHandler.identifier);
                    if (Object.keys(paramHandler.handlers).includes(paramValue)) {
                        paramHandler.handlers[paramValue].apply();
                    }
                }
            });
        }
    }

    static persistQueryParamState = (queryParamName, queryParamValue) => {
        const url = new URL(window.location.href);
        url.searchParams.set(queryParamName, queryParamValue);
        // change url without reloading page
        history.pushState({}, null, url.href);
    };
}
