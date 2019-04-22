var ProjectModel = require('../models/ProjectModel.js');

module.exports = {

    list: function (req, res) {
        return async function () {
            let query = {};
            if (req.params) {
                query = {
                    'users.user': req.params._id
                }
            }
            try {
            let Projects = await ProjectModel.find(query['users.user'] === undefined ? {} : query ).populate({
                path: "users.user",
                model: "User"
            }).exec();

            return res.json(Projects);
            }
            catch (err) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting Project.',
                        error: err
                    });
                }
            }
        }();
    },

    show: function (req, res) {
        return async function () {
            var id = req.params.id;
            try {
                let Project = await ProjectModel.findOne({_id: id}).populate({
                    path: "users.user",
                    model: "User"
                }).exec();

                if (!Project) {
                    return res.status(404).json({
                        message: 'No such Project'
                    });
                }
                return res.json(Project);

            } catch (err) {
                return res.status(500).json({
                    message: 'Error when getting Project.',
                    error: err
                });
            }
        }();
    },

    create: function (req, res) {
        var Project = new ProjectModel(req.body);
        Project.save(function (err, Project) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Project',
                    error: err
                });
            }
            return res.status(201).json(Project);
        });
    },

    update: function (req, res) {
        var id = req.params.id;
        ProjectModel.findOne({_id: id}, function (err, Project) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Project',
                    error: err
                });
            }
            if (!Project) {
                return res.status(404).json({
                    message: 'No such Project'
                });
            }

            ProjectModel.findOneAndUpdate({_id: id}, req.body, {upsert: true, new: true, runValidators: true},  function (err, UpdatedProject) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Project.',
                        error: err
                    });
                }

                return res.json(UpdatedProject);
            });
        });
    },

    remove: function (req, res) {
        var id = req.params.id;
        ProjectModel.findByIdAndRemove(id, function (err, Project) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Project.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
