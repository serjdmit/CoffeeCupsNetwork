const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./util/fbAuth");

const { db } = require("./util/admin");
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
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsRead
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
app.get("/user/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore
    .document("likes/{id}")
    .onCreate(snapshot => {
        db.doc(`/cups/${snapshot.data().cupId}`)
            .get()
            .then(doc => {
                if (doc.exists) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: "like",
                        read: false,
                        cupId: doc.id
                    });
                }
            })
            .then(() => {
                return;
            })
            .catch(err => {
                console.error(err);
                return;
            });
    });
exports.deleteNotificationOnUnLike = functions.firestore
    .document("likes/{id}")
    .onDelete(snapshot => {
        db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .then(() => {
                return;
            })
            .catch(err => {
                console.error(err);
                return;
            });
    });

exports.createNotificationOnComment = functions.firestore
    .document("comments/{id}")
    .onCreate(snapshot => {
        db.doc(`/cups/${snapshot.data().cupId}`)
            .get()
            .then(doc => {
                if (doc.exists) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: "comment",
                        read: false,
                        cupId: doc.id
                    });
                }
            })
            .then(() => {
                return;
            })
            .catch(err => {
                console.error(err);
                return;
            });
    });
