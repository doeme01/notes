import { deleteNote, completeNote, getUnfinishedNotes, getAllNotes } from '../service/note-service.js';
import { AppRouter, URL_PARAM_HANDLER } from '../router.js';

export class MyNotesPage {
    constructor() {
        this.shouldSortByDueDate = false;
        this.shouldSortByImportance = false;
        this.currentShownNotes = undefined;
        this.allNotes = undefined;
        this.activeNotes = undefined;
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
            this.activeNotes = res;
            this.currentShownNotes = this.sortNotes(res);
            onRender(this.template({ notes: this.currentShownNotes }));
        });
    }

    sortNotes(notesToSort) {
        if (this.shouldSortByImportance) {
            notesToSort.sort(this.compareNotesByImportance);
        } else if (this.shouldSortByDueDate) {
            notesToSort.sort(this.compareNotesByDueDate);
        }
        return notesToSort;
    }

    sortByImportance = () => {
        this.shouldSortByImportance = true;
        if (this.currentShownNotes) {
            this.repaintUi(this.currentShownNotes.sort(this.compareNotesByImportance));
        }
        AppRouter.persistQueryParamState(URL_PARAM_HANDLER.sort.identifier, 'importance');
    };

    compareNotesByImportance(a, b) {
        return b.importance - a.importance;
    }

    sortByDueDate = () => {
        this.shouldSortByDueDate = true;
        if (this.currentShownNotes) {
            this.repaintUi(this.currentShownNotes.sort(this.compareNotesByDueDate));
        }
        AppRouter.persistQueryParamState(URL_PARAM_HANDLER.sort.identifier, 'dueDate');
    };

    compareNotesByDueDate(a, b) {
        return new Date(a.dueDate) - new Date(b.dueDate);
    }

    showActiveNotes = () => {
        getUnfinishedNotes((res) => {
            this.activeNotes = res;
            this.repaintUi(this.sortNotes(this.activeNotes));
        });
        AppRouter.persistQueryParamState(URL_PARAM_HANDLER.includeFinishedNotes.identifier, 'false');
    };

    showAllNotes = () => {
        getAllNotes((res) => {
            this.allNotes = res;
            this.repaintUi(this.sortNotes(this.allNotes));
        });
        AppRouter.persistQueryParamState(URL_PARAM_HANDLER.includeFinishedNotes.identifier, 'true');
    };

    performActionOnNote(note, action, params) {
        if (note && this.currentShownNotes) {
            action.apply(this, [params, this.repaintUi]);
        } else if (!this.currentShownNotes) {
            console.error('You cannot delete a note before content was rendered');
        } else {
            console.error(`Could not find Note with id ${note.id} within fetched Notes`);
        }
    }

    repaintUi = (notesToDisplay) => {
        this.currentShownNotes = notesToDisplay;
        $('main')
            .hide()
            .html(this.template({ notes: notesToDisplay }))
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
        return this.currentShownNotes.find((item) => item.id === idToDelete);
    }

    addButtonListeners(element, action) {
        $(element).each((index, btn$) => {
            $(btn$).click((_) => action($(btn$).data('index')));
        });
    }
}
