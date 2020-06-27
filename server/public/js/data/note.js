import { maxLength, minLength, maxNumericValue, minNumericValue, required, dateInFuture } from '../utils/validators.js';

const validators = {
    title: [{ fn: required }, { fn: minLength, arg: 3 }, { fn: maxLength, arg: 25 }],
    description: [
        { fn: minLength, arg: 0 },
        { fn: maxLength, arg: 250 },
    ],
    importance: [{ fn: required }, { fn: minNumericValue, arg: 1 }, { fn: maxNumericValue, arg: 5 }],
    dueDate: [{ fn: required }, { fn: dateInFuture }],
};

export class Note {
    constructor(title, description, importance, dueDate, id) {
        this.title = title;
        this.description = description;
        this.importance = importance;
        this.dueDate = dueDate;
        this.id = id;
    }

    isValid() {
        return Note.validateProject(this.title, this.description, this.importance, this.dueDate);
    }

    static validateProject(title, description, importance, dueDate) {
        const validate = (validatorKey, input) => {
            let errorObj = {};
            validators[validatorKey].forEach((validationObj) => {
                errorObj = {
                    ...errorObj,
                    ...validationObj.fn.call(this, input, validationObj.arg),
                };
            });

            if (Object.keys(errorObj).length > 0) {
                return { [validatorKey]: errorObj };
            }
        };

        const validation = {
            ...validate('title', title),
            ...validate('description', description),
            ...validate('importance', importance),
            ...validate('dueDate', dueDate),
        };

        if (Object.keys(validation).length > 0) {
            return validation;
        }

        return [];
    }
}
