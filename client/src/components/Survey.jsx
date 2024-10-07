import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Survey() {
  const [form, setForm] = useState({
    respondent_id: "",
    respondent_name: "",
    respondent_role: "",
    org_name: "",
    field: "",
    staff_size: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  const [respondentId, setRespondentId] = useState("");

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);
      const response = await fetch(`http://localhost:5050/respondent/${id}`);
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(record);
      setRespondentId(record._id);
    }
    fetchData();
  }, [params.id, navigate]);

  function updateForm(value) {
    setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const person = { ...form };
    try {
      let response;
      if (isNew) {
        response = await fetch("http://localhost:5050/respondent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      } else {
        response = await fetch(`http://localhost:5050/respondent/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("A problem occurred adding or updating a record: ", error);
    }
  }

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

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

  const handleAnswerSelection = (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption.score > 0) {
      setScore((prevScore) => prevScore + selectedOption.score);
    }

    setSelectedOptions((prev) => {
      const newSelectedOptions = [...prev];
      newSelectedOptions[currentQuestionIndex] = selectedOption.text;
      return newSelectedOptions;
    });

    setAnsweredQuestions((prev) => {
      const newAnsweredQuestions = new Set(prev);
      newAnsweredQuestions.add(currentQuestionIndex);
      return newAnsweredQuestions;
    });
  };

  const handleNextQuestion = () => {
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      saveQuizResults(selectedOptions[currentQuestionIndex]?.score || 0);
      setIsQuizFinished(true);
    }
  };

  const saveQuizResults = async (lastQuestionScore) => {
    const finalScore = score + lastQuestionScore;

    const result = {
      respondent_id: respondentId,
      questions: questions.map((question, index) => ({
        _id: question._id,
        score: selectedOptions[index]
          ? question.options.find((option) => option.text === selectedOptions[index])?.score || 0
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
    } catch (error) {
      console.error("Error saving quiz results:", error);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsQuizFinished(false);
    setSelectedOptions([]);
    setAnsweredQuestions(new Set());
  };

  const renderNavigationButtons = () => {
  // Group the questions into rows of 10 buttons each
  const rows = [];
  for (let i = 0; i < questions.length; i += 10) {
    rows.push(questions.slice(i, i + 10));
  }

  return (
    <div className="navigation-buttons mb-4">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="mb-2">
          {row.map((_, index) => {
            // Calculate the overall index of the button
            const overallIndex = rowIndex * 10 + index;
            return (
              <button
                key={overallIndex}
                onClick={() => setCurrentQuestionIndex(overallIndex)}
                className={`p-2 m-1 border rounded-md transition duration-300 ease-in-out ${
                  overallIndex === questions.length - 1 ? "w-20" : "w-10"
                } hover:bg-tertiary ${
                  answeredQuestions.has(overallIndex)
                    ? "bg-amber-400"
                    : "bg-white"
                }`}
              >
                {overallIndex === questions.length - 1
                  ? "Kết thúc"
                  : `${overallIndex + 1}`}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
  };

  const renderQuestion = () => {
    if (questions.length === 0) return <p>Loading questions...</p>;
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <div className="quiz-question mt-20 grid grid-cols-1 gap-y-10 pb-10 md:grid-cols-2">
        <div className="p-6 mx-auto bg-white rounded-lg shadow-lg">
          <h2 className="text-xl text-left font-semibold mb-6">
            {currentQuestion.question_text}
          </h2>
          <div className="options-container mb-4">
            {currentQuestionIndex === questions.length - 1 ? (
              <p className="text-lg text-gray-600 my-20">
                Đến đây là kết thúc bài khảo sát. Bạn hãy nhấn <span className="font-semibold">Kết thúc</span> để nhận kết quả.
              </p>
            ) : (
              currentQuestion.options.map((option, index) => (
                <label key={index} className="flex items-center p-2 mb-3 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition duration-300 ease-in-out">
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={option.text}
                    checked={selectedOptions[currentQuestionIndex] === option.text}
                    onChange={() => handleAnswerSelection(option)}
                    className="mr-3 h-4 w-4 accent-primary"
                  />
                  <span className="text-md text-gray-700">{option.text}</span>
                </label>
              ))
            )}
          </div>
          <button
            onClick={handleNextQuestion}
            className={`w-full py-3 mt-4 text-lg rounded-lg transition-colors ${
              currentQuestionIndex === questions.length - 1 ? "bg-primary hover:bg-red-800" : "bg-sky-500 hover:bg-sky-600"
            } text-white shadow-md`}
          >
            {currentQuestionIndex === questions.length - 1 ? "Kết thúc" : "Câu hỏi tiếp theo"}
          </button>
        </div>
          {renderNavigationButtons()}
      </div>
    );
  };

  const renderResult = () => {navigate(`/result/${respondentId}`);}

  const handleCopyId = () => {
    if (form?._id) {
      navigator.clipboard.writeText(form._id)
        .then(() => {
          alert('Survey ID copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="border rounded-md overflow-hidden p-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 pb-12 md:grid-cols-2">
        <div>
          <h1 className="text-xl font-bold">'{form._id}' là mã khảo sát của bạn. <span><button
            onClick={handleCopyId}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-primary hover:text-white h-8 rounded-md px-2 cursor-pointer"
          >
            Copy
          </button></span></h1>
          
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Lưu ý: <br />
            Bạn nhớ lưu lại mã khảo sát để tra cứu kết quả.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="sm:col-span-4">
              <label
                htmlFor="respondent_name"
                className="block text-md font-medium leading-6 text-slate-900"
              >
                Tên người khảo sát
              </label>
              <div className="mt-2">
                <div className="flex text-md max-w-md rounded-sm border-b border-secondary">
                  <input
                    type="text"
                    name="respondent_name"
                    id="respondent_name"
                    className="flex-1 border-0 py-2 pl-2 text-slate-900 placeholder:text-slate-400"
                    placeholder="Name of the respondent"
                    value={form.respondent_name}
                    onChange={(e) => updateForm({ respondent_name: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="respondent_role"
                className="block text-md font-medium leading-6 text-slate-900"
              >
                Chức vụ
              </label>
              <div className="mt-2">
                <div className="flex text-md max-w-md rounded-sm border-b border-secondary">
                  <input
                    type="text"
                    name="respondent_role"
                    id="respondent_role"
                    className="flex-1 border-0 py-2 pl-2 text-slate-900 placeholder:text-slate-400"
                    placeholder="Role of the respondent"
                    value={form.respondent_role}
                    onChange={(e) => updateForm({ respondent_role: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="org_name"
                className="block text-md font-medium leading-6 text-slate-900"
              >
                Tên tổ chức
              </label>
              <div className="mt-2">
                <div className="flex text-md max-w-md rounded-sm border-b border-secondary">
                  <input
                    type="text"
                    name="org_name"
                    id="org_name"
                    className="flex-1 border-0 py-2 pl-2 text-slate-900 placeholder:text-slate-400"
                    placeholder="Name of the organization"
                    value={form.org_name}
                    onChange={(e) => updateForm({ org_name: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="field"
                className="block text-md font-medium leading-6 text-slate-900"
              >
                Lĩnh vực
              </label>
              <div className="mt-2">
                <div className="flex text-md max-w-md rounded-sm border-b border-secondary">
                  <input
                    type="text"
                    name="field"
                    id="field"
                    className="flex-1 border-0 py-2 pl-2 text-slate-900 placeholder:text-slate-400"
                    placeholder="Business field"
                    value={form.field}
                    onChange={(e) => updateForm({ field: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="staff_size"
                className="block text-md font-medium leading-6 text-slate-900"
              >
                Số lượng nhân viên
              </label>
              <div className="mt-2">
                <div className="flex text-md max-w-md rounded-sm border-b border-secondary">
                  <input
                    type="text"
                    name="staff_size"
                    id="staff_size"
                    className="flex-1 border-0 py-2 pl-2 text-slate-900 placeholder:text-slate-400"
                    placeholder="Staff size"
                    value={form.staff_size}
                    onChange={(e) => updateForm({ staff_size: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Lưu thông tin"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-primary hover:text-white h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
      <div className="quiz-container text-center">
      {isQuizFinished ? renderResult() : renderQuestion()}
      </div>
    </>
  );
}
