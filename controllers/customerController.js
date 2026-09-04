const Product = require("../models/ProductModel");
const Cart = require("../models/CartModel");
const Wishlist = require("../models/WishlistModel");
const Order = require("../models/OrderModel");
const Notification = require("../models/NotificationModel");
const User = require("../models/UserModel");
const notifyWhatsApp = require("../utils/notifyWhatsApp");

const getCart = (user) => Cart.findOne({ user }).populate("items.product");
const totals = (cart) => {
  const subtotal = (cart?.items || []).reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal ? 20000 : 0;
  return { subtotal, shipping, total: subtotal + shipping };
};

const customerController = {
  getHome: async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render("customer/home", { pageTitle: "Home", currentPage: "home", products });
  },
  getProducts: async (req, res) => {
    const { category } = req.query;
    const products = await Product.find(["sweet", "savory"].includes(category) ? { category } : {}).sort({ createdAt: -1 });
    const wishlist = await Wishlist.findOne({ user: req.session.user.id });
    res.render("customer/product", { pageTitle: "Menu", currentPage: category || "products", selectedCategory: category || "all", activeCategory: category || "all", products, wishlist: wishlist?.products || [] });
  },
  getProductDetail: async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Produk tidak ditemukan");
    const wishlist = await Wishlist.findOne({ user: req.session.user.id });
    res.render("customer/product-detail", { pageTitle: product.name, currentPage: "products", product, isFavorite: wishlist?.products.some((item) => item.toString() === product._id.toString()) });
  },
  addToCart: async (req, res) => {
    const cart = await Cart.findOneAndUpdate({ user: req.session.user.id }, { $setOnInsert: { user: req.session.user.id } }, { upsert: true, new: true });
    const item = cart.items.find((entry) => entry.product.toString() === req.params.id);
    if (item) item.quantity += Math.max(1, Number(req.body.quantity) || 1);
    else cart.items.push({ product: req.params.id, quantity: Math.max(1, Number(req.body.quantity) || 1) });
    await cart.save();
    res.redirect(req.get("referer") || "/customer/cart");
  },
  updateCart: async (req, res) => {
    const cart = await Cart.findOne({ user: req.session.user.id });
    const item = cart?.items.id(req.params.itemId);
    if (!item) return res.status(404).send("Item cart tidak ditemukan");
    item.quantity = Math.max(1, Number(req.body.quantity) || 1);
    await cart.save();
    res.redirect("/customer/cart");
  },
  removeFromCart: async (req, res) => {
    await Cart.updateOne({ user: req.session.user.id }, { $pull: { items: { _id: req.params.itemId } } });
    res.redirect("/customer/cart");
  },
  getCartPage: async (req, res) => {
    const cart = await getCart(req.session.user.id);
    res.render("customer/cart", { pageTitle: "Shopping Cart", cart, ...totals(cart) });
  },
  toggleWishlist: async (req, res) => {
    const wishlist = await Wishlist.findOneAndUpdate({ user: req.session.user.id }, { $setOnInsert: { user: req.session.user.id } }, { upsert: true, new: true });
    const index = wishlist.products.findIndex((item) => item.toString() === req.params.id);
    if (index >= 0) wishlist.products.splice(index, 1); else wishlist.products.push(req.params.id);
    await wishlist.save();
    res.redirect(req.get("referer") || "/customer/wishlist");
  },
  getWishlist: async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.session.user.id }).populate("products");
    res.render("customer/wishlist", { pageTitle: "Menu Favorit", products: wishlist?.products || [] });
  },
  getCheckout: async (req, res) => {
    const cart = await getCart(req.session.user.id);
    if (!cart?.items.length) return res.redirect("/customer/cart");
    const user = await User.findById(req.session.user.id);
    res.render("customer/checkout", { pageTitle: "Checkout", cart, user, ...totals(cart) });
  },
  placeOrder: async (req, res) => {
    const cart = await getCart(req.session.user.id);
    if (!cart?.items.length) return res.redirect("/customer/cart");
    const user = await User.findById(req.session.user.id);
    const { total } = totals(cart);
    const order = await Order.create({ orderNumber: `CRV-${Date.now()}`, user: user._id, items: cart.items.map((item) => ({ product: item.product._id, quantity: item.quantity, price: item.product.price })), totalAmount: total, paymentMethod: req.body.paymentMethod || "Transfer", shippingAddress: req.body.shippingAddress || user.address, customerNote: req.body.customerNote || null, status: "Waiting Payment" });
    const admins = await User.find({ role: "admin" }, "_id");
    await Notification.insertMany(admins.map((admin) => ({ recipient: admin._id, type: "order", title: "Pesanan baru masuk", message: `${order.orderNumber} dari ${user.fullname}`, link: "/dashboard/orders" })));
    try {
      await notifyWhatsApp(`Pesanan baru ${order.orderNumber} dari ${user.fullname}. Total Rp ${total.toLocaleString("id-ID")}.`);
    } catch (error) {
      console.error("WhatsApp notification failed:", error);
    }
    await Cart.updateOne({ user: user._id }, { $set: { items: [] } });
    res.redirect(`/customer/orders/${order._id}/tracking`);
  },
  getHistory: async (req, res) => {
    const orders = await Order.find({ user: req.session.user.id }).populate("items.product").sort({ createdAt: -1 });
    res.render("customer/history", { pageTitle: "Order History", orders });
  },
  getTracking: async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id, user: req.session.user.id }).populate("items.product");
    if (!order) return res.status(404).send("Pesanan tidak ditemukan");
    res.render("customer/tracking", { pageTitle: "Order Tracking", order });
  },
};

module.exports = customerController;
