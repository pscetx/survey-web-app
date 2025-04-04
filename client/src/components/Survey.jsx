import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "./Loader";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Result() {
  const [form, setForm] = useState({
    respondent_id: "",
    respondent_email: "",
    respondent_name: "",
    respondent_role: "",
    org_name: "",
    field: "",
    staff_size: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);
      const response = await fetch(`${API_BASE_URL}/respondent/${id}`);
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
        response = await fetch(`${API_BASE_URL}/respondent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/respondent/${params.id}`, {
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

  const handleCopyId = () => {
    if (form?._id) {
      navigator.clipboard.writeText(form._id)
        .then(() => {
          alert('Mã khảo sát đã được sao chép!');
        })
        .catch(err => {
          console.error('Error while copying: ', err);
        });
    }
  };
  
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [questionsMap, setQuestionsMap] = useState({});
  const [respondent, setRespondent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [coloredButtons, setColoredButtons] = useState(new Set());
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

  const handleColorChange = (index) => {
    setColoredButtons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchResult() {
      try {
        const response = await fetch(`${API_BASE_URL}/answer/${id}`);
        if (!response.ok) {
          throw new Error(`Error fetching results: ${response.statusText}`);
        }
        const data = await response.json();

        if (data.is_finished) {
          alert("Khảo sát đã hoàn thành.");
          navigate("/");
          return;
        }

        if (isMounted) {
          setResult(data);
          await fetchQuestions(data.questions);
          await fetchRespondent(data.respondent_id);
        }
      } catch (error) {
        if (isMounted) setError("Survey code not found in the database.");
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    async function fetchQuestions(questions) {
      try {
        const fetchRequests = questions.map((question) =>
          fetch(`${API_BASE_URL}/question/${question._id}`)
        );

        const responses = await Promise.all(fetchRequests);
        const questionsData = await Promise.all(responses.map((res) => res.json()));

        const questionsMap = questionsData.reduce((acc, question) => {
          acc[question._id] = question;
          return acc;
        }, {});

        setQuestionsMap(questionsMap);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to fetch questions.");
      }
    }

    async function fetchRespondent(respondentId) {
      try {
        const response = await fetch(`${API_BASE_URL}/respondent/${respondentId}`);
        if (!response.ok) {
          throw new Error(`Error fetching respondent: ${response.statusText}`);
        }
        const data = await response.json();
        setRespondent(data);
      } catch (error) {
        console.error("Error fetching respondent:", error);
        setError("Failed to fetch respondent.");
      }
    }
    fetchResult();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleOptionChange = async (questionId, newScore, respondentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/answer/updateScore`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respondent_id: respondentId, question_id: questionId, new_score: newScore }),
      });

      if (!response.ok) {
        throw new Error(`Error updating score: ${response.statusText}`);
      }

      setResult((prevState) => ({
        ...prevState,
        questions: prevState.questions.map((question) =>
          question._id === questionId ? { ...question, score: newScore } : question
        ),
      }));

      setAnsweredQuestions((prev) => new Set(prev).add(questionId));
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const handleStatusChange = async (respondentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/answer/finished/${respondentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_finished: true }),
      });
      if (!response.ok) {
        throw new Error(`Error updating status: ${response.statusText}`);
      }
      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const renderNavigationButtons = () => {
  if (!result) return null;

  const rows = [];
  for (let i = 0; i < result.questions.length; i += 8) {
    rows.push(result.questions.slice(i, i + 8));
  }

  return (
    <div className="navigation-buttons mt-8">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="mb-2">
          {row.map((_, index) => {
            const overallIndex = rowIndex * 8 + index;
            const isAnswered = answeredQuestions.has(result.questions[overallIndex]._id);
            return (
              <button
                key={overallIndex}
                onClick={() => setCurrentQuestionIndex(overallIndex)}
                onDoubleClick={() => handleColorChange(overallIndex)}
                className={`p-2 m-1 font-semibold border rounded-md transition duration-300 ease-in-out ${
                  overallIndex === result.questions.length - 1 ? "h-15 rounded-lg hover:text-primary hover:border-primary" : "w-8"
                } hover:bg-slate-50 ${coloredButtons.has(overallIndex) ? 'bg-amber-500' : isAnswered ? 'bg-sky-100' : 'bg-white'} ${
                  overallIndex === currentQuestionIndex ? 'underline' : ''
                }`}
              >
                {overallIndex === result.questions.length - 1 ? "Kết thúc" : `${overallIndex + 1}`}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

  const renderNavigationButtons2 = () => {
    return (
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`py-2 px-4 rounded-lg transition-colors ${
            currentQuestionIndex === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-500"
          } text-white shadow-sm`}
        >
          {currentQuestionIndex === result.questions.length - 1 ? "< Quay lại" : "< Trước"}
        </button>
        <button
          onClick={() => handleColorChange(currentQuestionIndex)}
          className={`py-2 px-3 rounded-lg transition-colors ${
            currentQuestionIndex === result.questions.length - 1 ? "hidden" : "border border-gray-300 transition duration-300 ease-in-out hover:border-amber-500"
          } shadow-sm`}
        >
          Đánh dấu
        </button>
        <button
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === result.questions.length - 2}
          className={`py-2 px-4 rounded-lg transition-colors ${
            currentQuestionIndex === result.questions.length - 1 ? "bg-primary hover:bg-red-600" : 
            currentQuestionIndex === result.questions.length - 2 ? "bg-gray-400 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-500"
          } text-white shadow-sm`}
        >
          {currentQuestionIndex === result.questions.length - 1 ? "Hoàn tất khảo sát" : "Tiếp >"}
        </button>
      </div>
    );
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < result.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      try {
        await handleStatusChange(result.respondent_id);
        navigate(`/result/${result.respondent_id}`);
      } catch (error) {
        console.error("Error finishing the survey:", error);
      }
    }
  };

  const renderQuestion = () => {
    if (!result || !questionsMap || result.questions.length === 0) return <Loader />;

    const currentQuestion = result.questions[currentQuestionIndex];
    const questionDetails = questionsMap[currentQuestion._id];

    if (!questionDetails) return <Loader />;

    return (
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-6">
        <div className="overflow-hidden px-5 lg:col-span-4">
          <h2 className="text-lg text-justify font-bold mb-4">
            {questionDetails.question_text}
          </h2>
          <div className="options-container mb-4">
            {currentQuestionIndex === result.questions.length - 1 ? (
              <p className="text-lg text-gray-600 my-20">
                LƯU Ý: Sau khi nhấn '<span className="font-semibold">Hoàn tất khảo sát</span>' bạn sẽ không thể tiếp tục làm bài khảo sát này và sẽ được chuyển đến trang kết quả.
              </p>
            ) : (
              questionDetails.options.map((option, index) => (
                <label key={`${option._id}-${index}`} className="flex items-center p-3 mb-3 border border-gray-200 rounded-lg shadow-sm hover:border-primary transition duration-300 ease-in-out">
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={option.text}
                    checked={currentQuestion.score === option.score}
                    onChange={() => handleOptionChange(currentQuestion._id, option.score, respondent._id)}
                    className="mr-3 h-4 w-4 accent-primary"
                  />
                  <span className="text-md text-justify text-gray-700">{option.text}</span>
                </label>
              ))
            )}
          </div>
          {renderNavigationButtons2()}
        </div>
        <div className="lg:col-span-2">
          {renderNavigationButtons()}
        </div>
      </div>
    );
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-primary text-xl">{error}</p>;

  return (
    <div className="survey-container">
      <div className="quiz-container text-center">
        <h2 className="text-2xl font-bold text-primary text-left mb-4">BỘ CÔNG CỤ KHẢO SÁT AN TOÀN THÔNG TIN DÀNH CHO DOANH NGHIỆP VỪA VÀ NHỎ</h2>
        <h1 className="text-lg text-left mb-6">Mã khảo sát của bạn là <span className="inline-flex items-center justify-center whitespace-nowrap text-sm text-secondary font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-gray-50 h-8 rounded-md px-1 mr-1">{form._id}</span><span><button
            onClick={handleCopyId}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-primary hover:text-white h-8 rounded-md px-2 cursor-pointer"
          >
            Copy
          </button> và đã được gửi về email đăng ký khảo sát.</span></h1>
        {renderQuestion()}
      </div>
      <h2 className="text-2xl mb-4 font-bold text-primary mt-12">THÔNG TIN KHẢO SÁT</h2>
      <form onSubmit={onSubmit} className="border rounded-md overflow-hidden p-4">
        <div className="grid grid-cols-1 gap-x-20 gap-y-8 pb-4 lg:grid-cols-2">
        <div>

          <div className="mt-1 text-sm leading-6 text-gray-600">
            <div className="italic font-semibold">
              Lưu ý:
            </div>
            Bạn nhớ lưu lại mã khảo sát để tra cứu kết quả.<br />
            Email chứa mã khảo sát thường mất 1-2 phút để gửi.<br />
            Sau khi bấm nút 'Hoàn tất khảo sát' bạn sẽ không thể sửa thông tin khảo sát hay thay đổi các câu trả lời.<br />
            </div>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-4">
            {[
              { label: "Email người khảo sát", name: "respondent_email", type: "email", placeholder: "Thông tin khảo sát sẽ được gửi về email này", disabled: true },
              { label: "Thời gian khảo sát", name: "date", type: "text", disabled: true },
              { label: "Tên người khảo sát", name: "respondent_name", type: "text" },
              { label: "Chức vụ", name: "respondent_role", type: "text" },
              { label: "Tên doanh nghiệp", name: "org_name", type: "text" },
              { label: "Số nhân sự bộ phận công nghệ thông tin", name: "staff_size", type: "number", placeholder: "Không có nhân sự CNTT điền giá trị 0" }
            ].map(({ label, name, type, placeholder, autoComplete, pattern, disabled }) => (
              <div className="sm:col-span-4" key={name}>
                <label htmlFor={name} className="block text-md font-medium leading-6 text-gray-900">
                  {label}
                </label>
                <div className="mt-2">
                  <input
                    type={type}
                    name={name}
                    id={name}
                    className="w-11/12 border border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 transition duration-300 ease-in-out"
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    pattern={pattern}
                    value={form[name]}
                    required
                    onChange={(e) => updateForm({ [name]: e.target.value })}
                    disabled={disabled}
                  />
                </div>
              </div>
            ))}
            <div className="sm:col-span-4">
              <label htmlFor="field" className="block text-md font-medium leading-6 text-slate-900">
                Lĩnh vực kinh doanh
              </label>
              <div className="mt-2">
                <select
                  name="field"
                  id="field"
                  className="w-11/12 border border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition duration-300 ease-in-out"
                  value={form.field}
                  onChange={(e) => updateForm({ field: e.target.value })}
                  required
                >
                  <option value="" disabled>Chọn</option>
                  {["An ninh quốc phòng", "Tư pháp", "Tài chính", "Công Thương", "Lao động, Thương Binh và Xã hội", "Giao thông vận tải", "Xây dựng", "Thông tin và Truyền thông", "Giáo dục và Đào tạo", "Nông nghiệp và Phát triển nông thôn", "Y tế", "Khoa học và Công nghệ", "Văn hóa, Thể thao và Du lịch", "Tài nguyên và Môi trường", "Ngân hàng"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary transition duration-300 ease-in-out mt-4"
          >
            Lưu thông tin
          </button>
        </div>
      </form>
    </div>
  );
}
