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
        projects.push(project);
        return project;
    }
};

const getProjects = function () {
    return [...projects] || [];
};

module.exports = { saveProject, getProjects };
