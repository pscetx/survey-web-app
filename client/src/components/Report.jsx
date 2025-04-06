import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
import Loader from "./Loader";

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Report() {
  const [stats, setStats] = useState({
    finishedSurveys: 0,
    bannedSurveys: 0,
    totalRespondents: 0,
    newRespondents: 0,
  });
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionDetails, setQuestionDetails] = useState({});
  const [sortOrder, setSortOrder] = useState("original"); // Default to original order
  const [originalQuestions, setOriginalQuestions] = useState([]);
  const [filterCategory, setFilterCategory] = useState(""); // Default to show all categories
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [respondentDates, setRespondentDates] = useState({});

  useEffect(() => {
    async function fetchStatsAndAnswers() {
      try {
        const [
          finishedResponse,
          bannedResponse,
          respondentsResponse,
          newRespondentsResponse,
          answersResponse,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/answer/count/finished`),
          fetch(`${API_BASE_URL}/answer/count/banned`),
          fetch(`${API_BASE_URL}/respondent/count`),
          fetch(`${API_BASE_URL}/respondent/count/last7days`),
          fetch(`${API_BASE_URL}/answer`),
        ]);

        if (
          !finishedResponse.ok ||
          !bannedResponse.ok ||
          !respondentsResponse.ok ||
          !newRespondentsResponse.ok ||
          !answersResponse.ok
        ) {
          throw new Error("Error fetching data");
        }

        const [
          finishedData,
          bannedData,
          respondentsData,
          newRespondentsData,
          answersData,
        ] = await Promise.all([
          finishedResponse.json(),
          bannedResponse.json(),
          respondentsResponse.json(),
          newRespondentsResponse.json(),
          answersResponse.json(),
        ]);

        // Exclude answers that are banned or not finished and ignore the last question
        const filteredAnswers = answersData.filter(
          (answer) => answer.is_finished && !answer.is_banned
        ).map((answer) => ({
          ...answer,
          questions: answer.questions.slice(0, -1), // Remove the last question
        }));

        // Fetch question details
        const questionIds = [
          ...new Set(filteredAnswers.flatMap((answer) => answer.questions.map((q) => q._id))),
        ];
        const questionDetailsResponses = await Promise.all(
          questionIds.map((id) => fetch(`${API_BASE_URL}/question/${id}`))
        );
        const questionDetailsData = await Promise.all(
          questionDetailsResponses.map((res) => res.json())
        );
        const questionDetailsMap = questionDetailsData.reduce((acc, question) => {
          acc[question._id] = question;
          return acc;
        }, {});

        setStats({
          finishedSurveys: finishedData.finishedSurveys,
          bannedSurveys: bannedData.bannedSurveys,
          totalRespondents: respondentsData.totalRespondents,
          newRespondents: newRespondentsData.respondentsLast7Days,
        });
        setOriginalQuestions(filteredAnswers.flatMap((answer) => answer.questions));
        setAnswers(filteredAnswers);
        setQuestionDetails(questionDetailsMap);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data.");
        setLoading(false);
      }
    }

    fetchStatsAndAnswers();
  }, []);

  useEffect(() => {
    async function fetchRespondentDates() {
      try {
        const respondentIds = [...new Set(answers.map((answer) => answer.respondent_id))];
        const fetchRequests = respondentIds.map((id) =>
          fetch(`${API_BASE_URL}/respondent/${id}`).then((res) => res.json())
        );

        const respondents = await Promise.all(fetchRequests);
        const datesMap = respondents.reduce((acc, respondent) => {
          acc[respondent._id] = respondent.date;
          return acc;
        }, {});

        setRespondentDates(datesMap);
      } catch (error) {
        console.error("Error fetching respondent dates:", error);
      }
    }

    if (answers.length > 0) {
      fetchRespondentDates();
    }
  }, [answers]);

  const getChartDataForQuestion = (questionId) => {
    const scoreCounts = {};
    let totalResponses = 0;

    answers.forEach((answer) => {
      answer.questions.forEach((question) => {
        if (question._id === questionId) {
          scoreCounts[question.score] = (scoreCounts[question.score] || 0) + 1;
          totalResponses++;
        }
      });
    });

    const labels = Object.keys(scoreCounts);
    const data = Object.values(scoreCounts).map((count) => ((count / totalResponses) * 100).toFixed(1));

    return {
      labels: [""], // Single label for stacked bar
      datasets: labels.map((label, index) => ({
        label: `Score ${label}`,
        data: [data[index]],
        backgroundColor: ["#fb6762", "#f366bb", "#8769fd", "#1ac3fb", "#43dd93"][index % 5],
      })),
    };
  };

  const getAverageScoresByCategory = () => {
    const categoryScores = {};
    const categoryCounts = {};

    answers.forEach((answer) => {
      answer.questions.forEach((question) => {
        const category = questionDetails[question._id]?.category || "Uncategorized";
        if (!categoryScores[category]) {
          categoryScores[category] = 0;
          categoryCounts[category] = 0;
        }
        categoryScores[category] += question.score;
        categoryCounts[category] += 1;
      });
    });

    const categories = Object.keys(categoryScores);
    const averages = categories.map((category) => ({
      category,
      average: categoryCounts[category] > 0
        ? (categoryScores[category] / categoryCounts[category]).toFixed(2)
        : "N/A",
    }));

    return averages;
  };

  const filteredAnswersByDate = answers.filter((answer) => {
    const respondentDate = respondentDates[answer.respondent_id];
    if (!respondentDate) return false;

    // Parse the date in the format MM/DD/YYYY, HH:mm:ss AM/PM
    const parsedDate = new Date(
      respondentDate.replace(
        /(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2}) (AM|PM)/,
        (_, month, day, year, hour, minute, second, period) => {
          const adjustedHour = period === "PM" && hour !== "12" ? parseInt(hour) + 12 : hour === "12" && period === "AM" ? "00" : hour;
          return `${year}-${month}-${day}T${adjustedHour}:${minute}:${second}`;
        }
      )
    );

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && parsedDate < start) return false;
    if (end && parsedDate > end) return false;
    return true;
  });

  const getFilteredAverageScoresByCategory = () => {
    const categoryScores = {};
    const categoryCounts = {};

    filteredAnswersByDate.forEach((answer) => {
      answer.questions.forEach((question) => {
        const category = questionDetails[question._id]?.category || "Uncategorized";
        if (!categoryScores[category]) {
          categoryScores[category] = 0;
          categoryCounts[category] = 0;
        }
        categoryScores[category] += question.score;
        categoryCounts[category] += 1;
      });
    });

    const categories = Object.keys(categoryScores);
    return categories.map((category) => ({
      category,
      average: categoryCounts[category] > 0
        ? (categoryScores[category] / categoryCounts[category]).toFixed(2)
        : "N/A",
    }));
  };

  const averageScores = getAverageScoresByCategory();
  const filteredAverageScores = getFilteredAverageScoresByCategory();

  const chartOptions = {
    indexAxis: "y", // Horizontal bar chart
    responsive: true,
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: (value) => `${value}%`, // Add percentage symbol to x-axis
        },
      },
      y: {
        stacked: true,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}%`,
        },
      },
    },
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
  };

  const resetToOriginalOrder = () => {
    setSortOrder("original");
  };

  const uniqueQuestions = [];
  filteredAnswersByDate.forEach((answer) => {
    answer.questions.forEach((question) => {
      if (!uniqueQuestions.some((q) => q._id === question._id)) {
        uniqueQuestions.push(question);
      }
    });
  });

  const sortedQuestions = [...uniqueQuestions].sort((a, b) => {
    if (sortOrder === "original") {
      // Use the order in the database by comparing their indices in the originalQuestions array
      const indexA = originalQuestions.findIndex((q) => q._id === a._id);
      const indexB = originalQuestions.findIndex((q) => q._id === b._id);
      return indexA - indexB;
    }

    const avgScoreA = filteredAnswersByDate.reduce((sum, answer) => {
      const question = answer.questions.find((q) => q._id === a._id);
      return question ? sum + question.score : sum;
    }, 0) / filteredAnswersByDate.filter((answer) => answer.questions.some((q) => q._id === a._id)).length;

    const avgScoreB = filteredAnswersByDate.reduce((sum, answer) => {
      const question = answer.questions.find((q) => q._id === b._id);
      return question ? sum + question.score : sum;
    }, 0) / filteredAnswersByDate.filter((answer) => answer.questions.some((q) => q._id === b._id)).length;

    return sortOrder === "desc" ? avgScoreB - avgScoreA : avgScoreA - avgScoreB;
  });

  const filteredQuestions = sortedQuestions.filter((question) => {
    const category = questionDetails[question._id]?.category || "Uncategorized";
    return filterCategory === "" || category === filterCategory;
  });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl mb-4 font-bold text-primary">BÁO CÁO</h2>
      <div className="mt-4">
        <p className="text-gray-800">Khảo sát đã hoàn thành: {stats.finishedSurveys}</p>
        <p className="text-gray-800">Khảo sát bị cấm: {stats.bannedSurveys}</p>
        <p className="text-gray-800">Tổng số người tham gia: {stats.totalRespondents}</p>
        <p className="text-gray-800">Người tham gia mới trong 7 ngày: {stats.newRespondents}</p>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-bold text-primary">Điểm trung bình theo danh mục</h3>
        <ul className="list-disc pl-5">
          {filteredAverageScores.map((item, index) => (
            <li key={index} className="text-gray-800">
              <strong>{item.category}:</strong> {item.average}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <div className="flex justify-between mb-4 gap-4">
          <div>
            <label htmlFor="categoryFilter" className="mr-2 font-semibold">Lọc theo danh mục:</label>
            <select
              id="categoryFilter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">Tất cả</option>
              <option value="Quy chế">Quy chế</option>
              <option value="Tổ chức">Tổ chức</option>
              <option value="Nhân lực">Nhân lực</option>
              <option value="Đầu tư">Đầu tư</option>
              <option value="Vận hành">Vận hành</option>
            </select>
          </div>
          <div>
            <label htmlFor="startDate" className="mr-2 font-semibold">Từ ngày:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="mr-2 font-semibold">Đến ngày:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border rounded-md"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={toggleSortOrder}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition"
            >
              Sắp xếp theo điểm {sortOrder === "desc" ? "thấp nhất" : "cao nhất"}
            </button>
            <button
              onClick={resetToOriginalOrder}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              Đặt lại thứ tự gốc
            </button>
          </div>
        </div>
        <h3 className="text-xl font-bold text-primary">Biểu đồ câu hỏi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.slice(0, 40).map((question) => (
            <div
              key={question._id}
              className="p-4 border rounded shadow"
            >
              <h4 className="text-lg font-bold text-gray-800 mb-2">
                Question ID: {question._id}
              </h4>
              {questionDetails[question._id] && (
                <>
                  <p className="text-gray-600 mb-2">
                    <strong>Category:</strong> {questionDetails[question._id].category || "No additional info available"}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Question:</strong> {questionDetails[question._id].question_text || "No question text available"}
                  </p>
                </>
              )}
              <Bar data={getChartDataForQuestion(question._id)} options={chartOptions} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
