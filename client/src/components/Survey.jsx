import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "./Loader";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Result() {
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
          &lt; Trước
        </button>
        <button
          onClick={() => handleColorChange(currentQuestionIndex)}
          className={`py-2 px-3 rounded-lg transition-colors ${
            currentQuestionIndex === result.questions.length - 1 ? "hidden" : "border border-amber-500 transition duration-300 ease-in-out hover:bg-amber-500"
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
                Sau khi nhấn '<span className="font-semibold">Hoàn tất khảo sát</span>' bạn sẽ không thể tiếp tục làm bài khảo sát này và sẽ được chuyển đến trang kết quả.
              </p>
            ) : (
              questionDetails.options.map((option, index) => (
                <label key={`${option._id}-${index}`} className="flex items-center p-3 mb-3 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:scale-105 transition duration-300 ease-in-out">
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
        <h2 className="text-2xl font-bold text-primary text-left mb-2">BỘ CÔNG CỤ KHẢO SÁT AN TOÀN THÔNG TIN DÀNH CHO DOANH NGHIỆP VỪA VÀ NHỎ</h2>
        <h1 className="text-lg text-left mb-10"><span className="font-semibold">Mã khảo sát của bạn là</span><span className="inline-flex items-center justify-center whitespace-nowrap text-sm text-secondary font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-tertiary h-8 rounded-md px-1 mx-1">{form._id}</span><span><button
            onClick={handleCopyId}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-primary hover:text-white h-8 rounded-md px-2 cursor-pointer"
          >
            Copy
          </button></span></h1>
        {renderQuestion()}
      </div>
      <h2 className="text-2xl mb-4 font-bold text-primary mt-12">THÔNG TIN KHẢO SÁT</h2>
      <form onSubmit={onSubmit} className="border rounded-md overflow-hidden p-4">
        <div className="grid grid-cols-1 gap-x-32 gap-y-8 pb-4 lg:grid-cols-2">
        <div>
          <h1><span className="font-bold text-lg">Mã khảo sát</span> <span className="inline-flex items-center justify-center whitespace-nowrap text-sm text-secondary font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-tertiary h-8 rounded-md px-1 mx-1">{form._id}</span><span><button
            onClick={handleCopyId}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-primary hover:text-white h-8 rounded-md px-2 cursor-pointer"
          >
            Copy
          </button></span></h1>
          
          <div className="mt-1 text-sm leading-6 text-slate-600">
              <div className="italic font-semibold">
                Lưu ý:
            </div>
            Bạn nhớ lưu lại mã khảo sát để tra cứu kết quả.<br />
            Sau khi bấm nút 'Hoàn tất khảo sát' bạn sẽ không thể sửa thông tin tiền khảo sát hay thay đổi các câu trả lời của mình.<br />
            </div>
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
                <div className="flex text-md max-w-lg rounded-sm border-b border-secondary">
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
                <div className="flex text-md max-w-lg rounded-sm border-b border-secondary">
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
                <div className="flex text-md max-w-lg rounded-sm border-b border-secondary">
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
                <div className="flex text-md max-w-lg rounded-sm border-b border-secondary">
                  <select
                    name="field"
                    id="field"
                    className="flex-1 border-0 py-2 pl-2 text-slate-900 placeholder:text-slate-400"
                    value={form.field}
                    onChange={(e) => updateForm({ field: e.target.value })}
                    required
                  >
                    <option value="" disabled>Business field</option>
                    <option value="An ninh quốc phòng">An ninh quốc phòng</option>
                    <option value="Tư pháp">Tư pháp</option>
                    <option value="Tài chính">Tài chính</option>
                    <option value="Công Thương">Công Thương</option>
                    <option value="Lao động, Thương Binh và Xã hội">Lao động, Thương Binh và Xã hội</option>
                    <option value="Giao thông vận tải">Giao thông vận tải</option>
                    <option value="Xây dựng">Xây dựng</option>
                    <option value="Thông tin và Truyền thông">Thông tin và Truyền thông</option>
                    <option value="Giáo dục và Đào tạo">Giáo dục và Đào tạo</option>
                    <option value="Nông nghiệp và Phát triển nông thôn">Nông nghiệp và Phát triển nông thôn</option>
                    <option value="Y tế">Y tế</option>
                    <option value="Khoa học và Công nghệ">Khoa học và Công nghệ</option>
                    <option value="Văn hóa, Thể thao và Du lịch">Văn hóa, Thể thao và Du lịch</option>
                    <option value="Tài nguyên và Môi trường">Tài nguyên và Môi trường</option>
                    <option value="Ngân hàng">Ngân hàng</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="staff_size"
                className="block text-md font-medium leading-6 text-slate-900"
              >
                Số lượng nhân viên mảng CNTT
              </label>
              <div className="mt-2">
                <div className="flex text-md max-w-lg rounded-sm border-b border-secondary">
                  <input
                    type="number"
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
            <input
              type="submit"
              value="Lưu thông tin"
              className="text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-primary hover:text-white h-9 w-40 rounded-md cursor-pointer"
            />
          </div>
        </div> 
      </form>
    </div>
  );
}
