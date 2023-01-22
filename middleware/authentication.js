const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { UnauthenticatedError } = require("../errors/index");

const auth = (req, res, next) => {

    // check header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {

        throw new UnauthenticatedError("No token provided");
    }

    // 1).Turn it into the array and get the 2nd value
    const token = authHeader.split(" ")[1];
    console.log("Token : ", token);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Payload extracted from token: ", payload);

        // 1).Attach the user to the job route
        req.user = {
            userId: payload.userId,
            name: payload.name
        }
        next();
    }
    catch (error) {
        throw new UnauthenticatedError("Aunthentication Failed")
    }
}

module.exports = auth;