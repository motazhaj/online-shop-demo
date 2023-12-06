const path = require("path");

const express = require("express");
const csrf = require("csurf");
const session = require("express-session");

const createSessionConfig = require("./config/session");
const db = require("./data/database");

const addCsrfToken = require("./middlewares/csrf-token");
const errorHandle = require("./middlewares/error-handler");
const checkAuth = require("./middlewares/check-auth");

const shopRoutes = require("./routes/auth.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const sessionConfig = createSessionConfig();

app.use(session(sessionConfig));
app.use(csrf());

app.use(addCsrfToken);

app.use(checkAuth)

app.get("/", (req, res) => {
  res.render("customer/shop");
});

app.use(shopRoutes);

app.use(errorHandle);

db.connectToDatabase()
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log("Failed to connect to Database");
    console.log(error);
    res.status(500).render("shared/500");
  });
