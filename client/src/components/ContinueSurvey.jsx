import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ContinueSurvey() {
  const [respondentId, setRespondentId] = useState("");
  const navigate = useNavigate();

  const checkRespondent = async () => {
    if (!respondentId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/answer/${respondentId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const answerData = await response.json();
      
      if (answerData.is_finished === false) {
        navigate(`/survey/${respondentId}`);
      } else {
        alert("Bài khảo sát này đã được hoàn thành và chỉ có thể tra cứu kết quả.");
      }
    } catch (error) {
      console.error("Error fetching respondent answers:", error);
      alert("Đã có lỗi xảy ra hoặc mã khảo sát không tồn tại.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4 font-bold text-primary">TIẾP TỤC LÀM KHẢO SÁT</h2>
      <div className="border rounded-md overflow-hidden p-4 mb-10">
        <h2 className="text-md mb-4">Nếu bạn đã làm khảo sát nhưng chưa bấm '<strong>Hoàn tất khảo sát</strong>', bạn có thể nhập mã khảo sát để tiếp tục làm bài.</h2>
        <div className="flex text-md rounded-sm border-b border-secondary">
          <input
            type="text"
            name="respondent_id"
            id="respondent_id"
            className="flex-1 border-0 py-2 pl-2 text-gray-900 placeholder:text-gray-400"
            placeholder="Điền mã khảo sát của bạn"
            onChange={(e) => setRespondentId(e.target.value)}
            required
          />
        </div>
        <button
            type="button"
            onClick={checkRespondent}
            className="mt-4 inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-primary hover:text-white h-9 rounded-md px-3 cursor-pointer"
          >
            Tiếp tục làm khảo sát
          </button>
      </div>
    </div>
  );
}
