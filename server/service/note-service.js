const crypto = require('crypto');
const notes = [];
const mandatoryNoteAttributes = ['title', 'dueDate', 'importance'];

function isValidNote(note) {
    return mandatoryNoteAttributes.every((attr) => !!note[attr]);
}

const saveNote = function (note) {
    if (isValidNote(note) && !note.id) {
        note.creationDate = new Date();
        note.finished = false;
        note.finishDate = undefined;
        note.id = crypto.randomBytes(16).toString('hex');
        notes.push(note);
        return note;
    } else if (note.id) {
        const indexOfNoteToUpdate = notes.findIndex((storedNote) => storedNote.id === note.id);
        if (indexOfNoteToUpdate) {
            notes[indexOfNoteToUpdate] = { ...notes[indexOfNoteToUpdate], ...note };
            return notes[indexOfNoteToUpdate];
        } else {
            console.error(`Given Id ${note.id} of note to update not found on Server`);
        }
    } else {
        console.error(`Given Note is not valid, ${note}`);
    }
};

const getNotes = function (getFinishedNotes = false) {
    const allNotes = [...notes] || [];
    if (getFinishedNotes) {
        return allNotes.filter((note) => note.finished);
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
