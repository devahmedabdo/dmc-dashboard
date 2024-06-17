function getEmails(type, data) {
  let emails = {
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
        <h2  >مرحبا <span style="color: #018baa;">${data?.name}</span></h2>
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
                  ${creatOrderTabel(data?.products)}

          </tbody>
        </table>
      </td>
    </tr>
    
  </table>
  <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; margin-top: 10px;">
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
        <h1>هناك طلب جديد باسم</h1>
        <h2  style="color: #018baa;"> ${data?.name} </h2>
        <p style="max-width: 500px; margin: 20px auto; color: #656565ee;">يرجى مراجعته</p>
        <a href="${process.env.LIVE_CPANEL_URL}gallery/orders"
          style="all: unset; display: block; width: fit-content; margin: auto; padding: 8px 16px; background-color: #018baa; color: white; box-shadow: 0px 5px 6px #0000002e; border-radius: 8px; cursor: pointer;">الطلبات</a>
      </td>
    </tr>
    
  </table>
<table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; margin-top: 10px;">
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
        <h1>مرحبا <span style="color: #018baa;">${data?.name} </span></h1>
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
                <td>${data?.city} - ${data?.street}  </td>
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
                <td>${data?.phone}</td>
                <td>${data?.phone_2}</td>
                </tr>
          </tbody>
        </table>
        </td>
    </tr>

    
  </table>
<table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; margin-top: 10px;">
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
    resetPassword: `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
</head>

<body  style="text-align: center; font-family: 'Noto Kufi Arabic', sans-serif; border-top: 100px solid #00bde7; background-color: #ebebeb; border-radius: 10px;">
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
      <td align="center" style="padding: 50px 20px 4px; position: relative;">
        <img src="${
          process.env.LIVE_CPANEL_URL
        }assets/email/pass-reset.png" alt="Password Reset" style="min-width: 200px; max-width: 350px; width: 100%;">
        <h1 style="color: #018baa;">إعادة تعيين كلمة المرور</h1>
        <h2 style="color: #018baa;">مرحبا <span>${
          data?.member?.name?.first?.ar
        }</span></h2>
        <p style="max-width: 500px; margin: 20px auto; color: #656565ee;">يبدو انك نسيت كلمة المرور الخاصه بك اذا كان ذلك صحيحا يرجي الضغط على الزر ادناه من أجل إعادة تهيئة كلمة المرور</p>
        <a href="${
          process.env.LIVE_SITE_URL + "reset-password/" + data?.token
        }" style="display: inline-block; padding: 8px 16px; background-color: #018baa; color: white; box-shadow: 0px 5px 6px #0000002e; border-radius: 8px; text-decoration: none; cursor: pointer;">تغيير كلمة المرور</a>
        <p style="max-width: 500px; margin: 20px auto; color: #656565ee;">اذا لم تقم بطلب اعادة تعيين كلمة المرور تجاهل هذه الرسال</p>
      </td>
    </tr>
    
    </table>
    <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; margin-top: 10px;">
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
    signup: `
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
      <td align="center" style="padding: 50px 20px; position: relative;">
        <img src="${
          process.env.LIVE_CPANEL_URL
        }assets/email/signup.png" alt="new Signup" style="min-width: 200px; max-width: 350px; width: 100%;">
        <h1 style="color: #018baa;">تسجيل جديد</h1>
         
        <p style="max-width: 500px; margin: 20px auto; color: #656565ee;">   
          هناك تسجيل لعضو جديد في الفريق يرجي التوجه للوحة التحكم من اجل مراجعته و الموافقه او الرفض</p>
        <a href="${process.env.LIVE_CPANEL_URL + "members"}"
          style="display: inline-block; padding: 8px 16px; background-color: #018baa; color: white; box-shadow: 0px 5px 6px #0000002e; border-radius: 8px; text-decoration: none; cursor: pointer;"> 
          لوحة التحكم</a>
 
      </td>
    </tr>

  </table>
  <table align="center" cellpadding="0" cellspacing="0" width="100%"
    style="max-width: 600px; margin: 0 auto; margin-top: 10px;">
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

</html>`,
    member13: `
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
      <img src="${
        process.env.LIVE_CPANEL_URL
      }assets/email/added-done.png" style="width: 30%; min-width: 300px; max-width: 350px;">
      <h1>مرحبا <span style="color: #018baa;">${
        data?.name?.first?.ar
      } </span></h1>
        <p style="max-width: 500px; margin: 20px auto; color: #656565ee;">تمت الموافقة على اضافة بياناتك</p>
        
      <a href="${process.env.LIVE_SITE_URL + "profile"}"
          style="display: inline-block; padding: 8px 16px; background-color: #018baa; color: white; box-shadow: 0px 5px 6px #0000002e; border-radius: 8px; text-decoration: none; cursor: pointer;"> 
          الصفحه الشخصية</a>
        </td>
    </tr>
  </table>
<table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; margin-top: 10px;">
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
    member32: `
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
      <img src="${
        process.env.LIVE_CPANEL_URL
      }assets/email/update.png" style="width: 30%; min-width: 300px; max-width: 350px;">
      <h1>مرحبا </h1>
        <p style="max-width: 500px; margin: 20px auto; color: #656565ee;">تم طلب تغيير بيانات العضو <span style="color: #018baa;">${
          data?.name?.first?.ar + " " + data?.name?.last?.ar
        } </span>  يرجي مراجعة التغييرات</p>
            <a href="${process.env.LIVE_CPANEL_URL + "members"}"
          style="display: inline-block; padding: 8px 16px; background-color: #018baa; color: white; box-shadow: 0px 5px 6px #0000002e; border-radius: 8px; text-decoration: none; cursor: pointer;"> 
          لوحة التحكم</a>
        </td>
    </tr>
  </table>
<table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; margin-top: 10px;">
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
    member23: `
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
      <img src="${
        process.env.LIVE_CPANEL_URL
      }assets/email/update-done.png" style="width: 30%; min-width: 300px; max-width: 350px;">
      <h1>مرحبا <span style="color: #018baa;">${
        data?.name?.first?.ar + " " + data?.name?.last?.ar
      } </span> </h1>
        <p style="max-width: 500px; margin: 20px auto; color: #656565ee;">تمت الموافقة على تغيير بياناتك  </p>
         
        </td>
    </tr>
  </table>
<table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; margin-top: 10px;">
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
  };
  return emails[type];
}
function creatOrderTabel(array) {
  let tabel = "";
  array?.forEach((prod) => {
    tabel += `<tr><td>${prod.product.name}</td><td>${prod.product.price}</td><td>${prod.total}</td></tr>
    `;
  });
  // console.log(array);
  let total = array?.reduce((pre, curr) => {
    return pre + curr.total * curr.product.price;
  }, 0);
  tabel += `<tr style="background: #eeeeee;"><td>الاجمالي</td><td></td><td>${total}</td></tr>
  `;

  return tabel;
}
module.exports = { getEmails };
