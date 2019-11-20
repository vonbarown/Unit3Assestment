const express = require('express');
const router = express();

const {
    db
} = require('../../database/dbPromise.js')

router.get('/researchers', async (req, res) => {
    let researchers;
    try {
        researchers = await db.any(`SELECT * FROM researchers`);
        res.json({
            status: 'Success',
            message: 'retrieved all researchers',
            payload: researchers
        });
    } catch (error) {
        res.status(500)
        res.json({
            status: 'error',
            message: 'researchers not found',
            payload: researchers
        });
    }

});


const getResearcherById = async (req, res, next) => {
    let id = req.params.id;
    try {
        req.researcher = await db.one(`SELECT * FROM researchers WHERE id = $/id/`, {
            id
        });
        next()
    } catch (error) {
        res.status(404)
        res.json({
            status: 'error',
            message: 'researcher not found',
            payload: null
        });
    }
}

const sendResults = (req, res) => {
    let researcher = req.researcher;
    res.json({
        status: 'Success',
        message: 'retrieved single researcher',
        payload: researcher,
    });
}

router.get('/researchers/:id', getResearcherById, sendResults)

//query to create new researcher
const queryCreateResearcher = async (req, res, next) => {
    let name = req.body.researcher_name;
    let jobTitle = req.body.job_title;
    try {
        let insertQuery = `
        INSERT INTO researchers (researcher_name, job_title)
            VALUES($/name/, $/jobTitle/) RETURNING *`

        req.newResearcher = await db.one(insertQuery, {
            name,
            jobTitle
        })
        console.log(req.body);
        next()
    } catch (error) {
        if (error.code === "23505" && error.detail.includes("already exists")) {
            let customErr = "Researcher already exist. Please input a new one.";
            error = customErr;
            res.send({
                status: 'error',
                message: error
            })
        }
        throw error;
    }
}

const sendPostResults = (req, res) => {
    let researcher = req.newResearcher;
    res.json({
        status: 'Success',
        payload: researcher,
        message: 'new researcher added to expedition'
    });
}

router.post('/researchers', queryCreateResearcher, sendPostResults);

const patchResearcher = async (req, res, next) => {
    let name = req.body.researcher_name;
    let jobTitle = req.body.job_title;
    let id = req.params.id;
    try {
        req.patchResearcher = await db.one(`UPDATE researchers SET researcher_name = $/name/ OR
         job_title = $/jobTitle/ WHERE id = $/id/ RETURNING * `, {
            name,
            jobTitle,
            id
        });
        next()
    } catch (error) {
        res.status(404)
        res.json({
            status: 'error',
            message: 'researcher not found',
            payload: null
        });
        console.log(error);

    }

}

const sendPatchResults = (req, res) => {
    let patch = req.patchResearcher;
    res.json({
        status: 'Success',
        payload: patch,
        message: 'researcher information updated',
    });
}

router.patch('/researchers/:id', patchResearcher, sendPatchResults)

const deleteResearcher = async (req, res, next) => {
    let id = req.params.id;
    try {
        req.removeResearcher = await db.any(`DELETE FROM researchers WHERE id = $/id/  RETURNING *`, {
            id
        });
        next()
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: 'researcher not found',
            payload: null
        });
        console.log(error);

    }
}

const sendDeleteResults = (req, res) => {
    let patch = req.removeResearcher;
    res.json({
        status: 'Success',
        payload: patch,
        message: 'researcher removed from position',
    });
}
router.delete('/researchers/:id', deleteResearcher, sendDeleteResults)

module.exports = router;