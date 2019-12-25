import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import List from './pages/List';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Are you a cat person or a dog person?</h1>
        <nav>
          <Link to="/">Home</Link>{" "}
          <Link to="/dog">Dog</Link>{" "}
          <Link to="/cat">Cat</Link>{" "}
        </nav>

        <Switch>
          <Route exact path="/" component={Home} />

        </Switch>
      </div>
    );
  }
}

export default App;
