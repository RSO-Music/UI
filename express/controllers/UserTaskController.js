const UserTaskModel = require('../models/UserTaskModel');

module.exports = {
    findAll(req, res) {
        return async function () {
            try {
                let UserTasks = await UserTaskModel.find({}).exec();
                return res.json(UserTasks);
            }
            catch (err) {
                return res.status(500).json({
                    message: 'Error when getting UserTask.',
                    error: err
                });
            }
        }();
    },

    findAllForStory(req, res) {
        return async function () {
            let query = {};

            if (req.headers.query)
                query = req.headers.query;

            try {
                let UserTasks = await UserTaskModel.find({ storyId: req.params.storyId }).exec();
                return res.json(UserTasks);
            }
            catch (err) {
                return res.status(500).json({
                    message: 'Error when getting UserTask.',
                    error: err
                });
            }
        }();
    },

    findOne(req, res) {
        const id = req.params.id;

        UserTaskModel.findOne({ _id: id }, function (err, UserStory) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting UserTask.',
                    error: err
                });
            }

            if (!UserStory) {
                return res.status(404).json({
                    message: 'No such UserTask.'
                });
            }

            return res.json(UserStory);
        });
    },

    create(req, res) {
        const UserTaskG = new UserTaskModel(req.body);
        let description = req.body.description;
        let sId = req.body.storyId;

        UserTaskModel.findOne({ description: description, storyId: sId }, function (err, UserTask) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting UserTask.',
                    error: err
                });
            }

            if (UserTask) {
                return res.status(404).json({
                    message: 'This user task already exists'
                });
            } else {
                UserTaskG.save(function (err, UserTask) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating UserTask',
                            error: err
                        });
                    }

                    return res.status(201).json(UserTask);
                });
            }
        });


    },

    update(req, res) {
        const id = req.params.id;

        UserTaskModel.findOneAndUpdate({ _id: id }, { $set: req.body }, function (err, UserTask) {
            if (err) {
                console.log("ERR: ", err);
                return res.status(500).json({
                    message: 'Error when getting UserTask',
                    error: err
                });
            }

            if (!UserTask) {
                return res.status(404).json({
                    message: 'No such UserTask'
                });
            }

            UserTask.save(function (err, UserTask) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating UserTask.',
                        error: err
                    });
                }

                return res.json(UserTask);
            });
        });
    },


    assign(req, res) {
        const taskId = req.query.taskId;
        const task = req.body;
        UserTaskModel.findOneAndUpdate({ _id: taskId, accepted: false },
            { $set: task }, function (err, UserTask) {
                if (err) {
                    console.log("ERR: ", err);
                    return res.status(500).json({
                        message: 'Error when getting UserTask',
                        error: err
                    });
                }
                if (!UserTask) {
                    return res.status(404).json({
                        message: 'No such UserTask, Probably already taken'
                    });
                }
                UserTask.save(function (err, UserTask) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating UserTask.',
                            error: err
                        });
                    }
                    return res.json(UserTask);
                });
            });
    },


    remove(req, res) {
        const id = req.params.id;

        UserTaskModel.findByIdAndRemove(id, function (err, UserStory) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the UserTask.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
