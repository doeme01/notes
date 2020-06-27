const noteAPI = '/note';

export const persistNote = function (note, onSuccess) {
    if (note && note.isValid()) {
        $.post(noteAPI, note, (res) => {
            onSuccess(res);
        });
    }
};

export const getUnfinishedNotes = function (onFinish) {
    $.get(noteAPI, (res) => {
        onFinish(res);
    });
};

export const getAllNotes = function (onFinish) {
    $.get(noteAPI + '?includeFinished=true', (res) => {
        onFinish(res);
    });
};

export const deleteNote = function (noteId, onSuccess) {
    if (noteId) {
        $.ajax({
            url: `${noteAPI}/${noteId}`,
            type: 'DELETE',
        }).done((res) => onSuccess(res));
    }
};

export const completeNote = function (noteId, onSuccess) {
    if (noteId) {
        $.ajax({
            url: `${noteAPI}/${noteId}`,
            type: 'PUT',
        }).done((res) => onSuccess(res));
    }
};
