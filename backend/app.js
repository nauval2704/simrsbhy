const express = require("express");
const path = require("path");
const logger = require("morgan");
const compression = require("compression");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const hostname="36.66.36.106";
const httpServer = createServer(app);





// prod
// const https = require('https');//('https');
// const fs = require('fs');
// const options = {
//   key: fs.readFileSync('/etc/letsencrypt/live/rsbhyaceh.com/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/rsbhyaceh.com/fullchain.pem')
// };
// 
// const server = https.createServer(options, app);
// 
// 
// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost",
//       "http://localhost:182",
// //     "http://localhost:1821",
//       "http://localhost:4200",
// 	"http://36.66.36.106:182",
//     "http://36.66.36.106:1821",
//     "https://rsbhyaceh.com:1821",
//     //  "http://103.76.174.236:182",
//       "https://rsbhayangkaraaceh.com:1091",
//       "https://rsbhyaceh.com:1091",
//      // "https://rsbhayangkaraaceh.com:7121",
//       "http://103.76.174.236:109",
//       "https://rsbhyaceh.com:182",
//       "https://rsbhyaceh.com:8889",
//       "https://rsbhyaceh.com:109",
//       "https://rsbhayangkaraaceh.com:109",
//       "https://rsbhayangkaraaceh.com:182",
//     ],
//     methods: ["GET", "POST"],
//   },
// });

// dev
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost",
      "http://localhost:182",
      "http://localhost:1821",
      "http://localhost:4200", 
      "http://103.76.174.236:182",
      "https://rsbhayangkaraaceh.com:1821",
      "https://rsbhayangkaraaceh.com:182",
    ],
    methods: ["GET", "POST"],
  },
});

const movies = require("./routes/movies");
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


const bodyParser = require("body-parser");
const mongoose = require("./config/database"); //database configuration

const cors = require("cors");
const jwt = require("jsonwebtoken");

app.set("socketio", io);
app.use(compression());
app.use(cors());

// connection to mongodb
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
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

app.set("secretKey", "mansis-rspur"); // jwt secret token

app.use(logger("dev"));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use(express.static(path.join(process.cwd(), '/simrs')));


app.get("/", function (req, res) {
  res.json({
    status: "998",
    message: '"Content-Type" header not defined as it should be.',
  });
});

// public route
app.use("/mansis", mansis);
app.use("/users", users);
app.use("/simrs", simrs);
app.use("/vclaim", vclaim);
app.use("/rsonline", rsonline);

app.use("/radiologi", movies);

// private route
app.use("/simrsba", simrsba);
app.use("/gudang", validateUser, gudang);
app.use("/farmasi", validateUser, farmasi);
app.use("/apotek", validateUser, apotek);
app.use("/antreanrs", antreanrs);
// app.use("/import", importStock);
app.use("/ro", ro);
/* app.use("/simrsba", validateUser, simrsba); */
app.use("/movies", validateUser, movies);
app.use("/antreans", validateUser, antreans);
app.use("/kodepolis", validateUser, kodepolis);
app.use("/operasi", validateUser, operasi);
app.use("/satusehat/auth", satusehatAuth);
app.use("/satusehat/organization", validateUser, satusehatOrganization);
app.use("/satusehat/location", validateUser, satusehatLocation);
app.use("/satusehat/patient", validateUser, satusehatPatient);
app.use("/satusehat/practitioner", validateUser, satusehatPractitioner);
app.use("/satusehat/encounter", validateUser, satusehatEncounter);
app.use("/satusehat/condition", validateUser, satusehatCondition);
app.use("/icare", icare);
app.use("/keuangan", validateUser, keuangan);

app.get("/favicon.ico", function (req, res) {
  res.sendStatus(204);
});

function validateUser(req, res, next) {
  jwt.verify(
    req.headers["x-token"],
    req.app.get("secretKey"),
    function (err) {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: "error121",
          message: err.message,
          data: null,
        });
        //next();
      } else {
        next();
      }
    }
  );
}
// express doesn't consider not found 404 as an error, so we need to handle 404 explicitly
// handle 404 error
app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});
// handle errors
app.use(function (err, req, res) {

  if (err.status === 404)
    res.status(404).json({
      message: "Not found",
    });
  else
    res.status(500).json({
      response: {
        token: null,
      },
      metadata: {
        message: err.message,
        code: 500,
      },
    });
});

io.on("connection", (socket) => {
  socket.emit("test event", "DEVELOPMENT MODE, CONNECTED TO BACKEND");

  socket.on("test data", function (data) {
    io.emit("test data dari server", data);
  });
});

// prod

// server.listen(1821, () => {
//   console.log("simrs bhayangkara listening on *:1091");//1821");
// });

// dev

httpServer.listen(1821, () => {
  console.log("listening on *:1821");
});
