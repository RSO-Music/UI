const UserController = require('../controllers/UserController');

module.exports = function () {
    UserController.createAdminIfItDoesNotExist();
};