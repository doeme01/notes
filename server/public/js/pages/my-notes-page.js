import { deleteNote, completeNote, getUnfinishedNotes } from '../service/note-service.js';
import { AppRouter, URL_PARAM_HANDLER } from '../router.js';

export class MyNotesPage {
    constructor() {
        this.shouldSortByDueDate = false;
        this.shouldSortByImportance = false;
    }

    get title() {
        return 'Übersicht';
    }

    onInit() {
        this.addDeleteListeners();
        this.addCompleteNoteListeners();
        this.addActionBarListeners();
    }

    prepareView(html) {
        this.template = Handlebars.compile(html);
    }

    renderView(onRender, options) {
        getUnfinishedNotes((res) => {
            if (this.shouldSortByImportance) {
                res.sort(this.compareNotesByImportance);
            } else if (this.shouldSortByDueDate) {
                res.sort(this.compareNotesByDueDate);
            }
            this.notes = res;
            onRender(this.template({ notes: this.notes }));
        });
    }

    sortByImportance = () => {
        this.shouldSortByImportance = true;
        if (this.notes) {
            this.repaintUi(this.notes.sort(this.compareNotesByImportance));
        }
        AppRouter.persistQueryParamState(URL_PARAM_HANDLER.sort.identifier, 'importance');
    };

    compareNotesByImportance(a, b) {
        return b.importance - a.importance;
    }

    sortByDueDate = () => {
        this.shouldSortByDueDate = true;
        if (this.notes) {
            this.repaintUi(this.notes.sort(this.compareNotesByDueDate));
        }
        AppRouter.persistQueryParamState(URL_PARAM_HANDLER.sort.identifier, 'dueDate');
    };

    compareNotesByDueDate(a, b) {
        return new Date(a.dueDate) - new Date(b.dueDate);
    }

    showAllNotes = () => {
        console.log('showing all notes');
    };

    performActionOnNote(note, action, params) {
        if (note && this.notes) {
            action.apply(this, [params, this.repaintUi]);
        } else if (!this.notes) {
            console.error('You cannot delete a note before content was rendered');
        } else {
            console.error(`Could not find Note with id ${note.id} within fetched Notes`);
        }
    }

    repaintUi = (res) => {
        this.notes = res;
        $('main')
            .hide()
            .html(this.template({ notes: res }))
            .show();
        this.onInit();
    };

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

    addActionBarListeners() {
        this.addButtonListeners('#btn-filter-dueDate', this.sortByDueDate.bind(this));
        this.addButtonListeners('#btn-filter-importance', this.sortByImportance.bind(this));
        this.addButtonListeners('#btn-show-all', this.showAllNotes.bind(this));
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
