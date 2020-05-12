import { getProjects } from '../service/project-service.js';

export class MyNotesPage {
    get title() {
        return 'Übersicht';
    }

    prepareView(html) {
        this.template = Handlebars.compile(html);
    }

    renderView(onRender) {
        getProjects((res) => {
            console.log(res);
            onRender(this.template({ notes: res }));
        });
    }
}
