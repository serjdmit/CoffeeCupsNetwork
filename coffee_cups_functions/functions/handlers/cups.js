const { db } = require("../util/admin");

exports.getAllCups = (req, res) => {
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
};

exports.postOneCup = (req, res) => {
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
};

exports.commentOnCup = (req, res) => {};

// Fetch one cup
exports.getCup = (req, res) => {
    let cupData = {};
    db.doc(`/cups/${req.params.cupId}`)
        .get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: "Cup not found" });
            }
            cupData = doc.data();
            cupData.cupId = doc.id;
            return db
                .collection("comments")
                .orderBy("createdAt", "desc")
                .where("cupId", "==", req.params.cupId)
                .get();
        })
        .then(data => {
            cupData.comments = [];
            data.forEach(doc => {
                cupData.comments.push(doc.data());
            });
            return res.json(cupData);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: err.code });
        });
};

// Comment on a cup
exports.commentOnCup = (req, res) => {
    if (req.body.body.trim() === "")
        return res.status(400).json({ error: "Must not be empty" });

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        cupId: req.params.cupId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };

    db.doc(`/cups/${req.params.cupId}`)
        .get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: "Cup not found" });
            }
            return db.collection("comments").add(newComment);
        })
        .then(() => {
            res.json(newComment);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Something went wrong" });
        });
};
