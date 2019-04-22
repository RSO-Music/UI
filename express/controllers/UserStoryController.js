var UserStoryModel = require('../models/UserStoryModel');

module.exports = {

    list: function (req, res) {
        return async function () {
        let query = {};
        if (req.headers.query)
            query = req.headers.query;

        try {
            let UserStories = await UserStoryModel.find(query).exec();
            return res.json(UserStories);
        }
        catch (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting UserStory.',
                    error: err
                });
            }
        }
        }();
    },

    show: function (req, res) {
        console.log(req.params);
        var id = req.params.id;
        UserStoryModel.findOne({_id: id}, function (err, UserStory) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting UserStory.',
                    error: err
                });
            }
            if (!UserStory) {
                return res.status(404).json({
                    message: 'No such UserStory.'
                });
            }
            return res.json(UserStory);
        });
    },

    create: function (req, res) {
        var UserStoryG = new UserStoryModel(req.body);
        let name = req.body.name;
        let pId = req.body.projectId;
        UserStoryModel.findOne({name: name, projectId: pId}, function (err, UserStory) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting UserStory.',
                    error: err
                });
            }
            if (UserStory) {
                return res.status(404).json({
                    message: 'This user story already exists'
                });
            } else {
                UserStoryG.save(function (err, UserStory) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating UserStory',
                            error: err
                        });
                    }
                    return res.status(201).json(UserStory);
                });
            }
        });



    },

    update: function (req, res) {
        console.log("REQ PARAMS: ", req.params);
        var id = req.params.id;
        UserStoryModel.findOneAndUpdate({_id: id}, {$set: req.body}, function (err, UserStory) {
            if (err) {
                console.log("ERR: ", err);
                return res.status(500).json({
                    message: 'Error when getting UserStory',
                    error: err
                });
            }
            if (!UserStory) {
                return res.status(404).json({
                    message: 'No such UserStory'
                });
            }

            UserStory.save(function (err, UserStory) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating UserStory.',
                        error: err
                    });
                }

                return res.json(UserStory);
            });
        });
    },

    remove: function (req, res) {
        var id = req.params.id;
        UserStoryModel.findByIdAndRemove(id, function (err, UserStory) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the UserStory.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
