const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require("./routes/UserRoutes");
const userStoryRoutes = require("./routes/UserStoryRoutes");
const ProjectRoutes = require("./routes/ProjectRoutes");
const sprintRoutes = require("./routes/SprintRoutes");
let user = process.env.DB_USER || "borrowland";
let password = process.env.DB_PASSWORD || "password";
let db_uri = process.env.DB_URI || "localhost:27017";

// mongoose.connect(`mongodb://${user}:${password}@${db_uri}/tenants?authSource=admin`, {
//     useNewUrlParser: true
// });
// mongodb://admin:admin123@ds119090.mlab.com:19090/smrpo
/*mongoose.connect(` mongodb://admin:admin123@ds123146.mlab.com:23146/smrpo`, {
    useNewUrlParser: true
});*/

mongoose.connect('mongodb+srv://smrpo_2_db:UtJqMRXyRMfH2hu3@b-cluster-forts.mongodb.net/test?retryWrites=true')

const port = process.env.PORT || 8080;
let app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, query");
    res.header("query", "*");
    next();
});

//end of uros test

app.use("/user/", userRoutes);
app.use('/story/', userStoryRoutes);
app.use("/project/", ProjectRoutes);
app.use("/sprint/", sprintRoutes);


app.listen(port, function () {
    console.log(`Running server on port ${port}.`);
});