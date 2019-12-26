import React, { Component } from 'react'
import axios from 'axios'
import Display from './display'
class ResearchersSightings extends Component {
    // Initialize the state
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            researcherId: ''
        }
    }

    // Fetch the list on first mount
    componentDidUpdate = (prevProps, prevState) => {
        const { researcherId } = this.state
        if (researcherId !== prevState.researcherId) {
            this.getList()
        }
    }


    handleInput = e => {
        this.setState({
            researcherId: e.target.value
        })
    }
    // Retrieves the list of items from the Express app
    getList = async () => {
        let { researcherId } = this.state
        try {
            const { data } = await axios.get(`http://localhost:3131/sightings/researchers/${Number(researcherId)}`)
            console.log(data.payload);

            this.setState({
                list: data.payload
            })
        } catch (error) {
            console.log(error);

        }
    }

    render() {
        const { list } = this.state;
        console.log(this.state);

        return (
            <div className="App">
                <h1>List of Researchers</h1>
                <input type="number" placeholder='enter researcher id' onChange={this.handleInput} />
                {/* Check to see if any items are found*/}
                {list !== null ? (
                    <div className='container'>
                        <br />
                        {/* Render the list of items */}
                        {list.map((el) => {
                            return (
                                <Display key={el.habitat_id}
                                    researcher_id={el.researcher_id}
                                    researcher_name={el.researcher_name}
                                    job_title={el.job_title}
                                    habitat_id={el.habitat_id}
                                    species_name={el.species_name}

                                />
                            );
                        })}
                    </div>
                ) : (
                        <div>
                            <h2>No List Items Found</h2>
                        </div>
                    )
                }
            </div>
        );
    }
}

export default ResearchersSightings;