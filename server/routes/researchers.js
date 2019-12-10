const express = require("express");
const router = express();

const { db } = require("../../database/dbPromise.js");

router.get("/", async (req, res) => {
  let researchers;
  try {
    researchers = await db.any(`SELECT * FROM researchers`);
    res.json({
      status: "Success",
      message: "retrieved all researchers",
      payload: researchers
    });
  } catch (error) {
    res.status(500);
    res.json({
      status: "error",
      message: "researchers not found",
      payload: researchers
    });
  }
});

const getResearcherById = async (req, res, next) => {
  let id = req.params.id;
  try {
    req.researcher = await db.one(
      `SELECT * FROM researchers WHERE id = $/id/`,
      {
        id
      }
    );
    next();
  } catch (error) {
    res.status(404);
    res.json({
      status: "error",
      message: "researcher not found",
      payload: null
    });
  }
};

const sendResults = (req, res) => {
  let researcher = req.researcher;
  res.json({
    status: "Success",
    message: "retrieved single researcher",
    payload: researcher
  });
};

router.get("/:id", getResearcherById, sendResults);

//query to create new researcher
const queryCreateResearcher = async (req, res, next) => {
  let researcher_name = req.body.researcher_name;
  let job_title = req.body.job_title;
  try {
    let insertQuery = `
        INSERT INTO researchers (researcher_name, job_title)
            VALUES($/name/, $/jobTitle/) RETURNING *`;

    req.newResearcher = await db.one(insertQuery, {
      researcher_name,
      job_title
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
  }
};

const sendPostResults = (req, res) => {
  let researcher = req.newResearcher;
  res.json({
    status: "Success",
    payload: researcher,
    message: "new researcher added to expedition"
  });
};

router.post("/", queryCreateResearcher, sendPostResults);

const patchResearcher = async (req, res, next) => {
  let researcher_name = req.body.researcher_name;
  let job_title = req.body.job_title;
  let id = req.params.id;
  try {
    if (req.body.researcher_name && req.body.job_title) {
      req.patchResearcher = await db.any(
        `UPDATE researchers SET researcher_name = $/name/,
         job_title = $/jobTitle/ WHERE id = $/id/ RETURNING *`,
        {
          researcher_name,
          job_title,
          id
        }
      );
    } else if (req.body.researcher_name) {
      req.patchResearcher = await db.any(
        `UPDATE researchers SET researcher_name = $/name/ WHERE id = $/id/ RETURNING *`,
        {
          researcher_name,
          id
        }
      );
    } else if (req.body.job_title) {
      req.patchResearcher = await db.any(
        `UPDATE researchers SET job_title = $/jobTitle/ WHERE id = $/id/ RETURNING *`,
        {
          job_title,
          id
        }
      );
    }

    next();
  } catch (error) {
    res.status(404);
    res.json({
      status: "error",
      message: "researcher not found",
      payload: null
    });
    console.log(error);
  }
};

const sendPatchResults = (req, res) => {
  let patch = req.patchResearcher;
  res.json({
    status: "Success",
    payload: patch,
    message: "researcher information updated"
  });
};

router.patch("/:id", patchResearcher, sendPatchResults);

const deleteResearcher = async (req, res, next) => {
  let id = req.params.id;
  try {
    req.removeResearcher = await db.one(
      `DELETE FROM researchers WHERE id = $/id/  RETURNING *`,
      {
        id
      }
    );
    next();
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: "researcher not found",
      payload: null
    });
    console.log(error);
  }
};

const sendDeleteResults = (req, res) => {
  let patch = req.removeResearcher;
  res.json({
    status: "Success",
    payload: patch,
    message: "researcher removed from position"
  });
};
router.delete("/:id", deleteResearcher, sendDeleteResults);

module.exports = router;
