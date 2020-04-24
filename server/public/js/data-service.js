let stars;

export let saveStarRating = (numberOfStars) => {
    if (!isNaN(numberOfStars)) {
        stars = numberOfStars;
    } else {
        console.error(`argument must be a number, given: ${numberOfStars}`);
    }
};

export let getStars = () => {
    return stars;
};
