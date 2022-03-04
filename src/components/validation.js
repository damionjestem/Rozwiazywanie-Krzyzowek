const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateInput(data) {
  let errors = {};

  //empty string needed for validator proper functioning
  data.name = !isEmpty(data.name) ? data.name : "";
  data.file = !isEmpty(data.file) ? data.file : "";

  //check if file uploaded
  if (Validator.isEmpty(data.file)) {
    errors.file = "no file uploaded";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
