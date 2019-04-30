const SprintModel = require('../models/SprintModel');

module.exports = {
    findAll(req, res) {
        SprintModel.find({}, function (err, Sprints) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Sprint.',
                    error: err
                });
            }

            return res.json(Sprints);
        });
    },

    findOne(req, res) {
        const id = req.params.id;

        SprintModel.findOne({ _id: id }, function (err, Sprint) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Sprint.',
                    error: err
                });
            }

            if (!Sprint) {
                return res.status(404).json({
                    message: 'No such Sprint.'
                });
            }

            return res.json(Sprint);
        });
    },

    findAllForProject(req, res) {
        SprintModel.find({
            projectId: req.params.projectId
        }, function (err, Sprints) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Sprint.',
                    error: err
                });
            }

            if (!Sprints) {
                return res.status(404).json({
                    message: 'No such Sprint.'
                });
            }
            
            return res.json(Sprints);
        });
    },

    findActiveForProject(req, res) {
        const time = new Date();

        SprintModel.findOne({
            startDate: { $lte: time },
            endDate: { $gte: time },
            projectId: req.params.projectId
        }, function (err, Sprint) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Sprint.',
                    error: err
                });
            }

            if (!Sprint) {
                return res.status(404).json({
                    message: 'No such Sprint.'
                });
            }
            
            return res.json(Sprint);
        });
    },

    findUnfinishedForProject(req, res) {
        const time = new Date();

        SprintModel.find({
            startDate: { $lte: time },
            endDate: { $lte: time },
            projectId: req.params.projectId,
            finished: { $ne: true }
        }, function (err, Sprints) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting unfinished Sprints.',
                    error: err
                });
            }

            if (!Sprints) {
                return res.status(404).json({
                    message: 'No Sprints found'
                });
            }
            
            return res.json(Sprints);
        });
    },

    create(req, res) {
        console.log(req.body);
        
        const SprintToInsert = new SprintModel({
            endDate: req.body.endDate,
            startDate: req.body.startDate,
            projectId: req.body.projectId,
            speed: req.body.speed,
            name: req.body.name
        });
        
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);
        
        if (startDate.getTime() > endDate.getTime()) {
            return res.status(500).json({
                message: 'Začetni datum Sprinta ne sme biti za končnim datumom'
            });
        }

        const pId = req.body.projectId;
        const sDate = req.body.startDate;
        const eDate = req.body.endDate;

        SprintModel.findOne({
            projectId: pId,
            $or: [{ endDate: { $gt: sDate, $lte: eDate } },
                { startDate: { $gte: sDate, $lt: eDate } }]
        }, function (err, Sprint) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Sprint.',
                    error: err
                });
            }
            
            if (Sprint) {
                return res.status(400).json({
                    message: 'This sprint overlap!'
                });
            } else {
                SprintToInsert.save(function (err, Sprint) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating Sprint',
                            error: err
                        });
                    }
                    
                    return res.status(201).json(Sprint);
                });
            }
        });
    },

    update(req, res) {
        const id = req.params.id;
        
        const updateObject = req.body;
        
        SprintModel.findOneAndUpdate({ _id: id }, updateObject, function (err, Sprint) {
            if (err) {
                console.log("ERR: ", err);
                return res.status(500).json({
                    message: 'Error while updating Sprint',
                    error: err
                });
            }

            if (!Sprint) {
                return res.status(404).json({
                    message: 'No such Sprint'
                });
            }

            return res.json(Sprint);
        });
    },

    delete(req, res) {
        const id = req.params.id;
        
        SprintModel.findByIdAndRemove(id, function (err, Sprint) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Sprint.',
                    error: err
                });
            }
            
            return res.status(204).json();
        });
    }
};
