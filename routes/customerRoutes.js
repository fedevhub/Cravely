const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/home", customerController.getHome);
router.get("/products", customerController.getProducts);
router.get("/detailProducts/:id", customerController.getProductDetail);


module.exports = router;
