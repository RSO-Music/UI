var express = require('express');
var router = express.Router();
var SprintController = require('../controllers/SprintController');

/*
 * GET
 */
router.get('/', SprintController.list);

/*
 * GET
 */
router.get('/active/:projectId', SprintController.active);
router.get('/:id', SprintController.show);

/*
 * POST
 */
router.post('/', SprintController.create);

/*
 * PUT
 */
router.put('/:id', SprintController.update);

/*
 * DELETE
 */
router.delete('/:id', SprintController.remove);

module.exports = router;
