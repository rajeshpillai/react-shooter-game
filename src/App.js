import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './App.css';
import {Game} from './models/game.js';

class App extends Component {
  
  componentDidMount() {
    let screen = ReactDOM.findDOMNode(this.game).getContext("2d");
    new Game(screen);
  }
  render() {
    return (
      <div>
        <canvas  ref={(input) => {this.game = input;}} width="400" height="300">
        </canvas>
        
      </div>
    );
  }
}

export default App;
