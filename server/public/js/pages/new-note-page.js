import * as dataService from '../data-service.js';
import { Project } from '../data/project.js';

export class NewNotePage {
    titleInput$;
    descriptionInput$;
    dueDateInput$;
    importanceInput$;
    formInputs$;

    onInit() {
        this.titleInput$ = $('#title');
        this.descriptionInput$ = $('#description');
        this.dueDateInput$ = $('#dueDate');
        this.importanceInput$ = $('#selected-rating');
        this.formInputs$ = $('form .input-element');

        this.loadSubmitListener();
        this.loadFormValidationListeners([...this.formInputs$]);
        this.loadStarRatingListeners();
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

    validateProject = (inputsToUpdate = []) => {
        let errorObject = Project.validateProject(
            this.newNoteTitle,
            this.newNoteDescription,
            this.newNoteImportance,
            this.newNoteDueDate
        );

        let keysToUpdate =
            inputsToUpdate.length > 0
                ? Object.keys(errorObject).filter((key) => inputsToUpdate.includes(key))
                : Object.keys(errorObject);

        let fieldsToResetValidation =
            inputsToUpdate.length === 0
                ? [...this.formInputs$].map((input) => $(input).find('~ .error-text'))
                : [...inputsToUpdate].map((input) => $(`#${input} ~ .error-text`));

        $(fieldsToResetValidation).each((_, element) => $(element).text(''));

        keysToUpdate.forEach((key) => {
            $(`#${key} ~ .error-text`).text(errorObject[key].text);
        });
    };

    loadSubmitListener = () => {
        $('.submit > button').click((_) => this.validateProject());
    };

    loadFormValidationListeners = (formInputs) => {
        formInputs.forEach((formInput) => $(formInput).blur((_) => this.validateProject([$(formInput).attr('id')])));
    };

    loadStarRatingListeners = () => {
        for (let i = 1; i <= 5; i++) {
            $(`#rating-${i}`).click((it) => {
                let stars$ = $(it.target).parent().children();

                $.each(stars$, (index, item) => {
                    let star$ = $(item);
                    star$.removeClass('selected-star');

                    if (star$.attr('data-value') <= i) {
                        star$.addClass('selected-star');
                    }
                });

                $('#selected-rating').val(i).text(i);
                $(it.target).parent().parent().trigger('blur');
            });
        }
    };
}
