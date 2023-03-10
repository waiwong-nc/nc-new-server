const Express = require("express");
const app = Express();
const topicsRoute = require("./router/topics");
const articlesRoute = require("./router/articles");
const usersRoute = require("./router/users");
const commentsRoute = require("./router/comments");
const apiControllers = require("./controllers/api");
const errorHandlers = require("./controllers/errors");
const cors = require("cors");
app.use(cors());
app.use(Express.json());


app.get("/api", apiControllers.getDescription);
app.use("/api/topics", topicsRoute);
app.use("/api/articles", articlesRoute);
app.use("/api/users", usersRoute);
app.use("/api/comments", commentsRoute);


app.all("*", errorHandlers.handle404Paths);
app.use(errorHandlers.handleCustomErrors);
app.use(errorHandlers.handle500Errors);

module.exports = app;
