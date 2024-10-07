import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Result() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [questionsMap, setQuestionsMap] = useState({});
  const [respondent, setRespondent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResult() {
      try {
        const response = await fetch(`http://localhost:5050/answer/${id}`);
        if (!response.ok) {
          throw new Error(`Error fetching results: ${response.statusText}`);
        }
        const data = await response.json();

        setResult(data);
        await fetchQuestions(data.questions);
        await fetchRespondent(data.respondent_id);
      } catch (error) {
        setError("Không tìm thấy mã khảo sát trong cơ sở dữ liệu.");
        console.error(error);
      }
    }

    async function fetchQuestions(questions) {
      try {
        const fetchRequests = questions.map((question) => 
          fetch(`http://localhost:5050/question/${question._id}`)
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
        const response = await fetch(`http://localhost:5050/respondent/${respondentId}`);
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
  }, [id]);

  if (error) {
    return <p className="text-primary text-xl">{error}</p>;
  }

  if (!result || !respondent) {
    return <p>Loading...</p>;
  }

  const questionsToDisplay = result.questions.slice(0, -1);

  return (
    <div className="results-container">
      <h2 className="text-2xl mb-4">Kết quả khảo sát</h2>

      <div className="mb-4">
        <p><strong>Tên người khảo sát:</strong> {respondent.respondent_name}</p>
        <p><strong>Chức vụ:</strong> {respondent.respondent_role}</p>
        <p><strong>Tên tổ chức:</strong> {respondent.org_name}</p>
        <p><strong>Lĩnh vực:</strong> {respondent.field}</p>
        <p><strong>Số lượng nhân viên:</strong> {respondent.staff_size}</p>
      </div>

      <table className="min-w-full border border-collapse border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-4 text-left">Câu hỏi</th>
            <th className="border border-gray-300 p-4 text-left">Phân loại</th>
            <th className="border border-gray-300 p-4 text-left">Câu trả lời</th>
            <th className="border border-gray-300 p-4 text-left">Điểm</th>
          </tr>
        </thead>
        <tbody>
          {questionsToDisplay.map((question, index) => {
            const questionDetails = questionsMap[question._id];
            const selectedOption = questionDetails?.options.find(
              (option) => option.score === question.score
            );

            return (
              <tr key={index} className="border-b">
                <td className="border border-gray-300 p-4">{questionDetails?.question_text}</td>
                <td className="border border-gray-300 p-4">{questionDetails?.category}</td>
                <td className="border border-gray-300 p-4">{selectedOption ? selectedOption.text : 'N/A'}</td>
                <td className="border border-gray-300 p-4">{question.score}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
