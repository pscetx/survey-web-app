import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';
import Loader from "./Loader";
import SurveyComparison from "./SurveyComparison";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Result() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [questionsMap, setQuestionsMap] = useState({});
  const [respondent, setRespondent] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterCategory, setFilterCategory] = useState('');
  const [filterScore, setFilterScore] = useState('');
  const [relatedRespondents, setRelatedRespondents] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [surveyIds, setSurveyIds] = useState({ id1: null, id2: null });
  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleComparisonClick = (id1, id2) => {
    if (selectedRowId === id2) {
      setSelectedRowId(null);
    } else {
      setSelectedRowId(id2);
    }
    setSurveyIds({ id1, id2 });
    setShowComparison(true);
  };

  useEffect(() => {
    async function fetchResult() {
      try {
        const response = await fetch(`${API_BASE_URL}/answer/${id}`);
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
        await fetchRelatedRespondents(data.respondent_email, data._id);
      } catch (error) {
        console.error("Error fetching respondent:", error);
        setError("Failed to fetch respondent.");
      }
    }

    async function fetchRelatedRespondents(email, currentRespondentId) {
      try {
        const response = await fetch(`${API_BASE_URL}/respondent/email/${email}`);
        if (!response.ok) {
          throw new Error(`Error fetching related respondents: ${response.statusText}`);
        }
        const data = await response.json();

        // Filter out the current respondent
        const filtered = data.filter(r => r._id !== currentRespondentId);
        setRelatedRespondents(filtered);
      } catch (error) {
        console.error("Error fetching related respondents:", error);
      }
    }

    fetchResult();
  }, [id]);

  if (error) {
    return <p className="text-primary text-xl">{error}</p>;
  }

  if (!result || !respondent) {
    return <Loader />;
  }

  const questionsToDisplay = result.questions.slice(0, -1);

  const questionsArray = questionsToDisplay.map((question) => {
    const questionDetails = questionsMap[question._id];

    return {
      category: questionDetails?.category || '',
      score: question.score || 0,
    };
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedQuestions = [...questionsToDisplay].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredQuestions = sortedQuestions.filter((question) => {
    const questionDetails = questionsMap[question._id];
    const matchesCategory = filterCategory ? questionDetails?.category === filterCategory : true;
    const matchesScore = filterScore ? question.score === parseInt(filterScore) : true;
    return matchesCategory && matchesScore;
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
      comments.push(
        <span>
          <strong>Quy chế:</strong> <strong>{avg[0].toFixed(2)}/4 điểm</strong> - Quy chế hiện tại của tổ chức còn nhiều hạn chế và cần cải thiện để nâng cao hiệu quả hoạt động.
        </span>
      );
    } else if (avg[0] < 3) {
      comments.push(
        <span>
          <strong>Quy chế:</strong> <strong>{avg[0].toFixed(2)}/4 điểm</strong> - Quy chế tổ chức ở mức chấp nhận được, nhưng vẫn còn nhiều điểm cần tối ưu để đảm bảo sự ổn định.
        </span>
      );
    } else {
      comments.push(
        <span>
          <strong>Quy chế:</strong> <strong>{avg[0].toFixed(2)}/4 điểm</strong> - Khảo sát đánh giá quy chế của tổ chức ở mức tốt, có nền tảng vững chắc cho hoạt động.
        </span>
      );
    }

    if (avg[1] < 2) {
      comments.push(
        <span>
          <strong>Tổ chức:</strong> <strong>{avg[1].toFixed(2)}/4 điểm</strong> - Hiệu quả quản lý hiện tại chưa đáp ứng yêu cầu, cần có những biện pháp để cải thiện.
        </span>
      );
    } else if (avg[1] < 3) {
      comments.push(
        <span>
          <strong>Tổ chức:</strong> <strong>{avg[1].toFixed(2)}/4 điểm</strong> - Quản lý tổ chức đạt mức trung bình, nhưng vẫn có thể nâng cao quy trình hơn.
        </span>
      );
    } else {
      comments.push(
        <span>
          <strong>Tổ chức:</strong> <strong>{avg[1].toFixed(2)}/4 điểm</strong> - Tổ chức đạt hiệu quả quản lý ở mức tốt, có thể đảm bảo phối hợp và điều hành hiệu quả.
        </span>
      );
    }

    if (avg[2] < 2) {
      comments.push(
        <span>
          <strong>Nhân lực:</strong> <strong>{avg[2].toFixed(2)}/4 điểm</strong> - Chất lượng và số lượng nhân lực còn hạn chế, cần đầu tư và phát triển hơn.
        </span>
      );
    } else if (avg[2] < 3) {
      comments.push(
        <span>
          <strong>Nhân lực:</strong> <strong>{avg[2].toFixed(2)}/4 điểm</strong> - Nhân lực tổ chức ở mức trung bình, cần cải thiện thêm để đáp ứng nhu cầu phát triển.
        </span>
      );
    } else {
      comments.push(
        <span>
          <strong>Nhân lực:</strong> <strong>{avg[2].toFixed(2)}/4 điểm</strong> - Khảo sát đánh giá nhân lực tổ chức ở mức cao, đáp ứng tốt yêu cầu chuyên môn và khối lượng công việc.
        </span>
      );
    }

    if (avg[3] < 2) {
      comments.push(
        <span>
          <strong>Đầu tư:</strong> <strong>{avg[3].toFixed(2)}/4 điểm</strong> - Mức độ đầu tư vào tổ chức còn thấp, cần có sự gia tăng đáng kể để đáp ứng các mục tiêu dài hạn.
        </span>
      );
    } else if (avg[3] < 3) {
      comments.push(
        <span>
          <strong>Đầu tư:</strong> <strong>{avg[3].toFixed(2)}/4 điểm</strong> - Mức đầu tư của tổ chức ở mức trung bình, nhưng vẫn có khả năng tối ưu để phát triển bền vững.
        </span>
      );
    } else {
      comments.push(
        <span>
          <strong>Đầu tư:</strong> <strong>{avg[3].toFixed(2)}/4 điểm</strong> - Mức độ đầu tư của tổ chức rất tốt, tạo điều kiện thuận lợi cho các hoạt động phát triển.
        </span>
      );
    }

    if (avg[4] < 2) {
      comments.push(
        <span>
          <strong>Vận hành:</strong> <strong>{avg[4].toFixed(2)}/4 điểm</strong> - Hoạt động vận hành còn nhiều bất cập, cần tái cấu trúc và cải thiện để đạt hiệu quả cao.
        </span>
      );
    } else if (avg[4] < 3) {
      comments.push(
        <span>
          <strong>Vận hành:</strong> <strong>{avg[4].toFixed(2)}/4 điểm</strong> - Vận hành tổ chức ở mức chấp nhận được, nhưng vẫn cần điều chỉnh để đạt được sự linh hoạt và hiệu quả.
        </span>
      );
    } else {
      comments.push(
        <span>
          <strong>Vận hành:</strong> <strong>{avg[4].toFixed(2)}/4 điểm</strong> - Tổ chức đang vận hành trơn tru, đảm bảo sự liên tục, hiệu quả và an toàn trong các hoạt động.
        </span>
      );
    }

    const overallAvg = avg.reduce((acc, val) => acc + val, 0) / avg.length;

    if (overallAvg < 2) {
      comments.push(
        <span>
          Nhìn chung, doanh nghiệp còn nhiều khía cạnh cần cải thiện, hiệu quả hoạt động và các yếu tố quan trọng đều ở mức kém. 
          <strong> Tổng điểm trung bình trên 5 khía cạnh: </strong><strong>{overallAvg.toFixed(2)}/4 điểm!</strong>
        </span>
      );
    } else if (overallAvg < 3) {
      comments.push(
        <span>
          Tổng thể, doanh nghiệp đạt mức trung bình, mặc dù đã có một số khía cạnh ở mức tốt, tuy nhiên vẫn cần cải tiến nhiều hơn để đạt hiệu quả cao. 
          <strong> Tổng điểm trung bình trên 5 khía cạnh: </strong><strong>{overallAvg.toFixed(2)}/4 điểm!</strong>
        </span>
      );
    } else {
      comments.push(
        <span>
          Tổng thể, tổ chức đang hoạt động tốt trên nhiều mặt, có thể duy trì các kết quả tích cực và sự phát triển bền vững. 
          <strong> Tổng điểm trung bình trên 5 khía cạnh: </strong><strong>{overallAvg.toFixed(2)}/4 điểm!</strong>
        </span>
      );
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
      <h1 className="text-2xl mb-4 font-bold text-primary">ĐÁNH GIÁ TỔNG QUAN</h1>
      <h2 className="text-lg mb-6">Mã khảo sát của bạn <span className="inline-flex items-center justify-center whitespace-nowrap text-sm text-secondary font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-tertiary h-8 rounded-md px-1 mr-1">{respondent._id} </span><span><button
            onClick={handleCopyId}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-primary hover:text-white h-8 rounded-md px-2 cursor-pointerinline-flex items-center justify-center whitespace-nowrap text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-primary hover:text-white h-8 rounded-md px-2 cursor-pointer"
          >
            Copy
          </button> đã được gửi về email đăng ký khảo sát.</span></h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-28 gap-7 mt-4 mb-16 shadow rounded-md overflow-hidden md:px-6 p-4">
        <div>
            <div className="mb-4">
              <h3 className="text-lg mb-2 italic">Thông tin người khảo sát</h3>
              <ul className="list-disc pl-5">
                <li><strong>Email người khảo sát:</strong> {respondent.respondent_email}</li>
                <li><strong>Tên người khảo sát:</strong> {respondent.respondent_name}</li>
                <li><strong>Chức vụ:</strong> {respondent.respondent_role}</li>
                <li><strong>Tên tổ chức:</strong> {respondent.org_name}</li>
                <li><strong>Lĩnh vực:</strong> {respondent.field}</li>
                <li><strong>Số lượng nhân viên CNTT:</strong> {respondent.staff_size}</li>
                <li><strong>Thời gian thực hiện:</strong> {respondent.date}</li>
              </ul>
            </div>
          <div>
            <h2 className="text-lg mb-2 italic">Đánh giá kết quả khảo sát</h2>
            <ul className="list-disc pl-5">
              {getComments(avg).map((comment, index) => (
                <li className="mb-1" key={index}>{comment}</li>
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

      <h1 className="text-2xl mb-4 font-bold text-primary">SO SÁNH KẾT QUẢ</h1>
      <div className="mb-4 text-sm leading-6 text-gray-600">
        <div className='italic font-semibold'>
        Lưu ý:</div>
        Bạn chỉ có thể so sánh các bài khảo sát đã hoàn thiện và có cùng email đăng ký.<br />
      </div>
      {relatedRespondents.length > 0 ? (
        <div className="mb-16">
          <div className="overflow-x-auto rounded-md overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-tertiary">
                <tr>
                  <th className="border px-2 py-2 text-left">Mã khảo sát</th>
                  <th className="border px-2 py-2 text-left">Tên người khảo sát</th>
                  <th className="border px-2 py-2 text-left">Chức vụ</th>
                  <th className="border px-2 py-2 text-left">Tên tổ chức</th>
                  <th className="border px-2 py-2 text-left">Lĩnh vực</th>
                  <th className="border px-2 py-2 text-left">Nhân sự</th>
                  <th className="border px-2 py-2 text-left">Thời gian thực hiện</th>
                  <th className="border px-2 py-2 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {relatedRespondents.map((related, index) => (
                  <tr key={index} className={selectedRowId === related._id ? 'bg-red-50' : 'bg-white'}>
                    <td className="border px-2 py-2">
                      <span className="inline-flex items-center justify-center whitespace-nowrap text-sm text-secondary font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-tertiary h-8 rounded-md px-1 mr-1 w-52">
                        {related._id}
                        <button className="ml-2" onClick={() => window.open(`/result/${related._id}`, "_blank")}>
                          <img src="/external-link-svgrepo-com.svg" alt="External Link" className="w-4 h-4 hover:scale-110" />
                        </button>
                      </span>
                    </td>
                    <td className="border px-2 py-2">{related.respondent_name}</td>
                    <td className="border px-2 py-2">{related.respondent_role}</td>
                    <td className="border px-2 py-2">{related.org_name}</td>
                    <td className="border px-2 py-2">{related.field}</td>
                    <td className="border px-2 py-2">{related.staff_size}</td>
                    <td className="border px-2 py-2">{related.date}</td>
                    <td className="border px-2 py-2">
                      <button 
                        className="text-md w-full px-3 py-1 text-md text-white bg-primary border border-white rounded-md hover:bg-white hover:text-secondary hover:border-primary transition duration-300 ease-in-out"
                        onClick={() => handleComparisonClick(respondent._id, related._id)}
                      >
                        So sánh
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showComparison && (
            <SurveyComparison id1={surveyIds.id1} id2={surveyIds.id2} />
          )}
        </div>
      ) : (
        <p className="mb-16 text-xl">Chưa có dữ liệu khảo sát so sánh.</p>
      )}

      <h1 className="text-2xl mb-4 font-bold text-primary">KẾT QUẢ CHI TIẾT</h1>
      <div className="flex flex-wrap gap-3 mb-3 md:justify-end">
        <button onClick={() => handleSort('category')} className="p-2 pl-1 font-semibold hover:text-primary transition duration-300 ease-in-out">
          Sắp xếp theo câu
        </button>
        <button onClick={() => handleSort('score')} className="p-2 pr-4 font-semibold hover:text-primary transition duration-300 ease-in-out">
          Sắp xếp theo điểm
        </button>
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-2 pl-0 font-semibold hover:text-primary transition duration-300 ease-in-out"
            >
              <option value="">Tất cả phân loại</option>
              <option value="Quy chế">Quy chế</option>
              <option value="Tổ chức">Tổ chức</option>
              <option value="Nhân lực">Nhân lực</option>
              <option value="Đầu tư">Đầu tư</option>
              <option value="Vận hành">Vận hành</option>
            </select>
          </div>
          <div>
            <select
              value={filterScore}
              onChange={(e) => setFilterScore(e.target.value)}
              className="p-2 font-semibold hover:text-primary transition duration-300 ease-in-out"
            >
              <option value="">Tất cả điểm</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
      </div>

      <div className="overflow-auto">
        <table className="table-fixed min-w-[800px] rounded-md shadow overflow-hidden">
          <thead>
            <tr className="bg-primary text-white text-center">
              <th className="border border-gray-200 p-2 w-12">STT</th>
              <th className="border border-gray-200 p-2">Câu hỏi</th>
              <th className="border border-gray-200 p-2 w-24">Phân loại</th>
              <th className="border border-gray-200 p-2">Điểm</th>
              <th className="border border-gray-200 p-2">Câu trả lời</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((question, index) => {
              const questionDetails = questionsMap[question._id];
              const selectedOption = questionDetails?.options.find(
                (option) => option.score === question.score
              );

              return (
                <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-tertiary'}`}>
                  <td className="border border-gray-200 p-2 text-center">{index + 1}</td>
                  <td className="border border-gray-200 p-2">{questionDetails?.question_text}</td>
                  <td className="border border-gray-200 p-2 text-center">{questionDetails?.category}</td>
                  <td className="border border-gray-200 p-2 text-center font-semibold">{question.score}</td>
                  <td className="border border-gray-200 p-2">{selectedOption ? selectedOption.text : 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
