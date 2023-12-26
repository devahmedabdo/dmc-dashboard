const nodemailer = require("nodemailer");
function sendEmail(data) {
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
      to: data.email,
      subject: data.subject,
      html: data.html,
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
function getEmails(type, subject, data, email) {
  let emails = {
    users: {
      resetPassword: {
        subject: "اعادة تعيين كلمة المرور",
        html: `<html lang="en"><head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@100;200;300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet">
<style>
  :root {
    --main: #018baa;
    --lmain: #00bde7;
  }

  body {
    text-align: center;
    font-family: "Noto Kufi Arabic", sans-serif;
    border-top: 100px solid #00bde7;
    background-color: #ebebeb;
    border-radius: 10px;
  }

  .container {
    padding: 50px 20px;
    max-width: 1200px;
    width: 90%;
    margin: auto;
    margin-top: -50px;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: #ffffff;
    position: relative;
    box-shadow: 0px 8px 6px #d7d7d7;

  }

  img {
    min-width: 100px;
    max-width: 250px;
    width: 30%;
  }

  .logo {
    text-align: left;
    margin: 0;
    position: absolute;
    left: 50px;
    top: 50px;

    width: 130px;
  }

  h2 {
    color: #018baa;
  }

  .main {
    color: #018baa;

  }

  .bold {
    font-weight: 900;
  }

  .btn {
    all: unset;
    padding: 8px 16px;
    background-color: #018baa;
    color: white;
    box-shadow: 0px 5px 6px #0000002e;
    border-radius: 8px;
    cursor: pointer;
  }

  p {
    max-width: 500px;
    margin: 20px auto;
    color: #656565ee;
  }

  a {
    all: unset;
    display: block;
  }

  @media (max-width:500px) {
    h1 {
      font-size: 25px;
    }

    h2 {
      font-size: 20px;
    }

    .container {
      padding: 50px 14px;

    }

    .logo {
      width: 100px;
      left: 20px;
      top: 20px;
    }
  }

  .email-img {
    min-width: 200px;
    max-width: 350px;

  }

  .powerd {
    color: #018baa;
    font-weight: 700;
    cursor: pointer;
  }
</style></head>


<body dir="rtl">
  <div class="container">
    
    
    <br>
    
    <h1>
      مرحبا <span class="main">${data.name}</span>
    </h1>
    

    <p>
      تمت الموافقة على تعديل بياناتك
    </p>

    <a class="btn">
      الصفحة الشخصية </a>

  </div>
  <div>
    <span>Delengat Medical Committee</span> |
    <span>لجنة الدلنجات الطبية</span>
    <a class="powerd" href="">Powerd By Ahmed Abdo</a>
  </div>


              </body></html>`,
        email,
        data,
      },
    },
    orders: {},
    members: {},
  };
  return emails[type][subject];
}
module.exports = { sendEmail, getEmails };
