const express = require("express");
const router = express();

const { db } = require("../../database/dbPromise.js");

router.get("/", async (req, res) => {
  let species;
  try {
    species = await db.any(`SELECT * FROM species`);
    res.json({
      status: "Success",
      message: "retrieved all species",
      payload: species
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({
      status: "error",
      message: "species not found",
      payload: species
    });
  }
});

const getSpeciesById = async (req, res, next) => {
  let id = req.params.id;
  try {
    req.species = await db.one(`SELECT * FROM species WHERE id = $/id/`, {
      id
    });
    next();
  } catch (error) {
    res.status(404);
    res.json({
      status: "error",
      message: "species not found",
      payload: null
    });
    console.log(error);
  }
};

const sendResults = (req, res) => {
  let species = req.species;
  res.json({
    status: "Success",
    message: "retrieved single Species",
    payload: species
  });
};

router.get("/:id", getSpeciesById, sendResults);

//query to add new species
const queryAddNewSpecies = async (req, res, next) => {
  let name = req.body.species_name;
  let mammal = req.body.is_mammal;
  try {
    let insertQuery = `
        INSERT INTO species(species_name,is_mammal)
            VALUES($/name/,$/mammal/) RETURNING *`;

    req.newResearcher = await db.one(insertQuery, {
      name,
      mammal
    });
    console.log(req.body);
    next();
  } catch (error) {
    if (error.code === "23505" && error.detail.includes("already exists")) {
      let customErr = "Species already exist. Please input a new one.";
      error = customErr;
      res.send({
        status: "error",
        message: error
      });
    }
    throw error;
  }
};

const sendPostResults = (req, res) => {
  let researcher = req.newResearcher;
  res.json({
    status: "Success",
    payload: researcher,
    message: "new species added to collection"
  });
};

router.post("/", queryAddNewSpecies, sendPostResults);

module.exports = router;
