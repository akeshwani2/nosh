import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Search.css';
import BackButton from './BackButton';
import './BackButton.css';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const { partySize } = location.state || { partySize: 1 };

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Navigating to map with:", { searchTerm, partySize });
    navigate('/map', { state: { searchTerm, partySize } });
  };

  return (
    <div className="container">
      <h2>What are you looking for?</h2>
      <BackButton />
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="e.g., Italian restaurant, sports bar"
          className='search-box'
        />
        <button type="submit" disabled={!searchTerm.trim()}>Search</button>
      </form>
    </div>
  );
}

export default Search;
