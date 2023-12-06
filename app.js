const path = require("path");

const express = require("express");
const csrf = require("csurf");
const session = require("express-session");

const createSessionConfig = require("./config/session");
const db = require("./data/database");
const addCsrfToken = require("./middlewares/csrf-token");
const shopRoutes = require("./routes/auth.routes");
const errorHandle = require("./middlewares/error-handler");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const sessionConfig = createSessionConfig()

app.use(session(sessionConfig));
app.use(csrf());

app.use(addCsrfToken);

app.use(async (req, res, next) => {
  const user = req.session.user;
  const isAuthenticated = req.session.isAuthenticated;
  console.log(isAuthenticated);
  console.log(user);

  if (!user || !isAuthenticated) {
    return next();
  }

  const userData = await db.getDb().collection("users").findOne({
    _id: user.id,
  });
  const isAdmin = userData.isAdmin;

  res.locals.isAuthenticated = isAuthenticated;
  res.locals.isAdmin = isAdmin;
  next();
});

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
