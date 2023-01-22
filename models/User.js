const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        minlength: 3,
        maxlength: 50,
        unique: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minlength: 6
    }
})

userSchema.pre("save", async function (next) {

    console.log("In mongoose middleware presave : ", this);
    // 1).Hashing the password in this mongoose middleware
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
})

userSchema.methods.createJWT = async function () {

    // 1).Generating the token
    // 2).When we decrypt it then we will get the userId and name
    const token = jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: "30d" })

    // 2).Sending the token
    return token;
}
userSchema.methods.comparePassword = async function (providedPassword) {

    console.log("Actual password : ", this.password)
    console.log("Provided Passoword ", providedPassword);

    const isMatch = await bcrypt.compare(providedPassword, this.password)

    return isMatch;

}

const userModel = mongoose.model("User", userSchema);

module.exports = userModel