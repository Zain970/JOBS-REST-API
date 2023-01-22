const notFound = (req, res) => {

    // If user requests an invalid route that is not present at the server
    res.status(404).send('Route does not exist');
}

module.exports = notFound
