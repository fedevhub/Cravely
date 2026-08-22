const Payment = require("../models/PaymentModel");
const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const Order = require("../models/OrderModel");

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "fullname email")
      .populate("order")
      .sort({ createdAt: -1 });

    res.render("admin/payments", {
      title: "Payment Management",
      payments,
    });
  } catch (error) {
    console.error("Error retrieving payments:", error);

    res.status(500).json({
      message: "Error retrieving payments",
      error: error.message,
    });
  }
};

exports.getPaymentDetail = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("user")
      .populate("order");

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.render("admin/paymentDetail", {
      title: "Payment Detail",
      payment,
    });
  } catch (error) {
    console.error("Error retrieving payment detail:", error);

    res.status(500).json({
      message: "Error retrieving payment detail",
      error: error.message,
    });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    req.session.flash = {
      type: "success",
      title: "Payment Updated",
      message: "Payment status has been updated successfully.",
      icon: "fa-money-bill-transfer",
    };

    res.redirect("/dashboard/payments");
  } catch (error) {
    console.error("Error updating payment status:", error);

    res.status(500).json({
      message: "Error updating payment status",
      error: error.message,
    });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    req.session.flash = {
      type: "success",
      title: "Payment Deleted",
      message: "Payment has been deleted successfully.",
      icon: "fa-trash",
    };

    res.redirect("/dashboard/payments");
  } catch (error) {
    console.error("Error deleting payment:", error);

    res.status(500).json({
      message: "Error deleting payment",
      error: error.message,
    });
  }
};
