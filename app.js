require('dotenv').config();
require('express-async-errors');

// Extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit")

// Express
const express = require('express');
// Initializing the express app
const app = express();

// connectDB
const connectDB = require("./db/connect");

// Authenticate middle-ware
const authenticateUser = require("./middleware/authentication");


const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// Parsing json data middleware
app.use(express.json());


// Security Middlewares

app.set("trust proxy", 1);

app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 100   // Limit each ip to 100 requests per windowMs
})
);
app.use(helmet())
app.use(cors());
app.use(xss());



app.get("/", (req, res) => {
  res.send("Jobs api");
})

// Main Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);


// Error handling middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {

    await connectDB(process.env.MONGO_URI);

    console.log("Connected to the database")

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
