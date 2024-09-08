import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button className="back-button" onClick={handleBack}>
      ← 
    </button>
  );
}

export default BackButton;