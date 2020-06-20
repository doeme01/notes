const noteService = require('../service/note-service');
const express = require('express');
const router = express.Router();

/* Saves a new Project. */
router.post('/', function (req, res, next) {
    const savedNote = noteService.saveNote(req.body);
    if (savedNote) {
        res.status(200).send(savedNote);
    } else {
        res.sendStatus(400);
    }
});

router.get('/', function (req, res, next) {
    if (req.query && req.query.includeFinished) {
        res.send(noteService.getNotes(true));
    } else {
        res.send(noteService.getNotes());
    }
});

router.delete('/:id', function (req, res, next) {
    const id = req.params.id;
    const remainingNotes = noteService.deleteNote(id);
    if (remainingNotes) {
        res.send(noteService.getNotes());
    } else {
        res.sendStatus(400);
    }
});

router.put('/:id', function (req, res, next) {
    const id = req.params.id;
    const notes = noteService.completeNote(id);
    if (notes) {
        res.send(noteService.getNotes());
    } else {
        res.sendStatus(400);
    }
});

// generating dummy data on server start
for (let i = 0; i < 9; i++) {
    noteService.saveNote({
        title: `Note #${i + 1}`,
        description: 'any description',
        importance: i % 2 === 0 ? 1 : 3,
        dueDate: `2020-01-0${i + 1}`,
    });
}

module.exports = router;
