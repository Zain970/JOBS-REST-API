const CustomAPIError = require("../errors/custom-api");
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later"
  }
  // If the error is created by us
  if (err instanceof CustomAPIError) {
    console.log("*************")
    console.log("I created it ");
    console.log("*************")


    // return res.status(err.statusCode).json({ msg: err.message })

  }

  if (err.name == "ValidationError") {
    // customError.msg = `Please provide ${Object.keys(err.errors)}`

    // Return array of objects and in each object we are accessing the message
    customError.msg = Object.values(err.errors).map((item) => {
      return item.message;

    })
    customError.msg = customError.msg.join(",");
    // Setting the status Code
    customError.statusCode = 400;

  }
  if (err.code && err.code == 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field ,please choose another value`

    // Bad request error status code
    customError.statusCode = 400
  }
  if (err.name == "CastError") {
    customError.msg = `No item found with id ${err.value}`

    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg })

  // If error is not created by us rather it is a general server error
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })

}

module.exports = errorHandlerMiddleware
