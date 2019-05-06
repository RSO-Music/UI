const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require("./routes/UserRoutes");
const userStoryRoutes = require("./routes/UserStoryRoutes");
const ProjectRoutes = require("./routes/ProjectRoutes");
const sprintRoutes = require("./routes/SprintRoutes");
const userTaskRoutes = require("./routes/UserTaskRoutes");

mongoose.connect(`mongodb+srv://admin:admin@smrpo-1diaf.mongodb.net/test?retryWrites=true`, {
    useNewUrlParser: true
});

const port = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, query");
    res.header("query", "*");

    next();
});

app.use("/user/", userRoutes);
app.use('/story/', userStoryRoutes);
app.use("/project/", ProjectRoutes);
app.use("/sprint/", sprintRoutes);
app.use("/task/", userTaskRoutes);

// Creates the admin if it does not exist
require('./lib/createAdmin')();

app.listen(port, function () {
    console.log(`Running server on port ${port}.`);
});