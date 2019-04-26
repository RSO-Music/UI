const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController.js');

router.get('/', UserController.findAll);


router.post('/login', UserController.login);


router.get('/:id', UserController.show);


router.post('/', UserController.create);


router.put('/:id', UserController.update);


router.delete('/:id', UserController.remove);


module.exports = router;
