const UserTaskModel = require('../models/UserTaskModel');

module.exports = {
    findAll(req, res) {
        return async function () {
            try {
                let UserTasks = await UserTaskModel.find({}).exec();
                return res.json(UserTasks);
            } catch (err) {
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
                let UserTasks = await UserTaskModel.find({storyId: req.params.storyId}).exec();
                return res.json(UserTasks);
            } catch (err) {
                return res.status(500).json({
                    message: 'Error when getting UserTask.',
                    error: err
                });
            }
        }();
    },

    findOne(req, res) {
        const id = req.params.id;

        UserTaskModel.findOne({_id: id}, function (err, UserStory) {
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

        UserTaskModel.findOne({description: description, storyId: sId}, function (err, UserTask) {
            if (UserTask) {
                return res.status(404).json({
                    message: 'Naloga s tem imenom že obstaja za to zgodbo'
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

        UserTaskModel.findOneAndUpdate({_id: id}, {$set: req.body}, {new: true}, function (err, UserTask) {
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

            return res.json(UserTask);
        });
    },

    assign(req, res) {
        const taskId = req.query.taskId;
        const task = req.body;

        UserTaskModel.findOneAndUpdate({_id: taskId, assignee: {$eq: null}},
            {$set: {assignee: task.assignee, accepted: true}}, {new: true}, function (err, UserTask) {
                console.log(taskId, UserTask);

                if (err) {
                    console.log("ERR: ", err);
                    return res.status(500).json({
                        message: 'Error when getting UserTask',
                        error: err
                    });
                }
                if (!UserTask) {
                    return res.status(403).json({
                        message: 'No such UserTask, Probably already taken'
                    });
                }

                return res.json(UserTask);
            });
    },

    unassign(req, res) {
        const taskId = req.query.taskId;

        UserTaskModel.findOneAndUpdate({_id: taskId, assignee: {$ne: null}},
            {$set: {assignee: null, accepted: false}}, {new: true}, function (err, UserTask) {
                console.log(taskId, UserTask);

                if (err) {
                    console.log("ERR: ", err);
                    return res.status(500).json({
                        message: 'Error when getting UserTask',
                        error: err
                    });
                }
                if (!UserTask) {
                    return res.status(500).json({
                        message: 'No such UserTask, Probably already unassigned'
                    });
                }

                return res.json(UserTask);
            });
    },

    changeActiveStatus(req, res) {
        const taskId = req.params.taskId;

        console.log(req.body);

        UserTaskModel.findOne({_id: taskId}, function (err, UserTask) {
            if (err) {
                return res.status(500).json({
                    message: 'An error occured while fetching task.',
                    error: err
                });
            }

            if (!UserTask) {
                return res.status(404).json({
                    message: 'No such UserTask.'
                });
            }

            if (UserTask.active) {
                UserTask.activeHours += 1;

                let todaysDate = new Date();
                console.log("todaysDate", todaysDate);

                for (let i = 0; i < UserTask.activities.length; i++) {
                    let dbDate = new Date(UserTask.activities[i].date.getTime());
                    console.log("183 dbDate, UserTask.activities[i].date;", dbDate, UserTask.activities[i].date);

                    if (dbDate.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0)) {
                        console.log("i, todaysActivityFound = true;", i);
                        console.log("187 dbDate", dbDate);


                        let timeDifference = new Date() - UserTask.activities[i].date;
                        let timeDifferenceHours = Math.ceil((timeDifference / 1000) / 60 / 60);

                        /*
                        timeToAdd.setHours(timeToAdd.getHours() + Math.round(timeToAdd.getMinutes()/60));
                        timeToAdd.setMinutes(0);
                         */
                        console.log("UserTask.activities[i].date, new Date()", UserTask.activities[i].date, new Date());
                        console.log("timeDifferenceHours", timeDifferenceHours);

                        UserTask.activities[i].activeHours += timeDifferenceHours;

                        console.log("UserTask.activities[i].date___START", UserTask.activities[i].date);
                        UserTask.activities[i].date = null;
                        UserTask.activities[i].date = new Date();
                        console.log("UserTask.activities[i].date___END", UserTask.activities[i].date);
                    }
                }
            }

            if (UserTask.active) {
                //Task is active, user requested a change
                //Change status to inactive
                UserTask.active = false;
            } else {
                //Task is inactive, user requested a change
                //Change status to active
                UserTask.active = true;

                let todaysDate = new Date();
                console.log("todaysDate", todaysDate);
                let todaysActivityFound = false;

                for (let i = 0; i < UserTask.activities.length; i++) {
                    let dbDate = UserTask.activities[i].date;
                    console.log("UserTask.activities[i].date", UserTask.activities[i].date);

                    if (dbDate.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0)) {
                        todaysActivityFound = true;
                        console.log("i, todaysActivityFound = true;", i);
                    }
                }

                if (!todaysActivityFound) {
                    UserTask.activities.push({"user": UserTask.assignee, "date": new Date(), "activeHours": 0})
                }

            }


            UserTask.save(function (err, UserTask) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error while updating UserTask.',
                        error: err
                    });
                }

                //console.log(UserTask);

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
