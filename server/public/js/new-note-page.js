import * as dataService from './data-service.js';

export class NewNotePage {
    onInit() {
        this.#loadStarRatingListeners();
    }

    get title() {
        return 'Neue Notiz';
    }

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
