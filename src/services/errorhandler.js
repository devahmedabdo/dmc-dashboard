function handle(error, res) {
  if (error.name === "ValidationError") {
    if (error.errors) {
      const validationErrors = {};
      for (const field in error.errors) {
        if (error.errors.hasOwnProperty(field)) {
          validationErrors[field] = {
            message: error.errors[field].message,
          };
        }
      }
      return res.status(422).send({ errors: validationErrors });
    } else {
      return res.status(422).send({ errors: { general: error.message } });
    }
  } else if (error.code === 11000) {
    // Duplicate key error
    const field = Object.keys(error.keyValue)[0];
    const duplicateError = {
      [field]: {
        message: `القيمة '${error.keyValue[field]}' موجودة بالفعل`,
      },
    };
    return res.status(422).send({ errors: duplicateError });
  } else {
    console.log(error);
    return res.status(400).send(error);
  }
}
module.exports = handle;
