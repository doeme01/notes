import { NewNotePage } from './pages/new-note-page.js';
import { LandingPage } from './pages/landing-page.js';
import { MyNotesPage } from './pages/my-notes-page.js';
import { enableDarkMode, enableLightMode } from './style-utils.js';

export const routes = {
    // TODO: check if identifier can be read dynamically from name of object
    // TODO: use: Object.getOwnPropertyNames(routes)
    home: { identifier: 'home', location: 'landing-page', pageObject: new LandingPage() },
    new: { identifier: 'new', location: 'new-notes', pageObject: new NewNotePage() },
    myNotes: { identifier: 'myNotes', location: 'my-notes', pageObject: new MyNotesPage() },
};

export const urlParamHandler = {
    viewMode: {
        identifier: 'viewMode',
        handlers: {
            dark: enableDarkMode,
            light: enableLightMode,
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
        return routes.home;
    }

    navigateTo = (to, opts) => {
        let options = $.extend({}, this.getDefaultsForNavigateTo(), opts);
        if (routes[to.identifier]) {
            this.currentPage = to;
            if (this.cachedPages[to.identifier]) {
                $('main').hide().html(this.cachedPages[to.identifier]).fadeIn('slow');
                this.updateUrl(to);
                this.onPageLoad(to, options);
            } else {
                $.get(`./pages/${to.location}.html`, (data) => {
                    this.cachePageContent(to.identifier, data);
                    this.navigateTo(to, options);
                });
            }
        } else {
            console.error("Pass route from exported 'routes' object! ");
        }
    };

    getDefaultsForNavigateTo = () => {
        return { shouldScrollToContent: false };
    };

    onPageLoad = (to, options) => {
        this.updatePageTitle(to.pageObject.title);
        this.setActiveLink(to.identifier);
        options.shouldScrollToContent && this.scrollToStartOfContent();
        to.pageObject.onInit && to.pageObject.onInit();
    };

    updateUrl = (to) => {
        window.location.hash = to.location;
    };

    setActiveLink = (currentPageIdentifier) => {
        Object.keys(routes).forEach((routeKey) => {
            let currentRoute = routes[routeKey];
            $(`#link-${currentRoute.identifier}`).parent().removeClass('active');
        });
        $(`#link-${currentPageIdentifier}`).parent().addClass('active');
    };

    scrollToStartOfContent = () => {
        $('body').animate(
            {
                scrollTop: $('main').offset().top,
            },
            750
        );
    };

    updatePageTitle = (title) => {
        $('title').text(title);
    };

    cachePageContent = (pageId, pageContent) => {
        if (this.cachedPages && this.cachedPages[pageId]) {
            console.error('Should not call cachePageContent for already cached entry');
        } else {
            this.cachedPages[pageId] = pageContent;
        }
    };

    registerUrlChangeListener = () => {
        $(window).on('hashchange', this.redirectToPageBasedOnUrl);
    };

    redirectToPageBasedOnUrl = () => {
        const url = window.location.hash.substr(1);

        if (!url && !this.currentPage) {
            this.navigateTo(this.defaultRoute);
        }

        if (url && (!this.currentPage || this.currentPage.location !== url)) {
            const routeToNavigate = Object.keys(routes).filter((key) => routes[key].location === url);
            if (routeToNavigate && routeToNavigate.length === 1) {
                this.navigateTo(routes[routeToNavigate[0]]);
            } else {
                console.error('passed an unknown route ', url);
                this.navigateTo(this.defaultRoute);
            }
        }
    };

    parseQueryParams = () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams) {
            Object.keys(urlParamHandler).forEach((key) => {
                let paramHandler = urlParamHandler[key];
                if (urlParams.has(paramHandler.identifier)) {
                    let paramValue = urlParams.get(paramHandler.identifier);
                    if (Object.keys(paramHandler.handlers).includes(paramValue)) {
                        paramHandler.handlers[paramValue].apply();
                    }
                }
            });
        }
    };
}
