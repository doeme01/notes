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
    }
    res.sendStatus(400);
});

router.put('/:id', function (req, res, next) {
    const id = req.params.id;
    const notes = noteService.completeNote(id);
    if (notes) {
        res.send(noteService.getNotes());
    }
    res.sendStatus(400);
});

module.exports = router;
