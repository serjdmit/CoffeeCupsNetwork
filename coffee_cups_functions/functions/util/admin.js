const admin = require("firebase-admin");

// ----------------DEPLOY---------------------

// admin.initializeApp();

// ---------------- SERVE --------------------

var serviceAccount = require("../../social_app_key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://socialapp-959ec.firebaseapp.com",
    storageBucket: "socialapp-959ec.appspot.com",
    apiKey: "AIzaSyDQdOBL7ltN1ZSs469c9rqhs42pufMW3SY",
    authDomain: "socialapp-959ec.firebaseapp.com",
    databaseURL: "https://socialapp-959ec.firebaseio.com",
    projectId: "socialapp-959ec",
    messagingSenderId: "317894950810",
    appId: "1:317894950810:web:79796f2bacdf7a8924c423",
    measurementId: "G-GTB0W5X93B"
});

const db = admin.firestore();

module.exports = { admin, db };
