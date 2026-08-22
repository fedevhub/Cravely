const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Halaman Order
router.get("/", orderController.getAllOrders);

// Update Status
router.post("/:id/status", orderController.updateOrderStatus);

// Hapus Order
router.delete("/:id", orderController.deleteOrder);

// Dummy Order
router.get("/dummy", orderController.createDummyOrder);

module.exports = router;
