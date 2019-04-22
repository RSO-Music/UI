var express = require('express');
var router = express.Router();
var UserStoryController = require('../controllers/UserStoryController.js');

let done = function (req, res, next) {
    req.headers.query = {done: true, projectId: req.params.projectId};
    next();
};

let sprint = function (req, res, next) {
    if (req.params.id) {
        req.headers.query = {sprintId: req.params.id, projectId: req.params.projectId};
        next();
    }
    else {
        res.status(500).send("error")
    }
};

let inbacklog = function (req, res, next) {
    req.headers.query = {sprintId: null, done: false, projectId: req.params.projectId};
    next();
};

/*
 * GET
 */
router.get('/', UserStoryController.list);
router.get('/done/:projectId', done, UserStoryController.list);
router.get('/sprint/:projectId/:id', sprint, UserStoryController.list);
router.get('/inbacklog/:projectId', inbacklog, UserStoryController.list);

/*
 * GET
 */
router.get('/:id', UserStoryController.show);

/*
 * POST
 */
router.post('/', UserStoryController.create);

/*
 * PUT
 */
router.put('/:id', UserStoryController.update);

/*
 * DELETE
 */
router.delete('/:id', UserStoryController.remove);



module.exports = router;
