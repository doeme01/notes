import { getProjects } from '../service/project-service.js';

export class MyNotesPage {
    get title() {
        return 'Übersicht';
    }

    onInit() {
        getProjects((res) => {
            console.log('res in controller, {}', res);
        });
    }
}
