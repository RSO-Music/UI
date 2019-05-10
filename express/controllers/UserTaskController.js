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

            //Calculations for the total time of all users on this activity and the total time of the current assignee
            //Required because of some edge cases
            try {
                let totalTimeUser = 0;
                let totalTime = 0;

                for (let j = 0; j < UserTask.activities.length; j++) {
                    let activity = UserTask.activities[j];

                    totalTime += activity.activeHours;

                    if (activity.user.toString() === UserTask.assignee.toString()) {
                        totalTimeUser += activity.activeHours;
                    }
                }

                UserTask.activeHoursAssignee = totalTimeUser;
                UserTask.activeHours = totalTime;

            } catch (e) {
                console.log("ERROR", e);
            }

            return res.json(UserTask);
        });
    },

    assign(req, res) {
        const taskId = req.query.taskId;
        const task = req.body;

        UserTaskModel.findOneAndUpdate({_id: taskId, assignee: {$eq: null}},
            {$set: {assignee: task.assignee, accepted: true}}, {new: true}, function (err, UserTask) {

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

                //Calculations for the total time of all users on this activity and the total time of the current
                // assignee
                //Required because of some edge cases
                try {
                    let totalTimeUser = 0;
                    let totalTime = 0;

                    for (let j = 0; j < UserTask.activities.length; j++) {
                        let activity = UserTask.activities[j];

                        totalTime += activity.activeHours;

                        if (activity.user.toString() === UserTask.assignee.toString()) {
                            totalTimeUser += activity.activeHours;
                        }
                    }

                    UserTask.activeHoursAssignee = totalTimeUser;
                    UserTask.activeHours = totalTime;

                } catch (e) {
                    console.log("ERROR", e);
                }

                return res.json(UserTask);
            });
    },

    unassign(req, res) {
        const taskId = req.query.taskId;

        UserTaskModel.findOneAndUpdate({_id: taskId, assignee: {$ne: null}},
            {$set: {assignee: null, accepted: false, active: false}}, {new: true}, function (err, UserTask) {

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

            //Time calculations
            if (UserTask.active) {
                let todaysDate = new Date();

                //Goes through all activities
                for (let i = 0; i < UserTask.activities.length; i++) {
                    let dbDate = new Date(UserTask.activities[i].date.getTime());

                    //Checks whether the activity is of today and if it is of the user that's currently assigned
                    if (dbDate.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0) && UserTask.activities[i].user.toString() === UserTask.assignee.toString()) {
                        let timeDifference = new Date() - UserTask.activities[i].date;
                        let timeDifferenceHours = Math.ceil((timeDifference / 1000) / 60 / 60);

                        UserTask.activities[i].activeHours += timeDifferenceHours;
                        UserTask.activities[i].date = null;
                        UserTask.activities[i].date = new Date();
                    }
                }
            }

            //Today's-activity-by-this-user-existence check
            if (UserTask.active) {
                //Task is active, user requested a change
                //Change status to inactive
                UserTask.active = false;
            } else {
                //Task is inactive, user requested a change
                //Change status to active
                UserTask.active = true;

                let todaysDate = new Date();
                let todaysActivityFound = false;

                for (let i = 0; i < UserTask.activities.length; i++) {
                    let dbDate = new Date(UserTask.activities[i].date.getTime());

                    if (dbDate.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0)) {
                        if (UserTask.activities[i].user.toString() === UserTask.assignee.toString()) {
                            todaysActivityFound = true;
                        }
                    }
                }

                if (!todaysActivityFound) {
                    UserTask.activities.push({"user": UserTask.assignee, "date": new Date()})
                }

            }

            //Calculations for the total time of all users on this activity and the total time of the current assignee
            let totalTimeUser = 0;
            let totalTime = 0;

            for (let j = 0; j < UserTask.activities.length; j++) {
                let activity = UserTask.activities[j];

                totalTime += activity.activeHours;

                if (activity.user.toString() === UserTask.assignee.toString()) {
                    totalTimeUser += activity.activeHours;
                }
            }
            UserTask.activeHoursAssignee = totalTimeUser;
            UserTask.activeHours = totalTime;

            UserTask.save(function (err, UserTask) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error while updating UserTask.',
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
