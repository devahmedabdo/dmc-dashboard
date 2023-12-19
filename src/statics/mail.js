const nodemailer = require("nodemailer");
function sendEmail(email, html, subject) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_SECRET_EMAIL,
        pass: process.env.MY_SECRET_EMAILPASSWORD,
      },
    });
    const mailOption = {
      from: process.env.MY_SECRET_EMAIL,
      to: email,
      subject: subject,
      html: html,
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

module.exports = sendEmail;
