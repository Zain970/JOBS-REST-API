const User = require("../models/User");
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UnauthenticatedError } = require("../errors/index");


const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Please provide email and password");
    }

    const user = await User.findOne({ email });
    // If there is a user with this email
    if (!user) {
        throw new UnauthenticatedError("Invalid Credentials");
    }
    // 1).Then compare the passwords
    // 2).Comparing both the passwords
    const isPasswordCorrect = await user.comparePassword(password);

    console.log("Is : ", isPasswordCorrect);

    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid Predentials");
    }

    // Creating the jwt token
    const token = await user.createJWT();

    res.status(StatusCodes.OK).json({
        user: {
            name: user.name
        },
        token
    })
}
const register = async (req, res) => {

    // Destructing the name 
    const { name, email, password } = req.body;

    // Creating a new user
    const user = await User.create({ ...req.body });

    // Generating the token using the user id and name
    const token = await user.createJWT();

    // Sending the response after creating a new user
    res.status(StatusCodes.CREATED).json({
        status: "success",
        msg: "new user created",
        user: {
            name: user.name
        },
        token
    })
}

module.exports = {
    login,
    register
}