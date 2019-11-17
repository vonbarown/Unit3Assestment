const express = require('express');
const router = express();

const {
    db
} = require('../../database/dbPromise.js')

router.get('/', async (req, res) => {
    let sightings;
    try {
        sightings = await db.any(`SELECT * FROM sightings`);
        res.json({
            status: 'Success',
            message: 'retrieved all sightings',
            payload: sightings
        });
    } catch (error) {
        res.status(500)
        res.json({
            status: 'error',
            message: 'no sightings recorded',
            payload: sightings
        });
    }

});

//query to find species specific sightings
const getSpeciesSightingsById = async (req, res, next) => {
    let id = req.params.id;
    try {
        req.sightings = await db.one(`SELECT * FROM sightings  WHERE species_id = $/id/`, {
            id
        });
        next()
    } catch (error) {
        res.status(404)
        res.json({
            status: 'error',
            message: 'no sightings recorded',
            payload: null
        });
    }
}

const sendResults = (req, res) => {
    let sighting = req.sightings;
    res.json({
        status: 'Success',
        message: 'retrieved single sighting',
        payload: sighting
    });
}

//retrieving species sighting records by ids
router.get('/species/:id', getSpeciesSightingsById, sendResults)

const getResearcherSightingsById = async (req, res, next) => {
    let id = req.params.id;
    try {
        req.sightings = await db.one(`SELECT * FROM sightings WHERE researcher_id = $/id/`, {
            id
        });
        next()
    } catch (error) {
        res.status(404)
        res.json({
            status: 'error',
            message: 'no sightings recorded',
            payload: null
        });
    }
}

router.get('/researchers/:id', getResearcherSightingsById, sendResults);

//get the 
const getHabitatsSightingsById = async (req, res, next) => {
    let id = req.params.id;
    try {
        req.sightings = await db.one(`SELECT * FROM sightings  WHERE habitat_id = $/id/`, {
            id
        });
        next()
    } catch (error) {
        res.status(404)
        res.json({
            status: 'error',
            message: 'no sightings recorded',
            payload: null
        });
    }
}
router.get('/habitats/:id', getHabitatsSightingsById, sendResults)

//query to create new researcher
const queryToRecordSighting = async (req, res, next) => {
    let species_id = req.body.species_id;
    let researcher_id = req.body.researcher_id;
    let habitat_id = req.body.habitat_id;

    try {
        let insertQuery = `
        INSERT INTO sightings(species_id, researcher_id, habitat_id)
            VALUES($/name/, $/jobTitle/) RETURNING *`

        req.newRecord = await db.one(insertQuery, {
            species_id,
            researcher_id,
            habitat_id
        })
        console.log(req.body);
        next()
    } catch (error) {
        if (error.code === "23505" && error.detail.includes("already exists")) {
            let customErr = "Records already exist. Please input a new one.";
            error = customErr;
            res.send({
                status: 'error',
                message: error
                payload: null
            })
        }
        throw error;
    }
}

const sendPostResults = (req, res) => {
    let sighting = req.newRecord;
    res.json({
        status: 'Success',
        payload: sighting,
        message: 'new sighting recorded'
    });
}

router.post('/', queryToRecordSighting, sendPostResults);

//update sighting
const updateSighting = async (req, res, next) => {
    let speciesId = req.body.species_id;
    let researcherId = req.body.researcher_id;
    let habitatId = req.body.habitat_id;
    let id = req.params.id;
    try {
        req.updateSighting = await db.any(`UPDATE sightings SET species_id = $/speciesId/,
         researcher_id = $/researcherId/,habitat_id = $/habitatID/ WHERE id = $/id/ RETURNING * `, {
            speciesId,
            researcherId,
            habitatId,
            id
        });
        next()
    } catch (error) {
        res.status(404)
        res.json({
            status: 'error',
            message: 'no sighting recorder',
            payload: null
        });
        console.log(error);

    }

}

const sendPatchResults = (req, res) => {
    let patch = req.updateSighting;
    res.json({
        status: 'Success',
        message: 'records updated',
        payload: patch,
    });
}

router.patch('/:id/patch', updateSighting, sendPatchResults)

//delete records of sightings
const deleteSighting = async (req, res, next) => {
    let id = req.params.id;
    try {
        req.removeRecord = await db.any(`DELETe FROM sightings WHERE id = $/id/  RETURNING *`, {
            id
        });
        next()
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: 'no records on sighting',
            payload: null
        });
        console.log(error);

    }
}

const sendDeleteResults = (req, res) => {
    let deleted = req.removeRecord;
    res.json({
        status: 'Success',
        message: 'researcher removed from position',
        payload: deleted,
    });
}
router.delete('/:id/delete', deleteSighting, sendDeleteResults)

module.exports = router;