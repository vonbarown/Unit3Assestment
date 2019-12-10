const { db } = require("../../database/dbPromise.js");

const getSightings = async (param, id) => {

    try {
        const sqlQuery = `
         SELECT
         sightings.researcher_id, researchers.researcher_name, researchers.job_title,
             sightings.species_id, species.species_name, species.is_mammal,
             sightings.habitat_id, habitats.category
         FROM
         sightings
         INNER JOIN researchers ON researchers.id = sightings.researcher_id
         INNER JOIN species ON species.id = sightings.species_id
         INNER JOIN habitats ON habitats.id = sightings.habitat_id

         WHERE ${param}.id = $/id/

        `

        console.log(sqlQuery);

        const sightings = await db.any(sqlQuery, { id })


        return sightings
    } catch (error) {
        throw (error)

    }
}

module.exports = { getSightings }