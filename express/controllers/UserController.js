const UserModel = require('../models/UserModel.js');

const userRoles = require('../lib/userRoles');

module.exports = {
    findAll(req, res) {
        UserModel.find({ role: { $ne: 'system_admin' } }, function (err, Users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User.',
                    error: err
                });
            }
            return res.json(Users);
        });
    },

    login(req, res) {
        let username = req.body.username;
        let password = req.body.password;

        UserModel.findOne({ username: username }, function (err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User.',
                    error: err
                });
            }
            if (!User) {
                return res.status(404).json({
                    message: 'Incorrect usename or password'
                });
            }
            if (User.password === password)
                return res.json(User);
            else
                return res.status(403).send("Incorrect username and password combination.")
        });
    },

    show(req, res) {
        const id = req.params.id;
        
        UserModel.findOne({ _id: id }, function (err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User.',
                    error: err
                });
            }
            if (!User) {
                return res.status(404).json({
                    message: 'No such User'
                });
            }
            return res.json(User);
        });
    },

    create(req, res) {
        const User = new UserModel(req.body);

        User.save(function (err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating User',
                    error: err
                });
            }
            return res.status(201).json(User);
        });
    },

    update(req, res) {
        const id = req.params.id;

        UserModel.findOne({ _id: id }, function (err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User',
                    error: err
                });
            }
            if (!User) {
                return res.status(404).json({
                    message: 'No such User'
                });
            }

            User.username = req.body.username ? req.body.username : User.username;
            User.password = req.body.password ? req.body.password : User.password;
            User.firstName = req.body.firstName ? req.body.firstName : User.firstName;
            User.lastName = req.body.lastName ? req.body.lastName : User.lastName;
            User.email = req.body.email ? req.body.email : User.email;
            User.admin = req.body.admin ? req.body.admin : User.admin;

            User.save(function (err, User) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating User.',
                        error: err
                    });
                }

                return res.json(User);
            });
        });
    },
    
    remove(req, res) {
        const id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the User.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },
    
    createAdminIfItDoesNotExist() {
        UserModel.findOne({ role: userRoles.systemAdmin }, function (err, User) {
            if (err) {
                console.log(err);
            }
            
            if (!User) {
                User = new UserModel({
                    username: 'admin',
                    password: 'admin',
                    firstName: 'Administrator',
                    email: 'admin@scrummy',
                    role: userRoles.systemAdmin
                });
                
                User.save(function (err, SavedUser) {
                    if (err) {
                        console.log('Error while creating admin', err);
                    } else {
                        console.log('Admin was successfuly created');
                    }
                });
            }
        }); 
    }
};
