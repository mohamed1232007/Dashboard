const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const { verifyTokenPage, authorizeRoles } = require("../middleware/auth");

const requireAdmin = [
    verifyTokenPage,
    authorizeRoles('admin'),
    (req, res, next) => {
        res.locals.currentUser = req.user;
        next();
    },
];

router.get("/customers", requireAdmin, customerController.list);
router.get("/search", requireAdmin, customerController.search);
router.post("/search", requireAdmin, customerController.search);

router.get("/user/add.html", requireAdmin, customerController.addForm);
router.post("/user/add.html", requireAdmin, customerController.addSubmit);

router.get("/edit/:id", requireAdmin, customerController.editForm);
router.put("/edit/:id", requireAdmin, customerController.update);
router.delete("/edit/:id", requireAdmin, customerController.remove);

router.get("/view/:id", requireAdmin, customerController.view);

module.exports = router;
