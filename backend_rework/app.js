require('dotenv').config();
const express = require("express");
const path = require("path");
const logger = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { createServer } = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const mongoose = require("./config/database");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const httpServer = createServer(app);

// Enable CORS for all origins (plug-and-play)
app.use(cors({
  origin: "*",
  credentials: true
}));

// Configure Socket.io with dynamic CORS
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("socketio", io);
app.set("secretKey", process.env.JWT_SECRET); // jwt secret token

app.use(compression());
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));

// Rate limiter untuk endpoint login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 20,
  message: { status: 429, message: 'Terlalu banyak percobaan login. Coba lagi nanti.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Replicate original backend CORS exactly
app.use(cors());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

// Connection to MongoDB
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

app.use(logger("dev"));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static(path.join(process.cwd(), '/simrs')));

// Import Routes
const users = require("./routes/users");
const mansis = require("./routes/mansis");
const antreans = require("./routes/antreans");
const operasi = require("./routes/operasi");
const simrs = require("./routes/simrs");
const simrsba = require("./routes/simrsba");
const kodepolis = require("./routes/kodepolis");
const vclaim = require("./routes/vclaim");
const rsonline = require("./routes/rsonline");
const radiologi = require("./routes/radiologi");
const antreanrs = require("./routes/antreanrs");
const gudang = require("./routes/gudang");
const apotek = require("./routes/apotek");
const farmasi = require("./routes/farmasi");
const ro = require("./routes/ro");
const satusehatAuth = require("./routes/satusehat/auth/auth");
const satusehatOrganization = require("./routes/satusehat/organization/organization");
const satusehatLocation = require("./routes/satusehat/location/location");
const satusehatPatient = require("./routes/satusehat/patient/patient");
const satusehatPractitioner = require("./routes/satusehat/practitioner/practitioner");
const satusehatEncounter = require("./routes/satusehat/encounter/encounter");
const satusehatCondition = require("./routes/satusehat/condition/condition");
const icare = require("./routes/icare");
const keuangan = require("./routes/keuangan/keuangan");

app.get("/", function (req, res) {
  res.json({
    status: "998",
    message: '"Content-Type" header not defined as it should be.',
  });
});

app.get("/favicon.ico", function (req, res) {
  res.sendStatus(204);
});

// Middleware to validate JWT token
function validateUser(req, res, next) {
  console.log("=== VALIDATE USER DEBUG ===");
  console.log("URL:", req.url);
  console.log("x-token header:", req.headers["x-token"]);
  console.log("secretKey loaded:", !!req.app.get("secretKey"));
  
  jwt.verify(
    req.headers["x-token"],
    req.app.get("secretKey"),
    function (err) {
      if (err) {
        console.log("JWT VERIFY FAILED:", err.message);
        return res.status(500).json({
          status: "error121",
          message: err.message,
          data: null,
        });
      } else {
        console.log("JWT VERIFY SUCCESS");
        next();
      }
    }
  );
}

// Public routes
app.use("/mansis", mansis);
app.use("/users", loginLimiter, users);
app.use("/simrs", simrs);
app.use("/vclaim", vclaim);
app.use("/rsonline", rsonline);
app.use("/antreanrs", antreanrs);
app.use("/radiologi", radiologi);
app.use("/satusehat/auth", satusehatAuth);
app.use("/icare", icare);

// Private routes (Butuh JWT Auth)
app.use("/simrsba", simrsba);
app.use("/gudang", validateUser, gudang);
app.use("/farmasi", validateUser, farmasi);
app.use("/apotek", validateUser, apotek);
app.use("/ro", ro);
app.use("/antreans", validateUser, antreans);
app.use("/kodepolis", validateUser, kodepolis);
app.use("/operasi", validateUser, operasi);
app.use("/satusehat/organization", validateUser, satusehatOrganization);
app.use("/satusehat/location", validateUser, satusehatLocation);
app.use("/satusehat/patient", validateUser, satusehatPatient);
app.use("/satusehat/practitioner", validateUser, satusehatPractitioner);
app.use("/satusehat/encounter", validateUser, satusehatEncounter);
app.use("/satusehat/condition", validateUser, satusehatCondition);
app.use("/keuangan", validateUser, keuangan);

// Error Handling
app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  if (err.status === 404) {
    return res.status(404).json({
      message: "Not found",
    });
  } else {
    return res.status(500).json({
      response: {
        token: null,
      },
      metadata: {
        message: err.message,
        code: 500,
      },
    });
  }
});

// Socket.IO Connections
io.on("connection", (socket) => {
  socket.emit("test event", "DEVELOPMENT MODE, CONNECTED TO BACKEND");

  socket.on("test data", function (data) {
    io.emit("test data dari server", data);
  });
});

httpServer.listen(1822, () => {
  console.log("listening on *:1822");
});
