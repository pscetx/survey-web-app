import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const questions = [
    {
      question: 'What is the capital of France?',
      options: ['Paris', 'London', 'Rome', 'Berlin'],
      answer: 'Paris'
    },
    {
      question: 'Who wrote "Hamlet"?',
      options: ['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Jane Austen'],
      answer: 'William Shakespeare'
    },
    // Add more questions here
  ];

  const handleAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      navigate('/results', { state: { score } });
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl mb-4">{questions[currentQuestion].question}</h2>
      <div className="flex flex-col items-center">
        {questions[currentQuestion].options.map((option, index) => (
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
};

export default Quiz;
