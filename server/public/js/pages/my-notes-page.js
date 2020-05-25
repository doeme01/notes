import { deleteNote, completeNote, getUnfinishedNotes } from '../service/project-service.js';

export class MyNotesPage {
    get title() {
        return 'Übersicht';
    }

    onInit() {
        this.addDeleteListeners();
        this.addCompleteNoteListeners();
    }

    prepareView(html) {
        this.template = Handlebars.compile(html);
    }

    renderView(onRender) {
        getUnfinishedNotes((res) => {
            this.notes = res;
            onRender(this.template({ notes: res }));
        });
    }

    performActionOnNote(note, action, params) {
        const repaintUi = (res) => {
            this.notes = res;
            $('main')
                .hide()
                .html(this.template({ notes: res }))
                .show();
        };

        if (note && this.notes) {
            action.apply(this, [params, repaintUi]);
        } else if (!this.notes) {
            console.error('You cannot delete a note before content was rendered');
        } else {
            console.error(`Could not find Note with id ${note.id} within fetched Notes`);
        }
    }

    addDeleteListeners() {
        this.addButtonListeners('.deleteNote', this.deleteNote.bind(this));
    }

    deleteNote(idOfNoteToDelete) {
        this.performActionOnNote(this.getNoteById(idOfNoteToDelete), deleteNote, idOfNoteToDelete);
    }

    addCompleteNoteListeners() {
        this.addButtonListeners('.checkNote', this.checkNote.bind(this));
    }

    checkNote(idOfNoteToComplete) {
        this.performActionOnNote(this.getNoteById(idOfNoteToComplete), completeNote, idOfNoteToComplete);
    }

    getNoteById(idToDelete) {
        return this.notes.find((item) => item.id === idToDelete);
    }

    addButtonListeners(element, action) {
        $(element).each((index, btn$) => {
            $(btn$).click((_) => action($(btn$).data('index')));
        });
    }
}
