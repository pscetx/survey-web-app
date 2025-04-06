import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContinueSurvey from "./ContinueSurvey";
import sendEmail from "./SendEmail";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RespondentInfo() {
  const [form, setForm] = useState({
    respondent_email: "",
    respondent_name: "",
    respondent_role: "",
    org_name: "",
    field: "",
    staff_size: "",
    date: "",
  });
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  useEffect(() => {

    setForm((prevForm) => ({
      ...prevForm,
      date: new Date().toISOString(),
    }));

    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/question`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const formattedDate = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).toUpperCase();

    const person = { ...form, date: formattedDate };
    try {
      const response = await fetch(`${API_BASE_URL}/respondent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newRespondent = await response.json();
      console.log("Response from server:", newRespondent);

      const newId = newRespondent.insertedId;

      if (!newId) {
        throw new Error("Respondent ID not found in the response");
      }

      const answers = questions.map((question) => ({
        _id: question._id,
        score: 0,
      }));

      const answersResponse = await fetch(`${API_BASE_URL}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          respondent_id: newId,
          questions: answers,
        }),
      });

      if (!answersResponse.ok) {
        throw new Error(`HTTP error! status: ${answersResponse.status}`);
      }

      try {
      await sendEmail(
        newId,
        form.respondent_email,
        form.respondent_name,
        form.respondent_role,
        form.org_name,
        form.field,
        form.staff_size,
        formattedDate,
      );
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

      navigate(`/survey/${newId}`);
    } catch (error) {
      console.error("A problem occurred adding the record: ", error);
    } finally {
      setForm({
        respondent_email: "",
        respondent_name: "",
        respondent_role: "",
        org_name: "",
        field: "",
        staff_size: "",
        date: "",
      });
    }
  }

  return (
    <div className="respondent-info-container">
      <ContinueSurvey />
      <h2 className="text-2xl mb-4 font-bold text-primary">LÀM BÀI KHẢO SÁT MỚI</h2>
      <form onSubmit={onSubmit} className="shadow rounded-md overflow-hidden p-4">
        <div className="grid grid-cols-1 gap-x-32 gap-y-8 pb-6 lg:grid-cols-2">
          <div>
            <h1 className="text-lg font-bold">Nhập thông tin tiền khảo sát</h1>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              <span className="italic font-semibold">Lưu ý:</span><br />
              Bạn vẫn có thể thay đổi các thông tin này trong quá trình làm bài khảo sát.<br />
              Dữ liệu thu thập sẽ chỉ được sử dụng cho nghiên cứu và không trao đổi với bất kỳ bên thứ ba nào nhằm mục đích thương mại.
            </p>
          </div>
          
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-4">
            {[
              { label: "Email người khảo sát", name: "respondent_email", type: "email", placeholder: "Thông tin khảo sát sẽ được gửi về email này" },
              { label: "Tên người khảo sát", name: "respondent_name", type: "text" },
              { label: "Chức vụ", name: "respondent_role", type: "text" },
              { label: "Tên doanh nghiệp", name: "org_name", type: "text" },
              { label: "Số nhân sự bộ phận công nghệ thông tin", name: "staff_size", type: "number", placeholder: "Không có nhân sự CNTT điền giá trị 0" }
            ].map(({ label, name, type, placeholder, autoComplete, pattern }) => (
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
                    required
                    onChange={(e) => updateForm({ [name]: e.target.value })}
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
                  className="w-11/12 border border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 transition duration-300 ease-in-out"
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
            Bắt đầu làm khảo sát
          </button>
        </div>
      </form>
    </div>
  );
}
