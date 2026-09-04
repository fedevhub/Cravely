const Product = require("../models/ProductModel");
const PreOrderSetting = require("../models/PreOrderSettingModel");
const Review = require("../models/ReviewModel");

const getPreOrderStatus = async () => {
  const setting = await PreOrderSetting.findOne({ key: "current" }).lean();
  return setting?.isOpen ?? true;
};

const customerController = {
  getHome: async (req, res) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      const isPreOrderOpen = await getPreOrderStatus();

      res.render("customer/home", {
        pageTitle: "Home",
        currentPage: "home",
        products,
        isPreOrderOpen,
      });
    } catch (error) {
      console.error("Error getHome:", error);
      res.status(500).send("Gagal memuat halaman home");
    }
  },

  getProducts: async (req, res) => {
    try {
      const { category } = req.query;
      const filter = {};

      if (["sweet", "savory"].includes(category)) {
        filter.category = category;
      }

      const products = await Product.find(filter).sort({ createdAt: -1 });
      const isPreOrderOpen = await getPreOrderStatus();

      res.render("customer/product", {
        pageTitle: "Menu",
        currentPage: category || "products",
        selectedCategory: category || "all",
        products,
        isPreOrderOpen,
      });
    } catch (error) {
      console.error("Error getProducts:", error);
      res.status(500).send("Gagal memuat daftar produk");
    }
  },

  getProductDetail: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      const isPreOrderOpen = await getPreOrderStatus();

      if (!product) {
        return res.status(404).send("Produk tidak ditemukan");
      }

      const reviews = await Review.find({
        product: product._id,
        status: "published",
      })
        .populate("user", "fullname")
        .sort({ createdAt: -1 });
      const averageRating = reviews.length
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

      res.render("customer/product-detail", {
        pageTitle: product.name,
        currentPage: "products",
        product,
        isPreOrderOpen,
        reviews,
        averageRating,
      });
    } catch (error) {
      console.error("Error getProductDetail:", error);
      res.status(500).send("Gagal memuat detail produk");
    }
  },

  createReview: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/auth/login");
      await Review.create({
        product: req.params.id,
        user: req.session.user.id,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      });
      res.redirect(`/customer/detailProducts/${req.params.id}`);
    } catch (error) {
      console.error("Error createReview:", error);
      res.status(500).send("Gagal menyimpan review");
    }
  },
};

module.exports = customerController;
