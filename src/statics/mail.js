const nodemailer = require("nodemailer");
const emails = require("../statics/emailMessages");

function sendEmail(type, data, email) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_SECRET_EMAIL,
        pass: process.env.MY_SECRET_EMAIL_PASS,
      },
    });
    const mailOption = {
      from: process.env.MY_SECRET_EMAIL,
      to: email,
      subject: type,
      html: emails.getEmails(type, data),
    };
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log(error);
        return console.log("error");
      }
      // return console.log("sent");
      return resolve({ messege: "message sent succesfully" });
    });
  });
}

module.exports = { sendEmail };
