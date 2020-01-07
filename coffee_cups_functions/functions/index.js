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

const db = admin.firestore();

//Get all cups
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

const FBAuth = (req, res, next) => {
    let idToken;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        idToken = req.headers.authorization.split("Bearer ")[1];
    } else {
        console.error("No token found");
        return res.status(403).json({ error: "Unauthorized" });
    }

    admin
        .auth()
        .verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            console.log(decodedToken);
            return db
                .collection("users")
                .where("userId", "==", req.user.uid)
                .limit(1)
                .get();
        })
        .then(data => {
            req.user.handle = data.docs[0].data().handle;
            return next();
        })
        .catch(err => {
            console.error("Error while verifying token ", err);
            return res.status(403).json(err);
        });
};

// Post one cup
app.post("/cup", FBAuth, (req, res) => {
    if (req.body.body.trim() === "") {
        return res.status(400).json({ body: "Body must not be empty" });
    }

    const newCup = {
        body: req.body.body,
        userHandle: req.user.handle,
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

const isEmail = email => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
};

const isEmpty = string => {
    if (string.trim() === "") return true;
    else return false;
};

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

    let errors = {};

    if (isEmpty(newUser.email)) {
        errors.email = "Email must not be empty";
    } else if (!isEmail(newUser.email)) {
        errors.email = "Must be valid email address";
    }

    if (isEmpty(newUser.password)) errors.password = "Must not be empty";
    if (newUser.password !== newUser.confirmPassword)
        errors.confirmPassword = "Passwords must much";
    if (isEmpty(newUser.handle)) errors.handle = "Must not be empty";

    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    db.doc(`/users/${newUser.handle}`)
        .get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({
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

// Login
app.post("/login", (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    let errors = {};

    if (isEmpty(user.email)) errors.email = "Must not be empty";
    if (isEmpty(user.password)) errors.password = "Must not be empty";

    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({ token });
        })
        .catch(err => {
            console.error(err);
            if (err.code === "auth/wrong-password") {
                return res
                    .status(403)
                    .json({ general: "Wrong credentials, please try again" });
            } else return res.status(500).json({ error: err.code });
        });
});

exports.api = functions.https.onRequest(app);
