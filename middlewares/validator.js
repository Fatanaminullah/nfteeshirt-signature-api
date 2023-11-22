const { body, param, query, validationResult } = require("express-validator");

exports.postLoginValidationRules = () => {
  return [
    body("applicationId").exists().withMessage("applicationId is required"),
    body("loginId").exists().withMessage("loginId is required"),
    body("metaData").exists().withMessage("metaData is required"),
    body("password").exists().withMessage("password is required"),
  ];
}

exports.validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
      return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(400).json({
      errors: extractedErrors,
  })
}
