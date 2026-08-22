exports.getDashboard = async (req, res) => {
  console.log("DEBUG session at dashboard:", req.session);
  res.render("admin/dashboard", { pageTitle: "Dashboard Admin" });
};
