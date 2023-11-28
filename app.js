const path = require("path");

const express = require("express");

const db = require("./data/database");
const shopRoutes = require("./shop/routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

app.use(shopRoutes);

db.connectToDatabase().then(() => {
  app.listen(3000);
});
