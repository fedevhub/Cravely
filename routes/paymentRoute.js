const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Halaman Order
router.get("/", paymentController.getAllPayments);

// Update Status
router.post("/:id/status", paymentController.updatePaymentStatus);

// Hapus Order
router.delete("/:id", paymentController.deletePayment);


module.exports = router;
