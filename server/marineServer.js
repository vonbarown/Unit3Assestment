const express = require("express");
const cors = require("cors");

const app = express();
const port = 3131;

app.use(cors());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());

const researcherRouter = require("./routes/researchers.js");
const speciesRouter = require("./routes/species.js");
const animalsRouter = require("./routes/animals.js");
const habitatsRouter = require("./routes/habitats.js");
const sightingsRouter = require("./routes/sightings.js");

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.use("/researchers", researcherRouter);
app.use("/species", speciesRouter);
app.use("/animals", animalsRouter);
app.use("/habitats", habitatsRouter);
app.use("/sightings", sightingsRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
