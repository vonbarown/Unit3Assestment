import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
// import List from './pages/List';

class App extends Component {
  render() {
    return (
      <div>
        <nav>
          <Link to="/">Home</Link>{" "}

        </nav>

        <Switch>
          <Route exact path="/" component={Home} />

        </Switch>
      </div>
    );
  }
}

export default App;
