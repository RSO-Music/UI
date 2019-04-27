const express = require('express');
const router = express.Router();
const SprintController = require('../controllers/SprintController');

router.get('/', SprintController.findAll);


router.get('/all/:projectId', SprintController.findAllForProject);

router.get('/active/:projectId', SprintController.findActiveForProject);


router.get('/:id', SprintController.findOne);


router.post('/', SprintController.create);


router.put('/:id', SprintController.update);


router.delete('/:id', SprintController.delete);


module.exports = router;
