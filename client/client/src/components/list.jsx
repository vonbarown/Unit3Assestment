import React, { Component } from 'react'
import axios from 'axios'
class List extends Component {
    // Initialize the state
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }
    }

    // Fetch the list on first mount
    componentDidMount() {
        this.getList();
    }

    // Retrieves the list of items from the Express app
    getList = async () => {
        // fetch('http://localhost:3131/species')
        //     .then(res => res.json())
        //     .then(list => this.setState({ list }))
        try {
            const data = await axios.get('http://localhost:3131/species')

            this.setState({
                list: data
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
                <h1>List of Items</h1>
                {/* Check to see if any items are found*/}
                {list.length ? (
                    <div>
                        {/* Render the list of items */}
                        {list.map((item) => {
                            return (
                                <div>
                                    {item}
                                </div>
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

export default List;