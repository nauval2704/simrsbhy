const response = require("../../../config/response");
const userModel = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
require("dotenv").config();

module.exports = {
    login: async (req, res) => {
        try {
            const user = await userModel.findOne({
                username:req.headers["x-username"], 
            });

            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai ",
                        "code": 201
                    }
                });
            }
  // passlama : $2b$10$ssXDp5hlDTJc0.L/tkaFd.uPgoDdnvzpVZVw2WK2f6DJuf3srlsDe username bpjs@kesehatan.go.id
            if  (req.headers["x-password"], user.password) { // (bcrypt.compareSync(req.headers["x-password"], user.password)) 
                const token = jwt.sign(
                    { data: user.password },
                    req.app.get("secretKey"),
                    {
                        expiresIn: 60 * 60 * 24,
                        // expiresIn: 60,
                    }
                );

                user.token = token;
                user.save();

                return res.status(200).send({
                    "response": {
                        "token": token
                    },
                    "metadata": {
                        "message": "Ok",
                        "code": 200
                    }
                });
            }
            return res.status(200).send({
                "metadata": {
                    "message": "Username atau Password Tidak Sesuai",
                    "code": 201
                }
            });
        } catch (error) {
            return response(500, "error", error, res);
        }
    },
};