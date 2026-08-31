const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");

dotenv.config();

const connectDb = require("./config/connectDb");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoute");
const paymentRoutes = require("./routes/paymentRoute");

const customerRoutes = require("./routes/customerRoutes");

const app = express();

connectDb();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    name: "cravely.sid",
    secret: process.env.SESSION_SECRET || "cravely-dev-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.currentPath = req.path;
  res.locals.flash = req.session.flash || null;

  if (req.session.flash) {
    delete req.session.flash;
  }

  if (req.query.logout === "success") {
    res.locals.flash = {
      type: "success",
      title: "Success",
      message: "You have been logged out.",
    };
  }

  res.set("Cache-Control", "no-store");
  next();
});

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    req.session.flash = {
      type: "error",
      title: "Login required",
      message: "Please log in first.",
    };

    return res.redirect(`/auth/login?redirect=${encodeURIComponent(req.originalUrl)}`);
  }

  next();
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.session.user?.role === role) {
      return next();
    }

    redirectToFreshLogin(req, res, req.originalUrl);
  };
};

const redirectToFreshLogin = (req, res, target) => {
  const loginUrl = `/auth/login?redirect=${encodeURIComponent(target)}`;

  if (!req.session.user) {
    return res.redirect(loginUrl);
  }

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }

    res.clearCookie("cravely.sid");
    res.redirect(loginUrl);
  });
};

app.get("/", (req, res) => {
  res.redirect("/auth/login");
});

app.get("/admin", (req, res) => {
  redirectToFreshLogin(req, res, "/dashboard");
});

app.get("/customer", (req, res) => {
  redirectToFreshLogin(req, res, "/customer/home");
});

app.use("/auth", authRoutes);
app.use("/dashboard", requireLogin, requireRole("admin"), adminRoutes);
app.use("/dashboard/orders", requireLogin, requireRole("admin"), orderRoutes);
app.use("/dashboard/payments", requireLogin, requireRole("admin"), paymentRoutes);


app.use("/customer", requireLogin, requireRole("customer"), customerRoutes);



app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
