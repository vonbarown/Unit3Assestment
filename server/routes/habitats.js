const express = require('express');
const router = express();

const {
    db
} = require('../../database/dbPromise.js')

router.get('/habitats', async (req, res) => {
    let habitats;
    try {
        habitats = await db.any(`SELECT * FROM habitats`);
        res.json({
            status: 'Success',
            message: 'retrieved all habitats',
            payload: habitats
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'habitats not found',
            payload: habitats
        });
    }
});


const getHabitatsById = async (req, res, next) => {
    let id = req.params.id;
    try {
        req.habitats = await db.one(`SELECT * FROM habitats WHERE id = $/id/`, {
            id
        });
        next()
    } catch (error) {
        res.status(404)
        res.json({
            status: 'error',
            message: 'habitats not found',
            payload: null
        });
        console.log(error);

    }
}

const sendResults = (req, res) => {
    let habitats = req.habitats;
    res.json({
        status: 'Success',
        message: 'retrieved single habitats',
        payload: habitats,
    });
}

router.get('/habitats/:id', getHabitatsById, sendResults)

//query to create new habitat
const queryAddNewHabitats = async (req, res, next) => {
    let category = req.body.category;
    try {
        let insertQuery = `
        INSERT INTO habitats(category)
            VALUES($/category/) RETURNING *`

        req.habitat = await db.one(insertQuery, {
            category
        })
        console.log(req.body);
        next()
    } catch (error) {
        if (error.code === "23505" && error.detail.includes("already exists")) {
            let customErr = "Habitats already exist. Please input a new one.";
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
    let habitat = req.habitat;
    res.json({
        status: 'Success',
        payload: habitat,
        message: 'new habitats added to collection',
    });
}

router.post('/habitats', queryAddNewHabitats, sendPostResults);

module.exports = router;