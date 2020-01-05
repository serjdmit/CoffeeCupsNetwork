const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("../social_app_key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://socialapp-959ec.firebaseapp.com"
});

const express = require("express");
const app = express();

app.get("/cups", (req, res) => {
    admin
        .firestore()
        .collection("cups")
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

app.post("/cup", (req, res) => {
    const newCup = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };

    admin
        .firestore()
        .collection("cups")
        .add(newCup)
        .then(doc => {
            res.json({ message: `document ${doc.id} created successfully` });
        })
        .catch(err => {
            res.status(500).json({ error: "something went wrong" });
            console.error(err);
        });
});

exports.api = functions.https.onRequest(app);
