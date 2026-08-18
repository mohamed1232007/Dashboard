const User = require("../models/customerSchema");
const moment = require("moment");

exports.list = (req, res) => {
    User.find()
        .then((result) => {
            res.render("index", { arr: result, moment: moment });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to load customers.");
        });
};

exports.addForm = (req, res) => {
    res.render("user/add");
};

exports.addSubmit = (req, res) => {
    User.create(req.body)
        .then(() => {
            res.redirect("/customers");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to add customer.");
        });
};

exports.editForm = (req, res) => {
    User.findById(req.params.id)
        .then((result) => {
            res.render("user/edit", { obj: result, moment: moment });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to load customer.");
        });
};

exports.update = (req, res) => {
    User.updateOne({ _id: req.params.id }, req.body)
        .then(() => {
            res.redirect("/customers");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to update customer.");
        });
};

exports.view = (req, res) => {
    User.findById(req.params.id)
        .then((result) => {
            res.render("user/view", { obj: result, moment: moment });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to load customer.");
        });
};

exports.remove = (req, res) => {
    User.deleteOne({ _id: req.params.id })
        .then(() => {
            res.redirect("/customers");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to delete customer.");
        });
};

exports.search = (req, res) => {
    const searchText = (
        (req.method === "POST" ? req.body.searchText : req.query.searchText) || ""
    ).trim();

    const conditions = [
        { fireName: { $regex: searchText, $options: "i" } },
        { firstName: { $regex: searchText, $options: "i" } },
        { lastName: { $regex: searchText, $options: "i" } },
        { email: { $regex: searchText, $options: "i" } },
        { country: { $regex: searchText, $options: "i" } },
        { gender: { $regex: searchText, $options: "i" } },
    ];

    User.find({ $or: conditions })
        .then((result) => {
            res.render("user/search", { arr: result, moment: moment });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to search customers.");
        });
};
