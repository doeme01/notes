const projectAPI = '/project/';
export const persistProject = function (project, onSuccess) {
    if (project && project.isValid()) {
        $.post(projectAPI, project, (res) => {
            onSuccess(res);
        });
    }
};

export const getProjects = function (onFinish) {
    $.get(projectAPI, (res) => {
        onFinish(res);
    });
};
