const Notification = require("../models/NotificationModel");
const User = require("../models/UserModel");

exports.getAdminNotifications = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }, "_id");
    const notifications = await Notification.find({ recipient: { $in: admins.map((admin) => admin._id) } })
      .sort({ createdAt: -1 })
      .limit(100);
    await Notification.updateMany({ _id: { $in: notifications.filter((item) => !item.readAt).map((item) => item._id) } }, { readAt: new Date() });
    res.render("admin/notifications", { notifications, pageTitle: "Notifications", whatsappNumber: process.env.WHATSAPP_ADMIN_NUMBER || "" });
  } catch (error) {
    console.error("Error getAdminNotifications:", error);
    res.status(500).send("Gagal memuat notifikasi");
  }
};
