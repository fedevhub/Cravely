const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/home", customerController.getHome);
router.get("/products", customerController.getProducts);
router.get("/detailProducts/:id", customerController.getProductDetail);
router.get("/cart", customerController.getCartPage);
router.post("/cart/add/:id", customerController.addToCart);
router.post("/cart/item/:itemId", customerController.updateCart);
router.post("/cart/item/:itemId/delete", customerController.removeFromCart);
router.get("/wishlist", customerController.getWishlist);
router.post("/wishlist/toggle/:id", customerController.toggleWishlist);
router.get("/checkout", customerController.getCheckout);
router.post("/checkout", customerController.placeOrder);
router.get("/orders", customerController.getHistory);
router.get("/orders/:id/tracking", customerController.getTracking);

module.exports = router;
