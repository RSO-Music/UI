const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/ProjectController.js');

/**
 * Fetch all the projects
 */
router.get('/', ProjectController.findAll);


/**
 * Fetch all the projects that are related to the current user
 */
router.get('/user/:userId', ProjectController.findForUser);


/**
 * Fetch project by id
 */
router.get('/:id', ProjectController.findOne);


/**
 * Create new project
 */
router.post('/', ProjectController.create);


/**
 * Update a project
 */
router.put('/:id', ProjectController.update);


/**
 * Delete a project
 */
router.delete('/:id', ProjectController.delete);


module.exports = router;
