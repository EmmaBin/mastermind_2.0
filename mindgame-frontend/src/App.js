import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import GameBoard from './components/Gameboard';
import NewGame from './components/NewGame';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/game" element={<GameBoard />} />
          <Route path="/game/:gameId" element={<NewGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;