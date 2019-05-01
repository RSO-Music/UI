const express = require('express');
const router = express.Router();
const UserTaskController = require('../controllers/UserTaskController.js');

router.get('/', UserTaskController.findAll);


router.get('/story/:storyId/', UserTaskController.findAllForStory);


router.get('/:id', UserTaskController.findOne);


router.post('/', UserTaskController.create);


router.put('/:id', UserTaskController.update);


router.delete('/:id', UserTaskController.remove);


router.put('/assign/story/:storyId', UserTaskController.assign);


router.put('/unassign/story/:storyId', UserTaskController.unassign);


router.put('/active/:taskId', UserTaskController.changeActiveStatus);


module.exports = router;
