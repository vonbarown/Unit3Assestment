import React from 'react'


const Display = (props) => {
    const { researcher_id, researcher_name, job_title, habitat_id, species_name } = props
    return (
        <div className='display'>
            <p>Researcher name:{researcher_name}{'  '} Id:{researcher_id}</p>
            <p>Researcher title:{job_title}</p>
            <p>Habitat Id:{habitat_id}</p>
            <p> Species Name:{species_name}</p>
        </div>
    )
}

export default Display;