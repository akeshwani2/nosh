import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [partySize, setPartySize] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/search', { state: { partySize } });
  };

  const decrementPartySize = () => {
    if (partySize > 1) {
      setPartySize(partySize - 1);
    }
  };

  const incrementPartySize = () => {
    if (partySize < 25) {
      setPartySize(partySize + 1);
    }
  };

  return (
    <div className="container home-container">
      <h1>Welcome to Nosh</h1>
      <p>Find and reserve tables at your favorite restaurants</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="partySize">How many people are in your party?</label>
        <div className="party-size-counter">
          <button type="button" onClick={decrementPartySize} className="counter-button">-</button>
          <span className="party-size">{partySize}</span>
          <button type="button" onClick={incrementPartySize} className="counter-button">+</button>
        </div>
        <button type="submit" className="find-restaurants-button">Party on!</button>
      </form>
    </div>
  );
}

export default Home;
