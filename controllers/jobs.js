const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/index");

const getAllJobs = async (req, res) => {

    // 1).Getting the jobs that are associated by a specific user
    // 2).User who is logged in
    const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");

    res.status(StatusCodes.OK).json({
        totalJobs: jobs.length,
        jobs
    })
}

const getJob = async (req, res) => {

    // Destructing both the objects
    const { user: { userId }, params: { id: jobId } } = req;

    // Finding the job with the provided id
    const job = await Job.findOne({
        _id: jobId,
        createdBy: userId
    })

    // if no job with the provided id exists
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json({
        job
    });
}
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;

    // Creating a new job
    const job = await Job.create({ ...req.body });

    res.status(StatusCodes.CREATED).json({
        job
    })
}

const updateJob = async (req, res) => {
    // 1).Destructing both the objects
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId }
    } = req;

    // If company and position not provided in req.body
    if (!company || !position) {
        throw new BadRequestError("Company or Position fields cannot be empty")
    }

    // Now updating the job
    const job = await Job.findByIdAndUpdate(
        {
            _id: jobId,
            createdBy: userId
        },
        req.body,
        { new: true, runValidators: true }
    )


    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({
        job
    })
}

const deleteJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;

    const job = await Job.findOneAndRemove({
        _id: jobId,
        createdBy: userId
    })

    // If job dosent exist
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    // Sending the response
    res.status(StatusCodes.OK).send();
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}