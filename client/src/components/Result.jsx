import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score } = location.state;

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Quiz Completed!</h1>
      <p className="text-2xl">Your Score: {score}</p>
      <button
        onClick={() => navigate('/')}
        className="bg-blue-500 text-white px-6 py-3 rounded-md mt-6"
      >
        Go Home
      </button>
    </div>
  );
};

export default Results;