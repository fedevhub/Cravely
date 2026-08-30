const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/home", customerController.getHome);

router.get("/product/:id", customerController.getProductDetail);

module.exports = router;
