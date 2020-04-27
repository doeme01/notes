import { NewNotePage } from './new-note-page.js';
import { LandingPage } from './landing-page.js';
import { MyNotesPage } from './my-notes-page.js';

export const routes = {
    // TODO: check if identifier can be read dynamically from name of object
    home: { identifier: 'home', location: 'landing-page', pageObject: new LandingPage() },
    new: { identifier: 'new', location: 'new-notes', pageObject: new NewNotePage() },
    myNotes: { identifier: 'myNotes', location: 'my-notes', pageObject: new MyNotesPage() },
};

const cachedPages = {};

let getDefaultsForNavigateTo = () => {
    return { shouldScrollToContent: false };
};

let onPageLoad = (to, options) => {
    updatePageTitle(to.pageObject.title);
    setActiveLink(to.identifier);
    options.shouldScrollToContent && scrollToStartOfContent();
    to.pageObject.onInit && to.pageObject.onInit();
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

let updatePageTitle = (title) => {
    $('title').text(title);
};

let cachePageContent = (pageId, pageContent) => {
    if (cachedPages && cachedPages[pageId]) {
        console.error('Should not call cachePageContent for already cached entry');
    } else {
        cachedPages[pageId] = pageContent;
    }
};
