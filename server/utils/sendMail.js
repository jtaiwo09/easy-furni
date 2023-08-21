const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const fs = require("fs");

const sendMail = async (options, useLayout = "main") => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const hbsOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve("./views/partials"),
      layoutsDir: path.resolve("./views/layouts"),
      defaultLayout: useLayout,
    },
    viewPath: path.resolve("./views"),
    extName: ".handlebars",
  };

  transporter.use("compile", hbs(hbsOptions));

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    // text: options.message,
    template: options.template,
    context: options.context,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
