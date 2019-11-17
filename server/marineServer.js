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
app.use('/researchers', researcherRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});