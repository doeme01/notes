import * as dataService from './data-service.js';

let loadStarRatingListeners = () => {
    // TODO cleanup: how to store 'pages' in general?
    for (let i = 1; i <= 5; i++) {
        $(`#rating-${i}`).on('click', (it) => {
            let stars$ = $(it.target).parent().children();

            $.each(stars$, (index, item) => {
                let star$ = $(item);
                star$.removeClass('selected-star');

                if (star$.attr('data-value') <= i) {
                    star$.addClass('selected-star');
                }
            });

            dataService.saveStarRating(i);
            $('#selected-rating').text(dataService.getStars());
        });
    }
};

export const routes = {
    // TODO: check if identifier can be read dynamically from name of object
    home: { identifier: 'home', location: 'landing-page', title: 'Home' },
    new: { identifier: 'new', location: 'new-notes', title: 'Neue Notiz', onInitFn: loadStarRatingListeners },
    myNotes: { identifier: 'myNotes', location: 'my-notes', title: 'Notizen' },
};

const cachedPages = {};

let getDefaultsForNavigateTo = () => {
    return { shouldScrollToContent: false };
};

let onPageLoad = (to, options) => {
    updatePageTitle(to.title);
    setActiveLink(to.identifier);
    options.shouldScrollToContent && scrollToStartOfContent();
    to.onInitFn && to.onInitFn();
};

export let navigateTo = (to, options = getDefaultsForNavigateTo()) => {
    if (routes[to.identifier]) {
        if (cachedPages[to.identifier]) {
            $('main').hide().html(cachedPages[to.identifier]).fadeIn('slow');
            onPageLoad(to, options);
        } else {
            $.get(`./pages/${to.location}.html`, (data) => {
                cachePageContent(to.identifier, data);
                navigateTo(to, options);
            });
        }
    } else {
        console.error("Pass route from exported 'routes' object! ");
    }
};

let setActiveLink = (currentPageIdentifier) => {
    Object.keys(routes).forEach((routeKey) => {
        let currentRoute = routes[routeKey];
        $(`#link-${currentRoute.identifier}`).parent().removeClass('active');
    });
    $(`#link-${currentPageIdentifier}`).parent().addClass('active');
};

let scrollToStartOfContent = () => {
    $('body').animate(
        {
            scrollTop: $('main').offset().top,
        },
        750
    );
};

let updatePageTitle = (to) => {
    $('title').text(to.title);
};

let cachePageContent = (pageId, pageContent) => {
    if (cachedPages && cachedPages[pageId]) {
        console.error('Should not call cachePageContent for already cached entry');
    } else {
        cachedPages[pageId] = pageContent;
    }
};
