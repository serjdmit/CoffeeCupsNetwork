const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();

var serviceAccount = require("../social_app_key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://socialapp-959ec.firebaseapp.com"
});

const firebaseConfig = {
    apiKey: "AIzaSyDQdOBL7ltN1ZSs469c9rqhs42pufMW3SY",
    authDomain: "socialapp-959ec.firebaseapp.com",
    databaseURL: "https://socialapp-959ec.firebaseio.com",
    projectId: "socialapp-959ec",
    storageBucket: "socialapp-959ec.appspot.com",
    messagingSenderId: "317894950810",
    appId: "1:317894950810:web:79796f2bacdf7a8924c423",
    measurementId: "G-GTB0W5X93B"
};

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

app.get("/cups", (req, res) => {
    db.collection("cups")
        .orderBy("createdAt", "desc")
        .get()
        .then(data => {
            let cups = [];
            data.forEach(doc => {
                cups.push({
                    cupId: doc.id,
                    ...doc.data()
                });
            });
            return res.json(cups);
        })
        .catch(err => {
            console.error(err);
        });
});

const db = admin.firestore();

app.post("/cup", (req, res) => {
    const newCup = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };

    db.collection("cups")
        .add(newCup)
        .then(doc => {
            res.json({ message: `document ${doc.id} created successfully` });
        })
        .catch(err => {
            res.status(500).json({ error: "something went wrong" });
            console.error(err);
        });
});

// Signup Route
let token;
let userId;
app.post("/signup", (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    db.doc(`/users/${newUser.handle}`)
        .get()
        .then(doc => {
            if (doc.exists) {
                return status(400).json({
                    handle: "this handle is already taken"
                });
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(
                        newUser.email,
                        newUser.password
                    );
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(idToken => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ token });
        })
        .catch(err => {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
                return res
                    .status(400)
                    .json({ email: "Email is already in use" });
            } else {
                return res.status(500).json({ error: err.code });
            }
        });
});

exports.api = functions.https.onRequest(app);
