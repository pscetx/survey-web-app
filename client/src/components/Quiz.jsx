import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Quiz() {
  const [records, setRecords] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  // Fetch the questions from the backend and set the records state.
  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch(`http://localhost:5050/question/`);
        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          console.error(message);
          return;
        }
        const fetchedRecords = await response.json();
        setRecords(fetchedRecords);
      } catch (error) {
        console.error("Failed to fetch records: ", error);
      }
    }
    getRecords();
    return;
  }, [records.length]);

  // Handle the answer selection
  const handleAnswer = (selectedOption) => {
    if (selectedOption === records[currentQuestion]?.answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < records.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      navigate('/results', { state: { score } });
    }
  };

  // Display a loading message while the records are being fetched.
  if (records.length === 0) {
    return <div>Loading...</div>;
  }

  // Render the quiz questions dynamically based on the records state.
  return (
    <div className="text-center">
      <h2 className="text-2xl mb-4">{records[currentQuestion]?.question}</h2>
      <div className="flex flex-col items-center">
        {records[currentQuestion]?.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="bg-gray-200 p-2 m-2 w-1/4 text-left"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
