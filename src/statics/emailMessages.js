function getEmails(type, data) {
  let messages = {
    10: ``,
    13: `تم اضافتك بنجاح`,
  };
  return messages[type];
}

module.exports = getEmails;
