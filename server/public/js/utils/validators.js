export function required(input) {
    if (typeof input === 'number') {
        return input >= 0 ? undefined : { required: true };
    } else {
        return !!input || { required: true, text: 'Dieses Feld ist ein Pflichfeld, bitte geben Sie einen Wert ein!' };
    }
}

export function minLength(input, minLength = 5) {
    if (input) {
        if (input.length < minLength) {
            return { minLength: true, text: `Der Text muss eine Mindestlänge von ${minLength} haben!` };
        }
    }
}

export function maxLength(input, maxLength = 25) {
    if (input) {
        if (input.length > maxLength) {
            return { maxLength: true, text: `Der Text darf nicht länger als ${maxLength} Zeichen sein!` };
        }
    }
}

export function minNumericValue(input, minValue = 0) {
    if (typeof input === 'number') {
        if (input < minValue) {
            return { minValue: true, text: `Der Mindestwert für diese Eingabe liegt bei ${minValue}!` };
        }
    }
}

export function maxNumericValue(input, maxValue = 5) {
    if (typeof input === 'number') {
        if (input > maxValue) {
            return { maxValue: true, text: `Der Maximalwert für diese Eingabe liegt bei ${maxValue}!` };
        }
    }
}

export function dateInFuture(input) {
    const now = new Date();
    const inputDate = input ? new Date(input) : undefined;

    if (!inputDate) {
        return { required: true, text: 'Bitte geben Sie ein Datum ein' };
    } else if (now.getTime() > inputDate.getTime()) {
        return { dateNotInFuture: true, text: 'Das Datum muss in der Zukunft liegen!' };
    }
}
