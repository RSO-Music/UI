const UserStoryModel = require('../models/UserStoryModel');

module.exports = {
    findAll(req, res) {
        return async function () {
            try {
                const UserStories = await UserStoryModel.find({}).exec();

                return res.json(UserStories);
            } catch (err) {
                return res.status(500).json({
                    message: 'Error when getting UserStory.',
                    error: err
                });
            }
        }();
    },

    findFinishedStories(req, res) {
        const projectId = req.params.projectId;
        const sprintId = req.params.sprintId;

        return async function () {
            try {
                const UserStories = await UserStoryModel.find({
                    projectId,
                    sprintId,
                    done: true
                }).exec();

                return res.json(UserStories);
            } catch (err) {
                return res.status(500).json({
                    message: 'Error when getting UserStory.',
                    error: err
                });
            }
        }();
    },

    findStoriesInSprint(req, res) {
        const sprintId = req.params.id;
        const projectId = req.params.projectId;

        return async function () {
            try {
                const UserStories = await UserStoryModel.find({
                    projectId,
                    sprintId
                }).exec();

                return res.json(UserStories);
            } catch (err) {
                return res.status(500).json({
                    message: 'Error when getting UserStory.',
                    error: err
                });
            }
        }();
    },

    findStoriesInBacklog(req, res) {
        const projectId = req.params.projectId;

        return async function () {
            try {
                const UserStories = await UserStoryModel.find({
                    projectId,
                    sprintId: null,
                    done: false
                }).exec();

                return res.json(UserStories);
            } catch (err) {
                return res.status(500).json({
                    message: 'Error when getting UserStory.',
                    error: err
                });
            }
        }();
    },

    findOne(req, res) {
        const id = req.params.id;

        UserStoryModel.findOne({ _id: id }, function (err, UserStory) {
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

    create(req, res) {
        const UserStoryG = new UserStoryModel(req.body);
        let name = req.body.name;
        let pId = req.body.projectId;

        UserStoryModel.findOne({ name: name, projectId: pId }, function (err, UserStory) {
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

    update(req, res) {
        const id = req.params.id;
        
        const updateObject = req.body;
        
        UserStoryModel.findOneAndUpdate({ _id: id }, { $set: updateObject }, function (err, UserStory) {
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

            return res.json(UserStory);
        });
    },
    
    async addStoriesToSprint(req, res) {
        const sprintId = req.params.sprintId;
        
        const stories = req.body.stories;
        
        for (const storyId of stories) {
            await UserStoryModel.findOneAndUpdate({ _id: storyId }, { $set: { sprintId, rejected: false, rejectionReason: null } });
        }

        return res.json({ success: true });
    },

    delete(req, res) {
        const id = req.params.id;

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
