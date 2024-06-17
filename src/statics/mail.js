const nodemailer = require("nodemailer");
const emails = require("../statics/emailMessages");
const subjects = {
  orderRecieved: "استلام طلبك",
  orderDone: "طلبك من DMC",
  newOrder: "طلب جديد في الجاليرى",
  resetPassword: "تغيير كلمة المرور",
  signup: "تسجيل جديد",
  member13: "الموافقة علي التسحيل",
  member32: "طلب تعديل",
  member23: "الموافقة علي التعديل",
};
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
      subject: subjects[type],
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
