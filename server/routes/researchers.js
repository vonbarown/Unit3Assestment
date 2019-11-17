const express = require('express');
const router = express();

const {
    db
} = require('../../database/dbPromise.js')

router.get('/', async (req, res) => {
    let researchers;
    try {
        researchers = await db.any(`SELECT * FROM researchers`);
        res.json({
            status: 'Success',
            message: 'retrieved all researchers',
            payload: {
                data: researchers,
            }
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



module.exports = router;