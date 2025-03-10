import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContinueSurvey from "./ContinueSurvey";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RespondentInfo() {
  const [form, setForm] = useState({
    respondent_name: "",
    respondent_role: "",
    org_name: "",
    field: "",
    staff_size: "",
  });
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  useEffect(() => {
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
    const person = { ...form };
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

      navigate(`/survey/${newId}`);
    } catch (error) {
      console.error("A problem occurred adding the record: ", error);
    } finally {
      setForm({
        respondent_name: "",
        respondent_role: "",
        org_name: "",
        field: "",
        staff_size: "",
      });
    }
  }

  return (
    <div className="respondent-info-container">
      <ContinueSurvey />
      <h2 className="text-2xl mb-4 font-bold text-primary">LÀM BÀI KHẢO SÁT MỚI</h2>
      <form onSubmit={onSubmit} className="border rounded-md overflow-hidden p-4">
      <div className="grid grid-cols-1 gap-x-32 gap-y-8 pb-12 lg:grid-cols-2">
        <div>
          <h1 className="text-lg font-bold">Nhập thông tin tiền khảo sát</h1>
          <div className="mt-1 text-sm leading-6 text-slate-600">
              <div className="italic font-semibold">
                Lưu ý:
            </div>
            Bạn vẫn có thể thay đổi các thông tin này trong quá trình làm bài khảo sát.<br />
            Dữ liệu thu thập sẽ chỉ được sử dụng cho mục đích nghiên cứu và sẽ không được trao đổi với bất kỳ bên thứ ba nào khác nhằm mục đích thương mại.
          </div>
        </div>
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">
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
                  onChange={(e) => updateForm({ staff_size: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <input
          type="submit"
          value="Bắt đầu làm bài khảo sát"
          className="inline-flex items-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-primary hover:text-white h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </div>
    </form>
    </div>
  );
}
