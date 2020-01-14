const admin = require("firebase-admin");

// ----------------DEPLOY---------------------

admin.initializeApp();

// ---------------- SERVE-START --------------------

// var serviceAccount = require("../../social_app_key.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://socialapp-959ec.firebaseapp.com",
//     storageBucket: "socialapp-959ec.appspot.com"
// });

// ---------------- SERVE-END --------------------

const db = admin.firestore();

module.exports = { admin, db };
