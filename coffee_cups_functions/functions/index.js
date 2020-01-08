const functions = require("firebase-functions");

const app = require("express")();

const { getAllCups, postOneCup } = require("./handlers/cups");
const { signup, login, uploadImage } = require("./handlers/users");

const FBAuth = require("./util/fbAuth");

//Cup routes
app.get("/cups", getAllCups);
app.post("/cup", FBAuth, postOneCup);

//Users routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);

exports.api = functions.https.onRequest(app);
