function getEmails(type, data) {
  console.log(data);
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
    border-top: 100px solid var(--lmain);
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
    color: var(--main);
  }

  .main {
    color: var(--main);

  }

  .bold {
    font-weight: 900;
  }

  .btn {
    all: unset;
    padding: 8px 16px;
    background-color: var(--main);
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
    color: var(--main);
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
        email: data,
      },
    },
    orderRecieved: `
    <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
</head>

<body
  style="text-align: center; font-family: 'Noto Kufi Arabic', sans-serif; border-top: 100px solid #00bde7; background-color: #ebebeb; border-radius: 10px;">

  <table
    style="max-width: 600px; width: 90%; margin: auto; margin-top: -50px; margin-bottom: 10px; border-radius: 10px; background-color: #ffffff; border-collapse: collapse;">
    <tr>
      <td style="padding: 50px 20px; text-align: left;">
        <a href=""><img style="width: 130px;" src="${
          process.env.LIVE_CPANEL_URL
        }assets/email/logo.png" alt="Logo"></a>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <img style="min-width: 300px; max-width: 250px; width: 30%;"
          src="${
            process.env.LIVE_CPANEL_URL
          }assets/email/order-recieved.png" alt="Order Received">
        <h1  >تم استقبال طلبك</h1>
        <h2  >مرحبا <span style="color: #018baa;">${data.name}</span></h2>
        <p style="max-width: 500px; margin: 20px auto; color: #656565;"> 

        سعيدون بزيارتك لموقعنا والطلب منه 
سيتم تجهيز طلبك بكل حب واخباركم عند الانتهاء منه 
ونتمنى ألا تكون اخر مرة

        </p>
        <table dir="rtl" style="width: 100%; text-align: center;">
          <thead style="background-color: #018baa; color: white;">
            <tr>
              <th>اسم المنتج</th>
              <th>السعر</th>
              <th>الكمية</th>
            </tr>
          </thead>
          <tbody>
                  ${creatOrderTabel(data.products)}

          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <p>Delengat Medical Committee | لجنة الدلنجات الطبية</p>
        <p><a href="${
          process.env.DEV_CONTACT
        }" style="color: #018baa; font-weight: 700;">Powerd By Ahmed Abdo</a></p>
      </td>
    </tr>
  </table>

</body>

</html>
     `,
    newOrder: `
    <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
</head>

<body
  style="text-align: center; font-family: 'Noto Kufi Arabic', sans-serif; border-top: 100px solid #00bde7; background-color: #ebebeb; border-radius: 10px;">

  <table
    style="max-width: 600px; width: 90%; margin: auto; margin-top: -50px; margin-bottom: 10px; border-radius: 10px; background-color: #ffffff; border-collapse: collapse;">
    <tr>
      <td style="padding: 50px 20px; text-align: left;">
        <a href=""><img style="width: 130px;" src="${process.env.LIVE_CPANEL_URL}assets/email/logo.png" alt="Logo"></a>
      </td>
    </tr>
     <tr>
      <td style="padding: 20px;">
        <img class="email-img" src="${process.env.LIVE_CPANEL_URL}assets/email/newOrder.png"
          style="width: 30%; min-width:300px; max-width: 350px;" alt="New Order">
        <h1>هناك طلب جديد</h1>
        <h2>باسم <span  style="color: #018baa;">${data.name}</span></h2>
        <p style="max-width: 500px; margin: 20px auto; color: #656565ee;">يرجى مراجعته</p>
        <a href="${process.env.LIVE_CPANEL_URL}gallery/orders"
          style="all: unset; display: block; width: fit-content; margin: auto; padding: 8px 16px; background-color: #018baa; color: white; box-shadow: 0px 5px 6px #0000002e; border-radius: 8px; cursor: pointer;">الطلبات</a>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <p>Delengat Medical Committee | لجنة الدلنجات الطبية</p>
        <p><a href="${process.env.DEV_CONTACT}" style="color: #018baa; font-weight: 700;">Powerd By Ahmed Abdo</a></p>
      </td>
    </tr>
  </table>

</body>

</html>
     `,
    orderDone: `
    <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
</head>

<body
  style="text-align: center; font-family: 'Noto Kufi Arabic', sans-serif; border-top: 100px solid #00bde7; background-color: #ebebeb; border-radius: 10px;">

  <table
    style="max-width: 600px; width: 90%; margin: auto; margin-top: -50px; margin-bottom: 10px; border-radius: 10px; background-color: #ffffff; border-collapse: collapse;">
    <tr>
      <td style="padding: 50px 20px; text-align: left;">
        <a href=""><img style="width: 130px;" src="${process.env.LIVE_CPANEL_URL}assets/email/logo.png" alt="Logo"></a>
      </td>
    </tr>
        <tr>
      <td style="padding: 20px;">
        <h1>مرحبا <span style="color: #018baa;">${data.name} </span></h1>
        <img src="${process.env.LIVE_CPANEL_URL}assets/email/orderOnTheWay.png" style="width: 30%; min-width: 300px; max-width: 350px;">
        <p style="max-width: 500px; margin: 20px auto; color: #656565ee;">طلبك في الطريق</p>
        <table dir="rtl" style="width: 100%; text-align: center; margin-top:16px">
          <thead style="background-color: #018baa; color: white;">
            <tr>
              <th>العنوان</th>
            </tr>
          </thead>
          <tbody>
                <tr>
                <td>${data.city} - ${data.street}  </td>
                </tr>
          </tbody>
        </table>
        <table dir="rtl" style="width: 100%; text-align: center; margin-top:16px">
          <thead style="background-color: #018baa; color: white;">
            <tr>
              <th>رقم الهاتف</th>
              <th>رقم الهاتف الاحتياطي</th>
            </tr>
          </thead>
          <tbody>
                <tr>
                <td>${data.phone}</td>
                <td>${data.phone_2}</td>
                </tr>
          </tbody>
        </table>
        </td>
    </tr>

    <tr>
      <td style="padding: 20px;">
        <p>Delengat Medical Committee | لجنة الدلنجات الطبية</p>
        <p><a href="${process.env.DEV_CONTACT}" style="color: #018baa; font-weight: 700;">Powerd By Ahmed Abdo</a></p>
      </td>
    </tr>
  </table>

</body>

</html>
     `,

    orders: {},
    members: {},
  };
  return emails[type];
}
function creatOrderTabel(array) {
  let tabel = "";
  array.forEach((prod) => {
    tabel += `<tr><td>${prod.product.name}</td><td>${prod.product.price}</td><td>${prod.total}</td></tr>
    `;
  });
  return tabel;
}
module.exports = { getEmails };
