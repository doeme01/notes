export class AppRouter {
    constructor() {
        this.cachedPages = {};
        this.currentPage = undefined;
        this._routes = {};
        this._queryParamHandlers = [];
    }

    initialize() {
        this.registerUrlChangeListener();
        this.redirectToPageBasedOnUrl();
        this.parseQueryParams();
    }

    get routes() {
        return this._routes;
    }

    set routes(value) {
        this._routes = value;
    }

    get queryParamHandlers() {
        return this._queryParamHandlers;
    }

    set queryParamHandlers(value) {
        this._queryParamHandlers = value;
    }

    get defaultRoute() {
        const defaultRoute = Object.keys(this.routes)
            .map((key) => this.routes[key])
            .find((route) => route.isDefault);

        if (!defaultRoute) {
            const fallbackRoute = this.routes[Object.keys(this.routes)[0]];
            console.error(
                `Default Route must be defined, as fallback first route was set "${fallbackRoute.identifier}"`
            );
            return fallbackRoute;
        }
        return defaultRoute;
    }

    navigateTo(to, opts) {
        let options = $.extend({}, this.getDefaultsForNavigateTo(), opts);
        if (this.routes[to.identifier]) {
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
            console.error("Pass route from exported 'this.routes' object! ");
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
        Object.keys(this.routes).forEach((routeKey) => {
            let currentRoute = this.routes[routeKey];
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
            const routeToNavigate = Object.keys(this.routes).filter((key) => this.routes[key].location === url);
            if (routeToNavigate && routeToNavigate.length === 1) {
                this.navigateTo(this.routes[routeToNavigate[0]]);
            } else {
                console.error('passed an unknown route ', url);
                this.navigateTo(this.defaultRoute);
            }
        }
    };

    parseQueryParams() {
        const hasUrlParamAndIsPageActiv = (paramHandler) => {
            return (
                (this.currentPage.identifier === paramHandler.activeAtPage || !paramHandler.activeAtPage) &&
                urlParams.has(paramHandler.identifier)
            );
        };
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams) {
            Object.keys(this.queryParamHandlers).forEach((key) => {
                let paramHandler = this.queryParamHandlers[key];
                if (hasUrlParamAndIsPageActiv(paramHandler)) {
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
