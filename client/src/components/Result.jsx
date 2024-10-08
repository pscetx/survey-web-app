import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';

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

  const questionsArray = questionsToDisplay.map((question) => {
  const questionDetails = questionsMap[question._id];

  return {
    category: questionDetails?.category || '',
    score: question.score || 0,
  };
  });
 
  var score = [0, 0, 0, 0, 0];
  var count = [0, 0, 0, 0, 0];
  for (let i = 0; i < questionsArray.length; i++) {
    if(questionsArray[i].category == 'Quy chế'){
      score[0] += questionsArray[i].score;
      count[0] += 1;
    }
    if(questionsArray[i].category == 'Tổ chức'){
      score[1] += questionsArray[i].score;
      count[1] += 1;
    }
    if(questionsArray[i].category == 'Nhân lực'){
      score[2] += questionsArray[i].score;
      count[2] += 1;
    }
    if(questionsArray[i].category == 'Đầu tư'){
      score[3] += questionsArray[i].score;
      count[3] += 1;
    }
    if(questionsArray[i].category == 'Vận hành'){
      score[4] += questionsArray[i].score;
      count[4] += 1;
    }
  }
  var avg = [score[0]/count[0], score[1]/count[1], score[2]/count[2], score[3]/count[3], score[4]/count[4]];

  const data = {
    labels: [
      'QUY CHẾ',
      'TỔ CHỨC',
      'NHÂN LỰC',
      'ĐẦU TƯ',
      'VẬN HÀNH',
    ],
    datasets: [{
      label: 'Điểm trung bình theo 5 trụ cột',
      data: avg,
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
    }],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 4,
        ticks: {
          stepSize: 1
        }
      },
    }
  };

  const config = {
    type: 'radar',
    data: data,
    options: {
      elements: {
        line: {
          borderWidth: 5
        }
      }
    },
  };

  return (
    <div className="results-container">
      <h2 className="text-2xl mb-4">Kết quả khảo sát</h2>
      <div className="mb-4">
        <p><strong>Mã khảo sát:</strong> {respondent._id}</p>
        <p><strong>Tên người khảo sát:</strong> {respondent.respondent_name}</p>
        <p><strong>Chức vụ:</strong> {respondent.respondent_role}</p>
        <p><strong>Tên tổ chức:</strong> {respondent.org_name}</p>
        <p><strong>Lĩnh vực:</strong> {respondent.field}</p>
        <p><strong>Số lượng nhân viên:</strong> {respondent.staff_size}</p>
      </div>
      <div style={{ position: 'relative', width: '500px', left: '50%', marginLeft: '-250px', display: 'inline - block' }}>
        <Radar data={data} config={config} options={options}> </Radar>
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
