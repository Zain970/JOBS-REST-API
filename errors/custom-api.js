class CustomAPIError extends Error {
  constructor(message) {
    console.log("Custom Api Error constructor");
    super(message)
  }
}

module.exports = CustomAPIError;