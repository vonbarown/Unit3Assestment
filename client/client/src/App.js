import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import ResearchersSightings from './components/researcherSightings';

class App extends Component {
  render() {
    return (
      <div>
        <nav>
          <Link to="/">Home</Link>{" "}
          <Link to='/list'>List</Link>
        </nav>

        <Switch>
          <Route exact path="/" component={Home} />
          <Route path='/list' component={ResearchersSightings} />
        </Switch>
      </div>
    );
  }
}

export default App;
