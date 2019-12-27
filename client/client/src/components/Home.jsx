
import React, { Component } from 'react';
// import BreedSelector from './BreedSelector'

class Home extends Component {
    constructor() {
        super();
        this.state = {
            breed: ''
        }
    }



    render() {
        return (
            <div className="Home">
                <h1>Home is where the whale is</h1>
            </div>
        )
    }
}

export default Home;