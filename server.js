const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Folder password
const PASSWORD = "123456";

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Public files
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Folder clicked
app.get("/folder", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Password verification
app.post("/login", (req, res) => {
  const { password } = req.body;

  if (password === PASSWORD) {
    req.session.loggedIn = true;
    return res.redirect("/photos");
  }

  res.send(`
    <h2>Wrong Password</h2>
    <a href="/folder">Try Again</a>
  `);
});

// Protected photos page
app.get("/photos", (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect("/folder");
  }

  res.sendFile(path.join(__dirname, "public", "photos.html"));
});

// Protect image access
app.use("/protected-images", (req, res, next) => {
  if (!req.session.loggedIn) {
    return res.status(403).send("Access Denied");
  }
  next();
});

// Serve images
app.use(
  "/protected-images",
  express.static(path.join(__dirname, "images"))
);

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
});