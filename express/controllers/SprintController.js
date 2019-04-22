var SprintModel = require('../models/SprintModel');

/**
 * SprintController.js
 *
 * @description :: Server-side logic for managing UserStories.
 */
module.exports = {

    /**
     * SprintController.list()
     */
    list: function (req, res) {
        SprintModel.find(function (err, Sprint) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Sprint.',
                    error: err
                });
            }
            return res.json(Sprint);
        });
    },

    /**
     * SprintController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        SprintModel.findOne({_id: id}, function (err, Sprint) {
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
    active: function (req, res) {
        let interval = 1000 * 60 * 60 * 24;
        let time = Math.round((Math.floor(new Date().getTime() / interval ) * interval) / 1000);
        SprintModel.findOne({startDate: {$lte: time}, endDate: {$gte: time}, projectId: req.params.projectId}, function (err, Sprint) {
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

    /**
     * UserController.create()
     */
    create: function (req, res) {
        var SprintG = new SprintModel({
            endDate: req.body.endDate,
            startDate: req.body.startDate,
            projectId: req.body.projectId,
            speed: req.body.speed,
            name: req.body.name,
        });

        var pId = req.body.projectId;
        var sDate = req.body.startDate;
        var eDate = req.body.endDate;

        SprintModel.findOne({projectId: pId,
            $or: [{endDate: {$gt: sDate, $lte: eDate}},
                {startDate: {$gte: sDate, $lt: eDate}}]}, function (err, Sprint) {
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
                SprintG.save(function (err, Sprint) {
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

    /**
     * SprintController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        SprintModel.findOne({_id: id}, function (err, Sprint) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Sprint',
                    error: err
                });
            }
            if (!Sprint) {
                return res.status(404).json({
                    message: 'No such Sprint'
                });
            }

            Sprint.endDate =
                req.body.endDate ? req.body.endDate : Sprint.endDate;
            Sprint.startDate =
                req.body.startDate ? req.body.startDate : Sprint.endDate;
            Sprint.projectId =
                req.body.projectId ? req.body.projectId : Sprint.projectId;
            Sprint.speed =
                req.body.speed ? req.body.speed : Sprint.speed;
            Sprint.name =
                req.body.name ? req.body.name : Sprint.name;

            Sprint.save(function (err, Sprint) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Sprint.',
                        error: err
                    });
                }

                return res.json(Sprint);
            });
        });
    },

    /**
     * UserController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
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
