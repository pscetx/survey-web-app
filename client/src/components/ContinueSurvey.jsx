import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ContinueSurvey() {
  const [respondentId, setRespondentId] = useState("");
  const navigate = useNavigate();

  // Function to handle checking respondent status
  const checkRespondent = async () => {
    if (!respondentId) return;

    try {
      const response = await fetch(`http://localhost:5050/answer/${respondentId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const answerData = await response.json();
      
      // Check if is_finished is false
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
    <div className="border rounded-md overflow-hidden p-4 mb-4">
      <h2 className="text-lg font-bold mb-2">Chưa hoàn thành khảo sát? Nhập mã để tiếp tục:</h2>
      <div className="flex">
        <input
          type="text"
          name="respondent_id"
          id="respondent_id"
          className="flex-1 border-0 py-2 pl-2 text-slate-900 placeholder:text-slate-400"
          placeholder="Survey ID"
          onChange={(e) => setRespondentId(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={checkRespondent}
          className="inline-flex items-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-primary hover:text-white h-9 rounded-md px-3 cursor-pointer ml-4"
        >
          Tiếp tục làm khảo sát
        </button>
      </div>
    </div>
  );
}
