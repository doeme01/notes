import { deleteProject, getProjects } from '../service/project-service.js';

export class MyNotesPage {
    get title() {
        return 'Übersicht';
    }

    onInit() {
        this.addDeleteListeners();
    }

    prepareView(html) {
        this.template = Handlebars.compile(html);
    }

    renderView(onRender) {
        getProjects((res) => {
            this.notes = res;
            console.log({ notes: res });
            onRender(this.template({ notes: res }));
        });
    }

    deleteNote(idToDelete) {
        if (!this.notes) {
            console.error('You cannot delete a note before content was rendered');
            return;
        }

        const noteToDelete = this.notes.find((item) => item.id === idToDelete);
        if (noteToDelete) {
            deleteProject(noteToDelete.id, (res) => {
                this.notes = res;
                $('main')
                    .hide()
                    .html(this.template({ notes: res }))
                    .show();
            });
        } else {
            console.error(`Could not find Note with id ${idToDelete} within fetched Notes`);
        }
    }

    addDeleteListeners() {
        $('.deleteNote').each((index, btn$) => {
            $(btn$).click((_) => this.deleteNote($(btn$).data('index')));
        });
    }
}
