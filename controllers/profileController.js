const bcrypt = require("bcrypt");
const User = require("../models/UserModel");

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";

const renderProfile = async (req, res, view, pageTitle) => {
  const user = await User.findById(req.session.user.id);
  if (!user) return res.status(404).send("User tidak ditemukan");
  res.render(view, { user, pageTitle, initials: user.avatarInitials || initials(user.fullname) });
};

exports.getCustomerProfile = (req, res) =>
  renderProfile(req, res, "customer/profile", "Profil Saya").catch((error) => {
    console.error("Error getCustomerProfile:", error);
    res.status(500).send("Gagal memuat profil");
  });

exports.getAdminProfile = (req, res) =>
  renderProfile(req, res, "admin/profile", "Profil Admin").catch((error) => {
    console.error("Error getAdminProfile:", error);
    res.status(500).send("Gagal memuat profil admin");
  });

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) return res.status(404).send("User tidak ditemukan");

    const { fullname, username, email, phoneNumber, address, password } = req.body;
    const duplicate = await User.findOne({
      $or: [{ email }, { username }],
      _id: { $ne: user._id },
    });
    if (duplicate) {
      req.session.flash = { type: "danger", title: "Profil belum disimpan", message: "Email atau username sudah digunakan." };
      return res.redirect(req.session.user.role === "admin" ? "/dashboard/profile" : "/customer/profile");
    }

    user.fullname = fullname;
    user.username = username;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.address = address;
    user.avatarInitials = initials(fullname);
    if (password && password.trim()) user.password = await bcrypt.hash(password, 10);
    await user.save();

    req.session.user.username = user.username;
    req.session.user.email = user.email;
    req.session.flash = { type: "success", title: "Profil tersimpan", message: "Data profil berhasil diperbarui." };
    res.redirect(user.role === "admin" ? "/dashboard/profile" : "/customer/profile");
  } catch (error) {
    console.error("Error updateProfile:", error);
    res.status(500).send("Gagal memperbarui profil");
  }
};
