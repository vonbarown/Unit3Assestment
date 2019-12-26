import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import List from './components/list';

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
          <Route path='/list' component={List} />
        </Switch>
      </div>
    );
  }
}

export default App;
