const Product = require("../models/ProductModel");

const customerController = {
  getHome: async (req, res) => {
    try {
      const products = await Product.find({ isActive: "ready stok" }).sort({
        createdAt: -1,
      });

      res.render("customer/home", {
        pageTitle: "Home",
        currentPage: "home",
        products,
      });
    } catch (error) {
      console.error("Error getHome:", error);
      res.status(500).send("Gagal memuat halaman home");
    }
  },

  getProductDetail: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).send("Produk tidak ditemukan");
      }

      res.render("customer/product-detail", {
        pageTitle: product.name,
        currentPage: "product",
        product,
      });
    } catch (error) {
      console.error("Error getProductDetail:", error);
      res.status(500).send("Gagal memuat detail produk");
    }
  },
};

module.exports = customerController;
