import { Note } from '../data/note.js';
import { persistNote } from '../service/note-service.js';

export class NewNotePage {
    constructor(router) {
        this.router = router;
        this.actionButtonListeners = this.generateActionButtonListeners();
    }

    onInit() {
        this.titleInput$ = $('#title');
        this.descriptionInput$ = $('#description');
        this.dueDateInput$ = $('#dueDate');
        this.importanceInput$ = $('#selected-rating');
        this.noteIdInput = $('#noteId');
        this.formInputs$ = $('form .input-element');

        this.loadSubmitListener();
        this.loadFormValidationListeners([...this.formInputs$]);
        this.loadStarRatingListeners();
        this.loadActionBtnListeners(this.actionButtonListeners);

        this.loadEditNoteIfExists();
    }

    get title() {
        return 'Neue Notiz';
    }

    get newNoteTitle() {
        return this.titleInput$.val();
    }

    get newNoteDescription() {
        return this.descriptionInput$.val();
    }

    get newNoteDueDate() {
        return this.dueDateInput$.val();
    }

    get newNoteImportance() {
        return Number(this.importanceInput$.val()) || undefined;
    }

    get noteId() {
        return this.noteIdInput.val() || undefined;
    }

    changeInputDate(isoDateString) {
        this.dueDateInput$.val(isoDateString);
        this.validateNote([this.dueDateInput$.attr('id')]);
    }

    validateNote(inputsToUpdate = []) {
        const errorObject = Note.validateProject(
            this.newNoteTitle,
            this.newNoteDescription,
            this.newNoteImportance,
            this.newNoteDueDate
        );

        const keysToUpdate =
            inputsToUpdate.length > 0
                ? Object.keys(errorObject).filter((key) => inputsToUpdate.includes(key))
                : Object.keys(errorObject);

        const fieldsToResetValidation =
            inputsToUpdate.length === 0
                ? [...this.formInputs$].map((input) => $(input).find('~ .error-text'))
                : [...inputsToUpdate].map((input) => $(`#${input} ~ .error-text`));

        $(fieldsToResetValidation).each((_, element) => $(element).text(''));

        keysToUpdate.forEach((key) => {
            $(`#${key} ~ .error-text`).text(errorObject[key].text);
        });

        return Object.keys(errorObject).length === 0;
    }

    submitProject() {
        if (this.validateNote()) {
            persistNote(
                new Note(
                    this.newNoteTitle,
                    this.newNoteDescription,
                    this.newNoteImportance,
                    this.newNoteDueDate,
                    this.noteId
                ),
                () => this.router.navigateTo(this.router.routes.myNotes)
            );
        }
    }

    loadEditNoteIfExists() {
        const jsonNoteToEdit = $('#note-holder').val();
        if (jsonNoteToEdit) {
            const note = JSON.parse(jsonNoteToEdit);
            this.preloadNote(note);
        }
    }

    preloadNote(note) {
        this.titleInput$.val(note.title);
        this.descriptionInput$.val(note.description);
        this.dueDateInput$.val(note.dueDate);
        this.noteIdInput.val(note.id);
        $(`#rating-${note.importance}`).click();
    }

    loadSubmitListener() {
        $('.submit > button').click(() => this.submitProject());
    }

    loadFormValidationListeners(formInputs) {
        formInputs.forEach((formInput) => $(formInput).blur(() => this.validateNote([$(formInput).attr('id')])));
    }

    loadStarRatingListeners() {
        for (let i = 1; i <= 5; i++) {
            $(`#rating-${i}`).click((it) => {
                const stars$ = $(it.target).parent().children();

                $.each(stars$, (index, item) => {
                    const star$ = $(item);
                    star$.removeClass('selected-star');

                    if (star$.attr('data-value') <= i) {
                        star$.addClass('selected-star');
                    }
                });

                $('#selected-rating').val(i).text(i);
                $(it.target).parent().parent().trigger('blur');
            });
        }
    }

    generateActionButtonListeners() {
        return {
            'btn-tomorrow': () => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                this.changeInputDate(tomorrow.toISOString().substring(0, 10));
            },
            'btn-nextMonth': () => {
                const today = new Date();
                const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1, 18);
                this.changeInputDate(nextMonth.toISOString().substring(0, 10));
            },
        };
    }

    loadActionBtnListeners(clickHandlers) {
        for (const clickHandlerKey in clickHandlers) {
            const btn$ = $(`#${clickHandlerKey}`);
            btn$.click(() => clickHandlers[clickHandlerKey]());
        }
    }
}
