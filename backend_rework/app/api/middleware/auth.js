const jwt = require("jsonwebtoken");
const Users = require("../models/users");

function authenticateToken(req, res, next) {
  const token = req.headers["x-token"] || (req.headers["authorization"] ? req.headers["authorization"].replace(/^Bearer\s+/i, '') : null);

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "UNAUTHORIZED_NO_TOKEN",
      data: null
    });
  }

  jwt.verify(token, req.app.get("secretKey"), async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "error",
        message: "UNAUTHORIZED_INVALID_TOKEN",
        data: null
      });
    }

    req.user = decoded || {};

    const needsDbLookup = (!req.user.role && (req.user.id || req.user._id)) || !req.user.nama;

    if (needsDbLookup && (req.user.id || req.user._id)) {
      try {
        const userId = req.user.id || req.user._id;
        const userDoc = await Users.findById(userId).select({ password: 0 }).lean();
        if (userDoc) {
          req.user.role = req.user.role || userDoc.role || "ROLE_USER";
          req.user.username = req.user.username || userDoc.username;
          req.user.nama = req.user.nama || userDoc.nama || "";
        }
      } catch (dbErr) {}
    }

    next();
  });
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        status: "error",
        message: "FORBIDDEN_NO_ROLE",
        data: null
      });
    }

    if (req.user.role === "ROLE_ADMIN" || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      status: "error",
      message: "FORBIDDEN_INSUFFICIENT_ROLE",
      data: null
    });
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles
};
