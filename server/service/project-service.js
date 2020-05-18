const crypto = require('crypto');
const projects = [];
const projectAttributes = ['title', 'dueDate', 'importance'];

function isValidProject(project) {
    return projectAttributes.every((attr) => !!project[attr]);
}

const saveProject = function (project) {
    if (isValidProject(project)) {
        project.creationDate = new Date();
        project.finished = false;
        project.finishDate = undefined;
        project.id = crypto.randomBytes(16).toString('hex');
        projects.push(project);
        return project;
    }
};

const getProjects = function () {
    return [...projects] || [];
};

const deleteProject = function (projectId) {
    const projectToDelete = projects.findIndex((item) => item.id === projectId);
    if (projectToDelete > -1) {
        projects.splice(projectToDelete, 1);
        return getProjects;
    } else {
        return undefined;
    }
};

module.exports = { saveProject, getProjects, deleteProject };
