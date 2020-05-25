const crypto = require('crypto');
const notes = [];
const mandatoryNoteAttributes = ['title', 'dueDate', 'importance'];

function isValidNote(project) {
    return mandatoryNoteAttributes.every((attr) => !!project[attr]);
}

const saveNote = function (project) {
    if (isValidNote(project)) {
        project.creationDate = new Date();
        project.finished = false;
        project.finishDate = undefined;
        project.id = crypto.randomBytes(16).toString('hex');
        notes.push(project);
        return project;
    }
};

const getNotes = function (includeFinished = false) {
    const allNotes = [...notes] || [];
    if (includeFinished) {
        return allNotes;
    }
    return allNotes.filter((note) => !note.finished);
};

const deleteNote = function (noteId) {
    const noteToDelete = notes.findIndex((item) => item.id === noteId);
    if (noteToDelete > -1) {
        notes.splice(noteToDelete, 1);
        return getNotes();
    } else {
        return undefined;
    }
};

const completeNote = function (noteId) {
    const noteToComplete = notes.find((item) => item.id === noteId);

    if (noteToComplete) {
        noteToComplete.finished = true;
        noteToComplete.finishDate = new Date();
        return getNotes();
    } else {
        return undefined;
    }
};

module.exports = { saveNote, getNotes, completeNote, deleteNote };
