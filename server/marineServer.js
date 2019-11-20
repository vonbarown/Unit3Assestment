const express = require('express');
const cors = require('cors');

const app = express();
const port = 3131;

app.use(cors());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

const researcherRouter = require('./routes/researchers.js');
const speciesRouter = require('./routes/species.js');
const animalsRouter = require('./routes/animals.js');
const habitatsRouter = require('./routes/habitats.js');
const sightingsRouter = require('./routes/sightings.js');

app.use('/marine', researcherRouter);
app.use('/marine', speciesRouter);
app.use('/marine', animalsRouter);
app.use('/marine', habitatsRouter);
app.use('/marine', sightingsRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});