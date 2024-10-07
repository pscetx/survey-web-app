import React, { useEffect, useState } from "react";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [respondentId, setRespondentId] = useState("12345");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set()); // Track answered questions

  // Fetch the quiz questions from the backend.
  useEffect(() => {
    async function fetchQuestions() {
      const response = await fetch(`http://localhost:5050/question`);
      if (!response.ok) {
        console.error("Failed to fetch questions");
        return;
      }
      const data = await response.json();
      setQuestions(data);
    }
    fetchQuestions();
  }, []);

  // Handle answer selection and update score
  const handleAnswerSelection = (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];

    // Update score if selected option has a score
    if (selectedOption.score > 0) {
      setScore((prevScore) => prevScore + selectedOption.score);
    }

    // Save the selected option for the current question
    setSelectedOptions((prev) => {
      const newSelectedOptions = [...prev];
      newSelectedOptions[currentQuestionIndex] = selectedOption.text; // Save the text of the selected option
      return newSelectedOptions;
    });

    // Mark the question as answered
    setAnsweredQuestions((prev) => {
      const newAnsweredQuestions = new Set(prev);
      newAnsweredQuestions.add(currentQuestionIndex); // Add current question index to answered set
      return newAnsweredQuestions;
    });
  };

  // Move to the next question or finish the quiz
  const handleNextQuestion = () => {
    const nextQuestionIndex = currentQuestionIndex + 1;

    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      // Save the results at the end of the quiz
      saveQuizResults(selectedOptions[currentQuestionIndex]?.score || 0);
      setIsQuizFinished(true); // Set the quiz as finished
    }
  };

  // Save the quiz results to the backend
  const saveQuizResults = async (lastQuestionScore) => {
    const finalScore = score + lastQuestionScore;

    const result = {
      respondent_id: respondentId,
      questions: questions.map((question, index) => ({
        _id: question._id,
        score: selectedOptions[index]
          ? question.options.find(option => option.text === selectedOptions[index])?.score || 0
          : 0,
      })),
    };

    try {
      const response = await fetch(`http://localhost:5050/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      });

      if (!response.ok) {
        console.error("Failed to save results", await response.text());
        return;
      }

      console.log("Quiz results saved successfully");
      // Removed the redirect to /results
    } catch (error) {
      console.error("Error saving quiz results:", error);
    }
  };

  // Restart the quiz (optional functionality)
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsQuizFinished(false);
    setSelectedOptions([]); // Reset selected options on restart
    setAnsweredQuestions(new Set()); // Reset answered questions on restart
  };

  // Render navigation buttons for each question
  const renderNavigationButtons = () => (
    <div className="navigation-buttons mb-4">
      {questions.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentQuestionIndex(index)}
          className={`p-2 m-1 rounded-md hover:bg-gray-400 ${
            answeredQuestions.has(index) ? "bg-green-300" : "bg-gray-300" // Change color if answered
          }`}
        >
          {index === questions.length - 1 ? "Finish" : `Question ${index + 1}`} {/* Change text for the last question */}
        </button>
      ))}
    </div>
  );

  // Render the current question
  const renderQuestion = () => {
    if (questions.length === 0) return <p>Loading questions...</p>;

    const currentQuestion = questions[currentQuestionIndex];
    return (
      <div className="quiz-question">
        {renderNavigationButtons()} {/* Add navigation buttons here */}
        <h2 className="text-2xl mb-4">{currentQuestion.question_text}</h2>
        <div className="options-container">
          {currentQuestionIndex === questions.length - 1 ? ( // Check if it's the last question
            <p>You have reached the final question. Click Finish to complete the quiz.</p> // Informative message
          ) : (
            currentQuestion.options.map((option, index) => (
              <label key={index} className="block mb-2">
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={option.text}
                  checked={selectedOptions[currentQuestionIndex] === option.text} // Check if this option is selected
                  onChange={() => handleAnswerSelection(option)} // Call the selection handler on change
                  className="mr-2"
                />
                {option.text}
              </label>
            ))
          )}
        </div>
        <button
          onClick={handleNextQuestion}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"} {/* Change button text on last question */}
        </button>
      </div>
  );
  };

  // Render the quiz result
  const renderResult = () => (
    <div className="quiz-result">
      <h2 className="text-2xl mb-4">Quiz Finished!</h2>
      <h3 className="text-lg mb-2">Your Answers:</h3>
      <ul className="list-disc list-inside">
        {questions.slice(0, questions.length - 1).map((question, index) => ( // Exclude the last question
          <li key={index}>
            <strong>{question.question_text}</strong>: {selectedOptions[index] || "No answer"}
          </li>
        ))}
      </ul>
      <button onClick={restartQuiz} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
        Restart Quiz
      </button>
    </div>
  );

  return (
    <div className="quiz-container text-center">
      {isQuizFinished ? renderResult() : renderQuestion()}
    </div>
  );
};

export default Quiz;
