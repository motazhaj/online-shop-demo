const path = require("path");

const express = require("express");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session");

const db = require("./data/database");
const shopRoutes = require("./routes/auth.routes");

const MongoDBStore = mongodbStore(session);

const app = express();

const sessionStore = new MongoDBStore({
  uri: "mongodb://127.0.0.1.:27017",
  databaseName: "online-shop",
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "test",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

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

db.connectToDatabase().then(() => {
  app.listen(3000);
});
