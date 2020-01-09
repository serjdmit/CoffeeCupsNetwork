const { db } = require("../util/admin");

// Fetch all cups
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

// Add one cup
exports.postOneCup = (req, res) => {
    if (req.body.body.trim() === "") {
        return res.status(400).json({ body: "Body must not be empty" });
    }

    const newCup = {
        body: req.body.body,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };

    db.collection("cups")
        .add(newCup)
        .then(doc => {
            const resCup = newCup;
            resCup.cupId = doc.id;
            res.json(resCup);
        })
        .catch(err => {
            res.status(500).json({ error: "something went wrong" });
            console.error(err);
        });
};

// Commenting cups
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

// Delete cup
exports.deleteCup = (req, res) => {
    const document = db.doc(`/cups/${req.params.cupId}`);
    document
        .get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: "Scream not found" });
            }
            if (doc.data().userHandle !== req.user.handle) {
                return res.status(403).json({ error: "Unauthorized" });
            } else {
                return document.delete();
            }
        })
        .then(() => {
            res.json({ message: "Scream deleted successfully" });
        })
        .catch(err => {
            console.error(err);
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
            return doc.ref.update({
                commentCount: doc.data().commentCount + 1
            });
        })
        .then(() => {
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

// Like a cup
exports.likeCup = (req, res) => {
    const likeDocument = db
        .collection("likes")
        .where("userHandle", "==", req.user.handle)
        .where("cupId", "==", req.params.cupId)
        .limit(1);

    const cupDocument = db.doc(`/cups/${req.params.cupId}`);

    let cupData;

    cupDocument
        .get()
        .then(doc => {
            if (doc.exists) {
                cupData = doc.data();
                cupData.cupId = doc.id;
                return likeDocument.get();
            } else {
                return res.status(404).json({ error: "Cup not fount" });
            }
        })
        .then(data => {
            if (data.empty) {
                return db
                    .collection("likes")
                    .add({
                        cupId: req.params.cupId,
                        userHandle: req.user.handle
                    })
                    .then(() => {
                        cupData.likeCount++;
                        return cupDocument.update({
                            likeCount: cupData.likeCount
                        });
                    })
                    .then(() => {
                        return res.json(cupData);
                    });
            } else {
                return res.status(400).json({ error: "Cup already liked" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err.code });
        });
};

// Unlike a cup
exports.unlikeCup = (req, res) => {
    const likeDocument = db
        .collection("likes")
        .where("userHandle", "==", req.user.handle)
        .where("cupId", "==", req.params.cupId)
        .limit(1);

    const cupDocument = db.doc(`/cups/${req.params.cupId}`);

    let cupData;

    cupDocument
        .get()
        .then(doc => {
            if (doc.exists) {
                cupData = doc.data();
                cupData.cupId = doc.id;
                return likeDocument.get();
            } else {
                return res.status(404).json({ error: "Cup not fount" });
            }
        })
        .then(data => {
            if (data.empty) {
                return res.status(400).json({ error: "Cup not liked" });
            } else {
                return db
                    .doc(`/likes/${data.docs[0].id}`)
                    .delete()
                    .then(() => {
                        cupData.likeCount--;
                        return cupDocument.update({
                            likeCount: cupData.likeCount
                        });
                    })
                    .then(() => {
                        res.json(cupData);
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err.code });
        });
};
