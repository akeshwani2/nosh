import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './GlobalStyles.css';
import Home from './components/Home';
import Search from './components/Search';
import NeighborhoodMap from './components/NeighborhoodMap';
import './App.css';

function App() {
  console.log('Home:', Home);
  console.log('Search:', Search);
  console.log('NeighborhoodMap:', NeighborhoodMap);

  return (
    <Router>
      <div className="App">
        <Link to="/" className="logo-link">
          <h1 className="logo">nosh</h1>
        </Link>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/map" element={<NeighborhoodMap />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
