import * as dataService from '../data-service.js';
import { Project } from '../data/project.js';

export class NewNotePage {
    #titleInput$;
    #descriptionInput$;
    #dueDateInput$;
    #newNoteImportance;

    onInit() {
        this.#titleInput$ = $('#title');
        this.#descriptionInput$ = $('#description');
        this.#dueDateInput$ = $('#dueDate');
        this.#newNoteImportance = 0;

        this.#loadSubmitListener();
        this.#loadFormValidationListeners([
            this.#titleInput$,
            this.#descriptionInput$,
            this.#dueDateInput$,
            this.#newNoteImportance,
        ]);
        this.#loadStarRatingListeners();
    }

    get title() {
        return 'Neue Notiz';
    }

    get newNoteTitle() {
        return this.#titleInput$.val();
    }

    get newNoteDescription() {
        return this.#descriptionInput$.val();
    }

    get newNoteDueDate() {
        return this.#dueDateInput$.val();
    }

    set newNoteImportance(importance) {
        if (!isNaN(importance) && importance > 0) {
            this.#newNoteImportance = importance;
        } else {
            console.error(`Cannot process 'importance' which is not a number or below zero. Given: ${importance}`);
        }
    }

    get newNoteImportance() {
        return this.#newNoteImportance;
    }

    #validateProject = (inputsToUpdate = []) => {
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

        keysToUpdate.forEach((key) => {
            console.log(errorObject[key]);
            $(`#${key} ~ .error-text`).text(errorObject[key].text);
        });
    };

    #loadSubmitListener = () => {
        $('.submit > button').click((_) => this.#validateProject());
    };

    #loadFormValidationListeners = (formInputs) => {
        formInputs.forEach((formInput) => $(formInput).blur((_) => this.#validateProject([$(formInput).attr('id')])));
    };

    #loadStarRatingListeners = () => {
        for (let i = 1; i <= 5; i++) {
            $(`#rating-${i}`).on('click', (it) => {
                let stars$ = $(it.target).parent().children();

                $.each(stars$, (index, item) => {
                    let star$ = $(item);
                    star$.removeClass('selected-star');

                    if (star$.attr('data-value') <= i) {
                        star$.addClass('selected-star');
                    }
                });

                dataService.saveStarRating(i);
                $('#selected-rating').text(dataService.getStars());
            });
        }
    };
}
