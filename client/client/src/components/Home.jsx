
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
                <Link to={'../components/list'} />
                <h1>Home is where the whale is</h1>
            </div>
        )
    }
}

export default Home;