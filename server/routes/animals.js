const express = require("express");
const router = express();

const { db } = require("../../database/dbPromise.js");

router.get("/", async (req, res) => {
  let animals;
  try {
    animals = await db.any(`SELECT * FROM animals`);
    res.json({
      status: "Success",
      message: "retrieved all animals",
      payload: animals
    });
  } catch (error) {
    res.status(500);
    res.json({
      status: "error",
      message: "animals not found, who let them out",
      payload: animals
    });
  }
});

const getAnimalById = async (req, res, next) => {
  let id = req.params.id;
  try {
    req.animal = await db.one(`SELECT * FROM animals WHERE id = $/id/`, {
      id
    });
    next();
  } catch (error) {
    res.status(404);
    res.json({
      status: "error",
      message: "animal not found, who let it out?",
      payload: null
    });
  }
};

const sendResults = (req, res) => {
  let animal = req.animal;
  res.json({
    status: "Success",
    message: "retrieved a single animal",
    payload: animal
  });
};

router.get("/:id", getAnimalById, sendResults);

//query to add a new animal
const queryToAddAnimal = async (req, res, next) => {
  let nickname = req.body.nickname;
  let species_id = req.body.species_id;
  try {
    let insertQuery = `
        INSERT INTO animals(nickname, species_id) VALUES($/nickname/ , $/species_id/ ) RETURNING * `;
    req.newAnimal = await db.one(insertQuery, {
      nickname,
      species_id
    });
    console.log(req.body);
    next();
  } catch (error) {
    if (error.code === "23505" && error.detail.includes("already exists")) {
      let customErr = "Researcher already exist. Please input a new one.";
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
  let animal = req.newAnimal;
  res.json({
    status: "Success",
    payload: animal,
    message: "new animal added to database"
  });
};

router.post("/", queryToAddAnimal, sendPostResults);

//update animal
const patchAnimal = async (req, res, next) => {
  let nickname = req.body.nickname;
  let id = req.params.id;
  try {
    req.patchAnimal = await db.any(
      `UPDATE animals SET nickname = $/nickname/ WHERE id = $/id/ RETURNING * `,
      {
        nickname,
        id
      }
    );
    next();
  } catch (error) {
    res.status(404);
    res.json({
      status: "error",
      message: "animal not found",
      payload: null
    });
    console.log(error);
  }
};

const sendPatchResults = (req, res) => {
  let patch = req.patchAnimal;
  res.json({
    status: "Success",
    payload: patch,
    message: "animal data updated information updated"
  });
};

router.patch("/:id", patchAnimal, sendPatchResults);

//delete animal
const deleteAnimal = async (req, res, next) => {
  let id = req.params.id;
  try {
    req.removeAnimal = await db.one(
      `DELETE FROM animals WHERE id = $/id/  RETURNING *`,
      {
        id
      }
    );
    next();
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: "animal was not found, who let it out?",
      payload: null
    });
    console.log(error);
  }
};

const sendDeleteResults = (req, res) => {
  let deleted = req.removeAnimal;
  res.json({
    status: "Success",
    message: "The animal is now at a farm upstate",
    payload: deleted
  });
};
router.delete("/:id", deleteAnimal, sendDeleteResults);

module.exports = router;
