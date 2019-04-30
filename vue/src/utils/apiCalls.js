import axios from 'axios';

const URL = 'http://localhost:8080';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000
});

export class APICalls {
    constructor() {}

    static loginUser(loginParams) {
        return instance({
            method: "post",
            url: '/user/login',
            data: loginParams
        });
    }

    static getUser(userId) {
        return instance({
            method: "get",
            url: '/user/' + userId,
        });
    }
    
    static getUsersList() {
        return instance({
            method: 'get',
            url: '/user'
        });
    }

    static addNewUser(newUserData) {
        return instance({
            method: "post",
            url: '/user/',
            data: newUserData
        });
    }

    static editUser(userData, userId) {
        return instance({
            method: "put",
            url: '/user/' + userId,
            data: userData
        });
    }

    static getUsersListNoAdmin() {
        return instance({
            method: "get",
            url: '/user/',
            headers: {
                query: JSON.stringify({ "isAdmin": false })
            }
        });
    }

    static addNewUserStoryToProject(newUserStoryObj) {
        return instance({
            method: "post",
            url: '/story/',
            data: newUserStoryObj
        });
    }

    static getProjectsList() {
        return instance({
            method: "get",
            url: '/project/',
        });
    }

    static createProject(newProjectObj) {
        return instance({
            method: "post",
            url: '/project/',
            data: newProjectObj
        });
    }

    static updateProject(updatedProjObj, projectId) {
        return instance({
            method: "put",
            url: '/project/' + projectId,
            data: updatedProjObj
        });
    }

    static getProjectBasedOnUserId(userId) {
        return instance({
            method: "get",
            url: '/project/user/' + userId,
        });
    }

    static getProjectId(projectId) {
        return instance({
            method: "get",
            url: '/project/' + projectId
        });
    }

    static createNewSprint(sprintData) {
        return instance({
            method: "post",
            url: '/sprint/',
            data: sprintData
        });
    }
    
    static updateSprint(sprintId, updateObject) {
        return instance({
            method: "put",
            url: '/sprint/' + sprintId,
            data: updateObject
        });
    }

    static getProjectSprints(projectId) {
        return instance({
            method: "get",
            url: '/sprint/all/' + projectId
        });
    }

    static getProjectBacklog(projectId) {
        return instance({
            method: "get",
            url: '/story/backlog/' + projectId,
        });
    }

    static getActiveSprint(projectId) {
        return instance({
            method: "get",
            url: '/sprint/active/' + projectId,
        });
    }

    static getUnfinishedSprints(projectId) {
        return instance({
            method: "get",
            url: '/sprint/unfinished/' + projectId,
        });
    }

    static getDoneStories(projectId) {
        return instance({
            method: "get",
            url: '/story/done/' + projectId,
        });
    }

    static getStoriesInsideCurrentSprint(projectId, sprintId) {
        return instance({
            method: "get",
            url: '/story/sprint/' + projectId + '/' + sprintId,
        });
    }

    static updateUserStory(updatedProjObj, storyId) {
        return instance({
            method: "put",
            url: '/story/' + storyId,
            data: updatedProjObj
        });
    }

    static addStoriesToActiveSprint(stories, sprintId) {
        return instance({
            method: "put",
            url: '/story/add-to-sprint/' + sprintId,
            data: {
                stories
            }
        });
    }

    static deleteUserStory(storyId) {
        return instance({
            method: "delete",
            url: '/story/' + storyId
        });
    }

    static addNewUserTask(newUserTaskObj) {
        return instance({
            method: "post",
            url: '/task/',
            data: newUserTaskObj
        });
    }

    static updateUserTask(updatedUserTaskObj, taskId) {
        return instance({
            method: "put",
            url: '/task/' + taskId,
            data: updatedUserTaskObj
        });
    }

    static getTasksInsideCurrentStory(storyId) {
        return instance({
            method: "get",
            url: '/task/story/' + storyId
        });
    }

    static deleteUserTask(taskId) {
        return instance({
            method: "delete",
            url: '/task/' + taskId
        });
    }

    static assignToMe(storyId, taskId, taskObject) {
        return instance({
            method: "put",
            url: '/task/assign/story/' + storyId + '?taskId=' + taskId,
            data: taskObject
        });
    }

    static setActiveStatus(taskId, isActive) {
        return instance({
            method: "put",
            url: '/task/active/' + taskId,
            data: {
                isActive
            }
        });
    }
}