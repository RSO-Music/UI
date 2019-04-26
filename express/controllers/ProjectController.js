const ProjectModel = require('../models/ProjectModel.js');

module.exports = {
    findAll(req, res) {
        return async function () {
            try {
                const Projects = await ProjectModel.find({}).populate({
                    path: "users.user",
                    model: "User"
                }).exec();

                return res.json(Projects);
            } catch (err) {
                return res.status(500).json({
                    message: 'An error occured while fetching project',
                    error: err
                });
            }
        }();
    },

    findForUser(req, res) {
        return async function () {
            const userId = req.params.userId;

            try {
                let Projects = await ProjectModel.find({ 'users.user': userId }).populate({
                    path: "users.user",
                    model: "User"
                }).exec();

                return res.json(Projects);
            } catch (err) {
                return res.status(500).json({
                    message: 'An error occured while fetching project',
                    error: err
                });
            }
        }();
    },

    findOne(req, res) {
        return async function () {
            const id = req.params.id;
            
            try {
                let Project = await ProjectModel.findOne({ _id: id }).populate({
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

    create(req, res) {
        const Project = new ProjectModel(req.body);
        
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

    update(req, res) {
        const id = req.params.id;
        
        ProjectModel.findOne({ _id: id }, function (err, Project) {
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

            ProjectModel.findOneAndUpdate({ _id: id }, req.body, {
                upsert: true,
                new: true,
                runValidators: true
            }, function (err, UpdatedProject) {
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

    delete(req, res) {
        const id = req.params.id;
        
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
