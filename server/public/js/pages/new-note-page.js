import { Project } from '../data/project.js';
import { persistNote } from '../service/project-service.js';
import { AppRouter, ROUTES } from '../router.js';

export class NewNotePage {
    actionButtonListeners = {
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

    onInit() {
        this.titleInput$ = $('#title');
        this.descriptionInput$ = $('#description');
        this.dueDateInput$ = $('#dueDate');
        this.importanceInput$ = $('#selected-rating');
        this.formInputs$ = $('form .input-element');

        this.loadSubmitListener();
        this.loadFormValidationListeners([...this.formInputs$]);
        this.loadStarRatingListeners();
        this.loadActionBtnListeners(this.actionButtonListeners);
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

    changeInputDate(isoDateString) {
        this.dueDateInput$.val(isoDateString);
        this.validateProject([this.dueDateInput$.attr('id')]);
    }

    validateProject(inputsToUpdate = []) {
        const errorObject = Project.validateProject(
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
        if (this.validateProject()) {
            persistNote(
                new Project(this.newNoteTitle, this.newNoteDescription, this.newNoteImportance, this.newNoteDueDate),
                (_) => AppRouter.routeTo(ROUTES.myNotes)
            );
        }
    }

    loadSubmitListener() {
        $('.submit > button').click((_) => this.submitProject());
    }

    loadFormValidationListeners(formInputs) {
        formInputs.forEach((formInput) => $(formInput).blur((_) => this.validateProject([$(formInput).attr('id')])));
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

    loadActionBtnListeners(clickHandlers) {
        for (let clickHandlerKey in clickHandlers) {
            const btn$ = $(`#${clickHandlerKey}`);
            btn$.click(() => clickHandlers[clickHandlerKey]());
        }
    }
}
