const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const uploadImage = require("../middlewares/uploadImage");
const userController = require("../controllers/userController");
const profileController = require("../controllers/profileController");
const notificationController = require("../controllers/notificationController");

router.get("/", adminController.getDashboard);

router.get("/products", productController.getDaftarProduct);

router.get("/tambahProducts", productController.getTambahProduct);
router.post(
  "/tambahProducts",
  uploadImage.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
  productController.tambahProduct,
);

router.get("/editProducts/:id", productController.getEditProduct);
router.post(
  "/editProducts/:id",
  uploadImage.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
  productController.updateProduct,
);

router.post("/deleteProducts/:id", productController.deleteProduct);

router.get("/detailProducts/:id", productController.getDetailProduct);

router.post(
  "/detailProducts/:id",
  uploadImage.array("gallery", 5),
  productController.updateDetailProduct,
);

router.post(
  "/detailProducts/:id/deleteImage/:imageIndex",
  productController.deleteDetailImage,
);

router.post(
  "/detailProducts/:id/delete",
  productController.deleteDetailProduct,
);

router.post("/detailProducts/:id/add", productController.addDetailProduct);

router.post(
  "/detailProducts/:id/update",
  uploadImage.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
  productController.updateDetailProduct,
);

router.get("/users", userController.getDaftarUser);

router.get("/users/tambah", userController.getTambahUser);
router.post("/users/tambah", userController.tambahUser);

router.get("/users/edit/:id", userController.getEditUser);
router.post("/users/edit/:id", userController.updateUser);

router.post("/users/delete/:id", userController.deleteUser);
router.get("/profile", profileController.getAdminProfile);
router.post("/profile", profileController.updateProfile);
router.get("/notifications", notificationController.getAdminNotifications);

module.exports = router;
