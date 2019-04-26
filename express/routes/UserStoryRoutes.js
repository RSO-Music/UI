const express = require('express');
const router = express.Router();
const UserStoryController = require('../controllers/UserStoryController.js');

router.get('/', UserStoryController.findAll);


router.get('/done/:projectId', UserStoryController.findFinishedStories);


router.get('/sprint/:projectId/:id', UserStoryController.findStoriesInSprint);


router.get('/backlog/:projectId', UserStoryController.findStoriesInBacklog);


router.get('/:id', UserStoryController.findOne);


router.post('/', UserStoryController.create);


router.put('/:id', UserStoryController.update);


router.delete('/:id', UserStoryController.delete);


module.exports = router;
