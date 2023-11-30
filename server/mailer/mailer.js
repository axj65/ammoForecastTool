
//sending email from contact form
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jessica.ts.weng@gmail.com",
    pass: "uenrocernzqhyveg",
  },
});

module.exports = transporter;