var express = require('express');
var router = express.Router();
var UserTaskController = require('../controllers/UserTaskController.js');

let story = function (req, res, next) {
	if (req.params.storyId) {
		req.headers.query = {storyId: req.params.storyId};
		next();
	}
	else {
		res.status(500).send("error")
	}
};

/*
 * GET
 */
router.get('/', UserTaskController.list);
router.get('/story/:storyId/', story, UserTaskController.list);

/*
 * GET
 */
router.get('/:id', UserTaskController.show);

/*
 * POST
 */
router.post('/', UserTaskController.create);

/*
 * PUT
 */
router.put('/:id', UserTaskController.update);

/*
 * DELETE
 */
router.delete('/:id', UserTaskController.remove);



module.exports = router;
