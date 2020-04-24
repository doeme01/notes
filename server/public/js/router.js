export const routes = {
    // TODO: check if identifier can be read dynamically from name of object
    home: { identifier: 'home', location: 'landing-page', title: 'Home' },
    new: { identifier: 'new', location: 'new-notes', title: 'Neue Notiz' },
    myNotes: { identifier: 'myNotes', location: 'my-notes', title: 'Meine Notizen' },
};

export let navigateTo = (to) => {
    if (routes[to.identifier]) {
        $('main').load(`./pages/${to.location}.html`, () => {
            $('title').text(to.title);
            resetCurrentPageLink();
            $(`#link-${to.identifier}`).parent().addClass('active');
        });
    } else {
        console.error("Pass route from exported 'routes' object! ");
    }
};

let resetCurrentPageLink = () => {
    Object.keys(routes).forEach((routeKey) => {
        let currentRoute = routes[routeKey];
        $(`#link-${currentRoute.identifier}`).parent().removeClass('active');
    });
};
