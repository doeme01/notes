import { completeNote, deleteNote, getAllNotes, getUnfinishedNotes } from '../service/note-service.js';
import { AppRouter } from '../router.js';

export class MyNotesPage {
    constructor(router) {
        this.router = router;
        this.shouldSortByDueDate = false;
        this.shouldSortByImportance = false;
        this.shouldShowFinishedNotes = false;
        this.finishedNotes = [];
        this.activeNotes = [];
        this.locale = 'de-DE';
        this.dateFormatOptions = { year: '2-digit', month: '2-digit', day: '2-digit' };
    }

    get title() {
        return 'Übersicht';
    }

    onInit() {
        this.addDeleteListeners();
        this.addCompleteNoteListeners();
        this.addEditNoteListeners();
        this.addActionBarListeners();
        this.showActiveActionBarButton();
    }

    prepareView(html) {
        this.template = Handlebars.compile(html);
    }

    renderView(onRender) {
        getUnfinishedNotes((res) => {
            this.activeNotes = this.sortNotes(res);
            onRender(
                this.template({
                    notes: this.activeNotes,
                    finishedNotes: this.shouldShowFinishedNotes ? this.finishedNotes : [],
                })
            );
        });
    }

    sortNotes(notesToSort) {
        if (notesToSort) {
            if (this.shouldSortByImportance) {
                notesToSort.sort(this.compareNotesByImportance);
            } else if (this.shouldSortByDueDate) {
                notesToSort.sort(this.compareNotesByDueDate);
            }
        }
        notesToSort.map(
            (note) =>
                (note.formattedDueDate = new Date(note.dueDate).toLocaleDateString(this.locale, this.dateFormatOptions))
        );
        return notesToSort;
    }

    sortByImportance() {
        this.shouldSortByImportance = true;
        this.shouldSortByDueDate = false;
        this.repaintUi();
        AppRouter.persistQueryParamState(this.router.queryParamHandlers.sort.identifier, 'importance');
    }

    toggleSortByImportanceButton(isActive) {
        const sortButton$ = $('#btn-filter-importance');

        if (isActive) {
            sortButton$.addClass('active');
            this.toggleSortButtonByDueDate(false);
        } else {
            sortButton$.removeClass('active');
        }
    }

    compareNotesByImportance(a, b) {
        return b.importance - a.importance;
    }

    sortByDueDate() {
        this.shouldSortByDueDate = true;
        this.shouldSortByImportance = false;
        this.repaintUi();
        AppRouter.persistQueryParamState(this.router.queryParamHandlers.sort.identifier, 'dueDate');
    }

    compareNotesByDueDate(a, b) {
        return new Date(a.dueDate) - new Date(b.dueDate);
    }

    toggleSortButtonByDueDate(isActive) {
        const sortButton$ = $('#btn-filter-dueDate');

        if (isActive) {
            sortButton$.addClass('active');
            this.toggleSortByImportanceButton(false);
        } else {
            sortButton$.removeClass('active');
        }
    }

    showActiveNotes = () => {
        getUnfinishedNotes((res) => {
            this.activeNotes = this.sortNotes(res);
            this.repaintUi();
        });
        AppRouter.persistQueryParamState(this.router.queryParamHandlers.includeFinishedNotes.identifier, 'false');
    };

    toggleFinishedNotes = () => {
        this.shouldShowFinishedNotes = this.shouldShowFinishedNotes
            ? (this.shouldShowFinishedNotes = false)
            : (this.shouldShowFinishedNotes = true);

        if (this.shouldShowFinishedNotes) {
            getAllNotes((res) => {
                this.finishedNotes = res;
                this.repaintUi();
            });
        } else {
            this.repaintUi();
        }
        AppRouter.persistQueryParamState(
            this.router.queryParamHandlers.includeFinishedNotes.identifier,
            this.shouldShowFinishedNotes.toString()
        );
    };

    performActionOnNote(note, action, params) {
        if (note && this.activeNotes) {
            action.apply(this, [params, this.repaintUi]);
        } else if (!this.activeNotes) {
            console.error('You cannot delete a note before content was rendered');
        } else {
            console.error(`Could not find Note with id ${note.id} within fetched Notes`);
        }
    }

    repaintUi = () => {
        this.sortNotes(this.activeNotes);
        this.sortNotes(this.finishedNotes);

        if (this.template) {
            $('main')
                .hide()
                .html(
                    this.template({
                        notes: this.activeNotes,
                        finishedNotes: this.shouldShowFinishedNotes ? this.finishedNotes : [],
                    })
                )
                .show();
        }

        this.onInit();
    };

    addDeleteListeners() {
        this.addButtonListeners('.deleteNote', this.deleteNote.bind(this));
    }

    deleteNote(idOfNoteToDelete) {
        this.performActionOnNote(this.getNoteById(idOfNoteToDelete), deleteNote, idOfNoteToDelete);
        this.activeNotes = this.activeNotes.filter((note) => note.id !== idOfNoteToDelete);
    }

    addCompleteNoteListeners() {
        this.addButtonListeners('.checkNote', this.checkNote.bind(this));
    }

    addEditNoteListeners() {
        this.addButtonListeners('.editNote', this.editNote.bind(this));
    }

    checkNote(idOfNoteToComplete) {
        this.performActionOnNote(this.getNoteById(idOfNoteToComplete), completeNote, idOfNoteToComplete);
        const noteToFinish = this.activeNotes.find((note) => note.id === idOfNoteToComplete);
        this.activeNotes = this.activeNotes.filter((note) => note.id !== idOfNoteToComplete);
        this.finishedNotes.push(noteToFinish);
    }

    editNote(idOfNoteToEdit) {
        $('#note-holder').val(JSON.stringify(this.getNoteById(idOfNoteToEdit)));
        this.router.navigateTo(this.router.routes.new);
    }

    addActionBarListeners() {
        this.addButtonListeners('#btn-filter-dueDate', this.sortByDueDate.bind(this));
        this.addButtonListeners('#btn-filter-importance', this.sortByImportance.bind(this));
        this.addButtonListeners('#btn-show-all', this.toggleFinishedNotes.bind(this));
    }

    showActiveActionBarButton() {
        if (this.shouldSortByDueDate) {
            this.toggleSortButtonByDueDate(true);
        } else if (this.shouldSortByImportance) {
            this.toggleSortByImportanceButton(true);
        }

        if (this.shouldShowFinishedNotes) {
            $('#btn-show-all').text('Abgeschlossene ausblenden');
        } else {
            $('#btn-show-all').text('Abgeschlossene anzeigen');
        }
    }

    getNoteById(idToDelete) {
        return this.activeNotes.find((item) => item.id === idToDelete);
    }

    addButtonListeners(element, action) {
        $(element).each((index, btn$) => {
            $(btn$).click((_) => action($(btn$).data('index')));
        });
    }
}
