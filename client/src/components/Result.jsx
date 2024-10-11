import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function Result() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [questionsMap, setQuestionsMap] = useState({});
  const [respondent, setRespondent] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchResult() {
      try {
        const response = await fetch(`http://localhost:5050/answer/${id}`);
        if (!response.ok) {
          throw new Error(`Error fetching results: ${response.statusText}`);
        }
        const data = await response.json();

        if (!data.is_finished) {
          alert("Khảo sát chưa hoàn thành.");
          navigate("/");
          return;
        }

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
    if (questionsArray[i].category === 'Quy chế') {
      score[0] += questionsArray[i].score;
      count[0] += 1;
    }
    if (questionsArray[i].category === 'Tổ chức') {
      score[1] += questionsArray[i].score;
      count[1] += 1;
    }
    if (questionsArray[i].category === 'Nhân lực') {
      score[2] += questionsArray[i].score;
      count[2] += 1;
    }
    if (questionsArray[i].category === 'Đầu tư') {
      score[3] += questionsArray[i].score;
      count[3] += 1;
    }
    if (questionsArray[i].category === 'Vận hành') {
      score[4] += questionsArray[i].score;
      count[4] += 1;
    }
  }

  var avg = score.map((s, index) => (count[index] !== 0 ? s / count[index] : 0));

  const data = {
    labels: [
      'QUY CHẾ',
      'TỔ CHỨC',
      'NHÂN LỰC',
      'ĐẦU TƯ',
      'VẬN HÀNH',
    ],
    datasets: [{
      label: ' Điểm trung bình',
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
          borderWidth: 12
        }
      }
    },
  };

  const getComments = (avg) => {
    const comments = [];

    if (avg[0] < 2) {
      comments.push(`Quy chế: ${avg[0].toFixed(2)} điểm - Quy chế hiện tại của tổ chức còn nhiều hạn chế và cần cải thiện để nâng cao hiệu quả hoạt động.`);
    } else if (avg[0] < 3) {
      comments.push(`Quy chế: ${avg[0].toFixed(2)} điểm - Quy chế tổ chức ở mức chấp nhận được, nhưng vẫn còn nhiều điểm cần tối ưu để đảm bảo sự ổn định.`);
    } else {
      comments.push(`Quy chế: ${avg[0].toFixed(2)} điểm - Khảo sát đánh giá quy chế của tổ chức ở mức tốt, có nền tảng vững chắc cho hoạt động.`);
    }

    if (avg[1] < 2) {
      comments.push(`Tổ chức: ${avg[1].toFixed(2)} điểm - Hiệu quả quản lý hiện tại chưa đáp ứng yêu cầu, cần có những biện pháp để cải thiện hơn.`);
    } else if (avg[1] < 3) {
      comments.push(`Tổ chức: ${avg[1].toFixed(2)} điểm - Quản lý tổ chức đạt mức trung bình, nhưng vẫn có thể nâng cao quy trình hơn.`);
    } else {
      comments.push(`Tổ chức: ${avg[1].toFixed(2)} điểm - Tổ chức đạt hiệu quả quản lý tốt, đảm bảo phối hợp và điều hành hiệu quả.`);
    }

    if (avg[2] < 2) {
      comments.push(`Nhân lực: ${avg[1].toFixed(2)} điểm - Chất lượng và số lượng nhân lực còn hạn chế, cần đầu tư và phát triển hơn.`);
    } else if (avg[2] < 3) {
      comments.push(`Nhân lực: ${avg[1].toFixed(2)} điểm - Nhân lực tổ chức đang ở mức trung bình, có thể cải thiện thêm để đáp ứng nhu cầu phát triển.`);
    } else {
      comments.push(`Nhân lực: ${avg[1].toFixed(2)} điểm - Khảo sát đánh giá nhân lực tổ chức ở mức cao, đáp ứng tốt yêu cầu chuyên môn và khối lượng công việc.`);
    }

    if (avg[3] < 2) {
      comments.push(`Đầu tư: ${avg[1].toFixed(2)} điểm - Mức độ đầu tư vào tổ chức còn thấp, cần có sự gia tăng đáng kể để đáp ứng các mục tiêu dài hạn.`);
    } else if (avg[3] < 3) {
      comments.push(`Đầu tư: ${avg[1].toFixed(2)} điểm - Mức đầu tư của tổ chức ở mức trung bình, nhưng vẫn có khả năng tối ưu để phát triển bền vững.`);
    } else {
      comments.push(`Đầu tư: ${avg[1].toFixed(2)} điểm - Mức độ đầu tư của tổ chức rất tốt, sẽ tạo điều kiện thuận lợi cho các hoạt động và phát triển.`);
    }

    if (avg[4] < 2) {
      comments.push(`Vận hành: ${avg[1].toFixed(2)} điểm - Hoạt động vận hành còn nhiều bất cập, cần tái cấu trúc và cải thiện để đạt hiệu quả cao.`);
    } else if (avg[4] < 3) {
      comments.push(`Vận hành: ${avg[1].toFixed(2)} điểm - Vận hành tổ chức ở mức chấp nhận được, nhưng vẫn cần điều chỉnh để đạt sự linh hoạt và hiệu quả.`);
    } else {
      comments.push(`Vận hành: ${avg[1].toFixed(2)} điểm - Tổ chức vận hành trơn tru, đảm bảo sự liên tục và hiệu quả trong các hoạt động.`);
    }

    const overallAvg = avg.reduce((acc, val) => acc + val, 0) / avg.length;

    if (overallAvg < 2) {
      comments.push(`Nhìn chung, tổ chức còn nhiều khía cạnh cần cải thiện, hiệu quả hoạt động và các yếu tố quan trọng đều ở mức thấp. Tổng điểm: ${overallAvg.toFixed(2)}`);
    } else if (overallAvg < 3) {
      comments.push(`Tổng thể, tổ chức đạt mức trung bình, mặc dù đã có một số điểm tích cực, vẫn cần cải tiến ở nhiều khía cạnh để đạt hiệu quả cao. Tổng điểm: ${overallAvg.toFixed(2)}`);
    } else {
      comments.push(`Tổng thể, tổ chức hoạt động rất tốt trên nhiều mặt. Những nỗ lực hiện tại sẽ tạo ra kết quả tích cực và duy trì sự phát triển bền vững. Tổng điểm: ${overallAvg.toFixed(2)}`);
    }

    return comments;
  };

  const handleCopyId = () => {
    if (respondent?._id) {
      navigator.clipboard.writeText(respondent._id)
        .then(() => {
          alert('Mã khảo sát đã được sao chép!');
        })
        .catch(err => {
          console.error('Error while copying: ', err);
        });
    }
  };

  return (
    <div className="results-container">
      <h2 className="text-2xl mb-1 font-bold text-primary">ĐÁNH GIÁ TỔNG QUAN</h2>
      <h1 className="text-lg">Mã khảo sát của bạn là <span className="font-bold italic">'{respondent._id}'</span><span><button
            onClick={handleCopyId}
            className="ml-3 inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-primary hover:text-white h-8 rounded-md px-2 cursor-pointer"
          >
            Copy
          </button></span></h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4 mb-16 border rounded-md overflow-hidden p-4">
        <div>
            <div className="mb-4">
              <h3 className="text-lg mb-2">Thông tin khảo sát</h3>
              <ul className="list-disc pl-5">
                <li><strong>Tên người khảo sát:</strong> {respondent.respondent_name}</li>
                <li><strong>Chức vụ:</strong> {respondent.respondent_role}</li>
                <li><strong>Tên tổ chức:</strong> {respondent.org_name}</li>
                <li><strong>Lĩnh vực:</strong> {respondent.field}</li>
                <li><strong>Số lượng nhân viên:</strong> {respondent.staff_size}</li>
              </ul>
            </div>
          <div>
            <h3 className="text-lg mb-2">Nhận xét kết quả khảo sát</h3>
            <ul className="list-disc pl-5">
              {getComments(avg).map((comment, index) => (
                <li key={index}>{comment}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center my-8 lg:my-0">
          <div className="w-full max-w-lg">
            <Radar data={data} config={config} options={options}></Radar>
          </div>
        </div>
      </div>

      <h2 className="text-2xl mb-4 font-bold text-primary">KẾT QUẢ CHI TIẾT</h2>
      <div className="overflow-auto">
      <table className="table-fixed min-w-[800px] rounded-lg shadow-lg overflow-hidden">
        <thead>
          <tr className="bg-primary text-white text-center">
            <th className="border border-gray-300 p-2 w-12">STT</th>
            <th className="border border-gray-300 p-2">Câu hỏi</th>
            <th className="border border-gray-300 p-2 w-24">Phân loại</th>
            <th className="border border-gray-300 p-2">Câu trả lời</th>
            <th className="border border-gray-300 p-2">Điểm</th>
          </tr>
        </thead>
        <tbody>
          {questionsToDisplay.map((question, index) => {
            const questionDetails = questionsMap[question._id];
            const selectedOption = questionDetails?.options.find(
              (option) => option.score === question.score
            );

            return (
              <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-tertiary'}`}>
                <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 p-2">{questionDetails?.question_text}</td>
                <td className="border border-gray-300 p-2 text-center">{questionDetails?.category}</td>
                <td className="border border-gray-300 p-2">{selectedOption ? selectedOption.text : 'N/A'}</td>
                <td className="border border-gray-300 p-2 text-center">{question.score}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    </div>
  );
}
