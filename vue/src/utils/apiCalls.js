import axios from 'axios';

const URL = 'http://localhost:8080';

export class APICalls {
    constructor() {}

    static loginUser(loginParams) {
        return axios({
            method: "post",
            url: URL + '/user/login',
            data: loginParams
        });
    }

    static getUser(userId) {
        return axios({
            method: "get",
            url: URL + '/user/' + userId,
        });
    }
    
    static getUsersList() {
        return axios({
            method: 'get',
            url: URL + '/user'
        });
    }

    static addNewUser(newUserData) {
        return axios({
            method: "post",
            url: URL + '/user/',
            data: newUserData
        });
    }

    static editUser(userData) {
        // TODO
    }

    static getUsersListNoAdmin() {
        return axios({
            method: "get",
            url: URL + '/user/',
            headers: {
                query: JSON.stringify({ "isAdmin": false })
            }
        });
    }

    static addNewUserStoryToProject(newUserStoryObj) {
        return axios({
            method: "post",
            url: URL + '/story/',
            data: newUserStoryObj
        });
    }

    static getProjectsList() {
        return axios({
            method: "get",
            url: URL + '/project/',
        });
    }

    static getStoriesList(storyId) {
        return axios({
            method: "get",
            url: URL + '/story/' + storyId,
        });
    }

    static addNewProject(newProjectObj) {
        return axios({
            method: "post",
            url: URL + '/project/',
            data: newProjectObj
        });
    }

    static updateProject(updatedProjObj, projectId) {
        return axios({
            method: "put",
            url: URL + '/project/' + projectId,
            data: updatedProjObj
        });
    }

    static getProjectBasedOnUserId(userId) {
        return axios({
            method: "get",
            url: URL + '/project/user/' + userId,
        });
    }

    static getProjectId(projectId) {
        return axios({
            method: "get",
            url: URL + '/project/' + projectId
        });
    }

    static createNewSprint(createSprintObj) {
        return axios({
            method: "post",
            url: URL + '/sprint/',
            data: createSprintObj
        });
    }

    static getProjectSprints(projectId) {
        return axios({
            method: "get",
            url: URL + '/sprint/all/' + projectId
        });
    }

    static getProjectBacklog(projectId) {
        return axios({
            method: "get",
            url: URL + '/story/backlog/' + projectId,
        });
    }

    static getActiveSprint(projectId) {
        return axios({
            method: "get",
            url: URL + '/sprint/active/' + projectId,
        });
    }

    static getDoneStories(projectId) {
        return axios({
            method: "get",
            url: URL + '/story/done/' + projectId,
        });
    }

    static getStoriesInsideCurrentSprint(projectId, sprintId) {
        return axios({
            method: "get",
            url: URL + '/story/sprint/' + projectId + '/' + sprintId,
        });
    }

    static updateUserStory(updatedProjObj, storyId) {
        return axios({
            method: "put",
            url: URL + '/story/' + storyId,
            data: updatedProjObj
        });
    }

    static addStoriesToActiveSprint(stories, sprintId) {
        return axios({
            method: "put",
            url: URL + '/story/add-to-sprint/' + sprintId,
            data: {
                stories
            }
        });
    }

    static deleteUserStory(storyId) {
        return axios({
            method: "delete",
            url: URL + '/story/' + storyId
        });
    }

    static addNewUserTask(newUserTaskObj) {
        return axios({
            method: "post",
            url: URL + '/task/',
            data: newUserTaskObj
        });
    }

    static updateUserTask(updatedUserTaskObj, taskId) {
        return axios({
            method: "put",
            url: URL + '/task/' + taskId,
            data: updatedUserTaskObj
        });
    }

    static getTasksInsideCurrentStory(storyId) {
        return axios({
            method: "get",
            url: URL + '/task/story/' + storyId
        });
    }

    static deleteUserTask(taskId) {
        return axios({
            method: "delete",
            url: URL + '/task/' + taskId
        });
    }

    static assignToMe(storyId, taskId, taskObject) {
        return axios({
            method: "put",
            url: URL + '/task/assign/story/' + storyId + '?taskId=' + taskId,
            data: taskObject
        });
    }

}