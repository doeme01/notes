const projectService = require('../service/project-service');
const express = require('express');
const router = express.Router();

/* Saves a new Project. */
router.post('/', function (req, res, next) {
    const savedProject = projectService.saveProject(req.body);
    if (savedProject) {
        res.status(200).send(savedProject);
    } else {
        res.sendStatus(400);
    }
});

/* Fetches all Projects */
router.get('/', function (req, res, next) {
    res.send(projectService.getProjects());
});

router.delete('/:id', function (req, res, next) {
    const id = req.params.id;
    const remainingProjects = projectService.deleteProject(id);
    if (remainingProjects) {
        res.send(projectService.getProjects());
    }
    res.sendStatus(400);
});

module.exports = router;
