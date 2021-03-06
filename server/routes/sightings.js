const express = require("express");
const router = express();
const query = require('./sightingsQuery.js')

const { db } = require("../../database/dbPromise.js");

router.get("/", async (req, res) => {
  let sightings;
  try {
    sightings = await db.any(`
         SELECT
         sightings.researcher_id, researchers.researcher_name, researchers.job_title,
             sightings.species_id, species.species_name, species.is_mammal,
             sightings.habitat_id, habitats.category
         FROM
         sightings
         INNER JOIN researchers ON researchers.id = sightings.researcher_id
         INNER JOIN species ON species.id = sightings.species_id
         INNER JOIN habitats ON habitats.id = sightings.habitat_id
        `);
    res.json({
      status: "Success",
      message: "retrieved all sightings",
      payload: sightings
    });
  } catch (error) {
    res.status(500);
    res.json({
      status: "error",
      message: "no sightings recorded",
      payload: sightings
    });
  }
});

//query to find species specific sightings
const getSpeciesSightingsById = async (req, res, next) => {
  console.log('hit');

  let id = req.params.id;
  try {
    req.sightings = await query.getSightings('species', id);
    console.log(req.sightings);

    next();
  } catch (error) {
    console.log(error);

    res.status(404);
    res.json({
      status: "error",
      message: "no sightings recorded",
      payload: null
    });
  }
};
const validateQuery = (req, res, next) => {
  let data = req.sightings;

  if (data.length === 0) {
    res.json({
      status: "error",
      message: "no sightings recorded",
      payload: null
    });
  } else {
    next();
  }
};

const sendResults = (req, res) => {
  let sighting = req.sightings;
  res.json({
    status: "Success",
    message: "retrieved single sighting",
    payload: sighting
  });
};

//retrieving species sighting records by ids
router.get("/species/:id", getSpeciesSightingsById, validateQuery, sendResults);

const getResearcherSightingsById = async (req, res, next) => {
  let id = req.params.id;
  try {
    req.sightings = await query.getSightings('researchers', id);
    next();
  } catch (error) {
    res.status(404);
    res.json({
      status: "error",
      message: "no sightings recorded",
      payload: null
    });
  }
};

router.get(
  "/researchers/:id",
  getResearcherSightingsById,
  validateQuery,
  sendResults
);

//get the
const getHabitatsSightingsById = async (req, res, next) => {
  let id = req.params.id;
  try {
    req.sightings = await query.getSightings('habitats', id);
    next();
  } catch (error) {
    res.status(404);
    res.json({
      status: "error",
      message: "no sightings recorded",
      payload: null
    });
  }
};
router.get(
  "/habitats/:id",
  getHabitatsSightingsById,
  validateQuery,
  sendResults
);

//query to record a new sighting
const queryToRecordSighting = async (req, res, next) => {
  let species_id = parseInt(req.body.species_id);
  let researcher_id = parseInt(req.body.researcher_id);
  let habitat_id = parseInt(req.body.habitat_id);

  try {
    let insertQuery = `
        INSERT INTO sightings(species_id, researcher_id, habitat_id)
            VALUES($/species_id/ ,$/researcher_id/,$/habitat_id/) RETURNING * `;

    req.newRecord = await db.one(insertQuery, {
      species_id,
      researcher_id,
      habitat_id
    });
    console.log(req.body);
    next();
  } catch (error) {
    if (error.code === "23505" && error.detail.includes("already exists")) {
      let customErr = "Records already exist. Please input a new one.";
      error = customErr;
      res.send({
        status: "error",
        message: error,
        payload: null
      });
    }
    throw error;
  }
};

const sendPostResults = (req, res) => {
  let sighting = req.newRecord;
  res.json({
    status: "Success",
    payload: sighting,
    message: "new sighting recorded"
  });
};

router.post("/", queryToRecordSighting, sendPostResults);

//delete records of sightings
const deleteSighting = async (req, res, next) => {
  let id = req.params.id;
  try {
    req.removeRecord = await db.one(
      `DELETE FROM sightings WHERE id = $/id/  RETURNING *`,
      {
        id
      }
    );
    next();
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: "no records on sighting",
      payload: null
    });
    console.log(error);
  }
};

const sendDeleteResults = (req, res) => {
  let deleted = req.removeRecord;
  res.json({
    status: "Success",
    message: "researcher removed from position",
    payload: deleted
  });
};
router.delete("/:id", deleteSighting, sendDeleteResults);

module.exports = router;
