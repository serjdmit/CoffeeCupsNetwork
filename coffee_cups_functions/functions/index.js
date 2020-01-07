const functions = require("firebase-functions");

const app = require("express")();

const { getAllCups, postOneCup } = require("./handlers/cups");
const { signup, login } = require("./handlers/users");

const FBAuth = require("./util/fbAuth");

//Cup routes
app.get("/cups", getAllCups);
app.post("/cup", FBAuth, postOneCup);

//Users routes
app.post("/signup", signup);
app.post("/login", login);

exports.api = functions.https.onRequest(app);
