import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedOptions, questions } = location.state; // Get selectedOptions and questions from location state

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Quiz Completed!</h1>
      <h3 className="text-2xl mb-4">Your Answers:</h3>
      <ul className="list-disc list-inside mx-auto max-w-lg">
        {questions.map((question, index) => (
          <li key={index} className="text-lg mb-2">
            <strong>{question.question_text}</strong>: {selectedOptions[index] || "No answer"}
          </li>
        ))}
      </ul>
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
