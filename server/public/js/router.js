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

let getDefaultsForNavigateTo = () => {
    return { shouldScrollToContent: false };
};

export let navigateTo = (to, options = getDefaultsForNavigateTo()) => {
    if (routes[to.identifier]) {
        $('main')
            .hide()
            .load(`./pages/${to.location}.html`, () => {
                updatePageTitle(to.title);
                setActiveLink(to.identifier);
                options.shouldScrollToContent && scrollToStartOfContent();
                to.onInitFn && to.onInitFn();
            })
            .fadeIn('slow');
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
