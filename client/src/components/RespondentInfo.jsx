import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RespondentInfo() {
  const [form, setForm] = useState({
    respondent_name: "",
    respondent_role: "",
    org_name: "",
    field: "",
    staff_size: "",
  });
  
  const navigate = useNavigate();

  // This method will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
  e.preventDefault();
  const person = { ...form };
  try {
    const response = await fetch("http://localhost:5050/respondent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Log the response to inspect its structure
    const newRespondent = await response.json();
    console.log("Response from server:", newRespondent); // Log the response

    // Access the insertedId directly
    const newId = newRespondent.insertedId;

    if (!newId) {
      throw new Error("Respondent ID not found in the response");
    }

    // Redirect to the edit page with the new respondent's id
    navigate(`/edit/${newId}`);
  } catch (error) {
    console.error("A problem occurred adding the record: ", error);
  } finally {
    // Reset form fields
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
      <form onSubmit={onSubmit} className="border rounded-md overflow-hidden p-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 pb-12 md:grid-cols-2">
        <div>
          <h1 className="text-xl font-bold">Nhập thông tin của tiền khảo sát</h1>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Lưu ý: <br />
            Bạn vẫn có thể thay đổi các thông tin này trong quá trình làm bài khảo sát.<br />
            Dữ liệu được thu thập..
            </p>
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
                <div className="flex text-md max-w-md rounded-sm border-b border-secondary">
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
                <div className="flex text-md max-w-md rounded-sm border-b border-secondary">
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
                <div className="flex text-md max-w-md rounded-sm border-b border-secondary">
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
                <div className="flex text-md max-w-md rounded-sm border-b border-secondary">
                  <input
                    type="text"
                    name="field"
                    id="field"
                    className="flex-1 border-0 py-2 pl-2 text-slate-900 placeholder:text-slate-400"
                    placeholder="Business field"
                    onChange={(e) => updateForm({ field: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="staff_size"
                className="block text-md font-medium leading-6 text-slate-900"
              >
                Số lượng nhân viên
              </label>
              <div className="mt-2">
                <div className="flex text-md max-w-md rounded-sm border-b border-secondary">
                  <input
                    type="text"
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
  );
}
