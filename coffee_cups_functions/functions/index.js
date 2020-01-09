const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./util/fbAuth");

const {
    getAllCups,
    postOneCup,
    getCup,
    commentOnCup,
    likeCup,
    unlikeCup,
    deleteCup
} = require("./handlers/cups");
const {
    signup,
    login,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser
} = require("./handlers/users");

//Cup routes
app.get("/cups", getAllCups);
app.post("/cup", FBAuth, postOneCup);
app.get("/cup/:cupId", getCup);
app.delete("/cup/:cupId", FBAuth, deleteCup);
app.post("/cup/:cupId/like", FBAuth, likeCup);
app.post("/cup/:cupId/unlike", FBAuth, unlikeCup);
app.post("/cup/:cupId/comment", FBAuth, commentOnCup);

//Users routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
