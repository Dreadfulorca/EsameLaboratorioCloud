const express = require("express");
const mysql = require("mysql2/promise");
const session = require("express-session");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const dbPassword = fs.readFileSync(process.env.DB_PASSWORD_FILE, "utf8").trim();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "webgl-secret-key-2025",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 3600000 },
  })
);

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: dbPassword,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let db;
async function connectDB() {
  db = await mysql.createPool(dbConfig);
}
connectDB();

app.get("/", (req, res) => {
  if (req.session.authenticated) {
    return res.redirect("/webapp/");
  }
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (rows.length > 0 && password === rows[0].password) {
      req.session.authenticated = true;
      req.session.user = rows[0].username;

      await db.execute(
        "INSERT INTO login_logs (user_id, ip_address, user_agent) VALUES (?, ?, ?)",
        [rows[0].id, req.ip, req.get("User-Agent")]
      );

      res.json({ success: true, redirect: "/webapp/" });
    } else {
      res.json({ success: false, message: "Credenziali non valide" });
    }
  } catch (error) {
    console.error("Errore login:", error);
    res.json({ success: false, message: "Errore del server" });
  }
});

app.get("/auth-check", (req, res) => {
  if (req.session && req.session.authenticated) {
    res.status(200).json({ authenticated: true, user: req.session.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server di autenticazione in ascolto sulla porta ${PORT}`);
});
