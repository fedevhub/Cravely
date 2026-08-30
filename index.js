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

    return res.redirect("/auth/login");
  }

  next();
};

app.get("/", (req, res) => {
  res.redirect("/auth/login");
});

app.use("/auth", authRoutes);
app.use("/dashboard", requireLogin, adminRoutes);
app.use("/dashboard/orders", requireLogin, orderRoutes);
app.use("/dashboard/payments", requireLogin, paymentRoutes);


app.use("/customer", requireLogin, customerRoutes);



app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
