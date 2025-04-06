import React, { useState, useEffect } from "react";
import RespondentsList from "./RespondentsList";
import SurveyComparison from "./SurveyComparison";
import Report from "./Report";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminDashboard() {
  const [id1, setId1] = useState("");
  const [id2, setId2] = useState("");
  const [activeTab, setActiveTab] = useState("report");
  const [respondent1, setRespondent1] = useState(null);
  const [respondent2, setRespondent2] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRespondent = async (id, setRespondent) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/respondent/${id}`);
      if (!response.ok) throw new Error(`Respondent ${id} not found`);
      const data = await response.json();
      setRespondent(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id1) {
      fetchRespondent(id1, setRespondent1);
    }
  }, [id1]);

  useEffect(() => {
    if (id2) {
      fetchRespondent(id2, setRespondent2);
    }
  }, [id2]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3 mb-3 md:justify-end">
        <button
          onClick={() => setActiveTab("report")}
          className={`px-4 py-2 rounded-md transition-all duration-300 ${
            activeTab === "report" ? "bg-primary text-white scale-105" : "bg-tertiary"
          }`}
        >
          Báo cáo chung
        </button>
        <button
          onClick={() => setActiveTab("respondents")}
          className={`px-4 py-2 rounded-md transition-all duration-300 ${
            activeTab === "respondents" ? "bg-primary text-white scale-105" : "bg-tertiary"
          }`}
        >
          Danh sách khảo sát
        </button>
        <button
          onClick={() => setActiveTab("comparison")}
          className={`px-4 py-2 rounded-md transition-all duration-300 ${
            activeTab === "comparison" ? "bg-primary text-white scale-105" : "bg-tertiary"
          }`}
        >
          So sánh khảo sát
        </button>
      </div>

      <div
        className={`transition-opacity duration-500 ${
          activeTab === "comparison" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {activeTab === "comparison" && (
          <div>
            <h2 className="text-2xl mb-6 font-bold text-primary">SO SÁNH KHẢO SÁT</h2>
            <div className="mb-4 flex flex-col gap-4">
              <div>
                <span className="text-lg mr-4 font-semibold">Khảo sát 1:</span>
                <input
                  type="text"
                  placeholder="Điền mã khảo sát 1"
                  value={id1}
                  onChange={(e) => setId1(e.target.value)}
                  className="w-60 border-b border-secondary border-0 py-2 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                />
              </div>
              <div>
                <span className="text-lg mr-4 font-semibold">Khảo sát 2:</span>
                <input
                  type="text"
                  placeholder="Điền mã khảo sát 2"
                  value={id2}
                  onChange={(e) => setId2(e.target.value)}
                  className="w-60 border-b border-secondary border-0 py-2 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                />
              </div>
            </div>

            {loading ? (
              <div className="animate-pulse text-center text-gray-500">Loading...</div>
            ) : (
              <div className="my-12 ">
                {respondent1 && respondent2 && (
                  <div className="overflow-x-auto rounded shadow">
                    <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
                      <thead className="bg-gray-100 text-left">
                        <tr>
                          <th className="border px-4 py-2">Field</th>
                          <th className="border px-4 py-2 border-l-[#ff6384] border-l-2 bg-[#ffe0e6]">
                            {respondent1._id}
                          </th>
                          <th className="border px-4 py-2 border-r-[#36a2eb] border-r-2 bg-[#d7ecfb]">
                            {respondent2._id}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="even:bg-gray-50">
                          <td className="border px-4 py-2">Name</td>
                          <td className="border px-4 py-2">{respondent1.respondent_name}</td>
                          <td className="border px-4 py-2">{respondent2.respondent_name}</td>
                        </tr>
                        <tr className="even:bg-gray-50">
                          <td className="border px-4 py-2">Email</td>
                          <td className="border px-4 py-2">{respondent1.respondent_email}</td>
                          <td className="border px-4 py-2">{respondent2.respondent_email}</td>
                        </tr>
                        <tr className="even:bg-gray-50">
                          <td className="border px-4 py-2">Role</td>
                          <td className="border px-4 py-2">{respondent1.respondent_role}</td>
                          <td className="border px-4 py-2">{respondent2.respondent_role}</td>
                        </tr>
                        <tr className="even:bg-gray-50">
                          <td className="border px-4 py-2">Organization</td>
                          <td className="border px-4 py-2">{respondent1.org_name}</td>
                          <td className="border px-4 py-2">{respondent2.org_name}</td>
                        </tr>
                        <tr className="even:bg-gray-50">
                          <td className="border px-4 py-2">Field</td>
                          <td className="border px-4 py-2">{respondent1.field}</td>
                          <td className="border px-4 py-2">{respondent2.field}</td>
                        </tr>
                        <tr className="even:bg-gray-50">
                          <td className="border px-4 py-2">Staff Size</td>
                          <td className="border px-4 py-2">{respondent1.staff_size}</td>
                          <td className="border px-4 py-2">{respondent2.staff_size}</td>
                        </tr>
                        <tr className="even:bg-gray-50">
                          <td className="border px-4 py-2">Date</td>
                          <td className="border px-4 py-2">{respondent1.date}</td>
                          <td className="border px-4 py-2">{respondent2.date}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            <SurveyComparison id1={id1} id2={id2} />
          </div>
        )}
      </div>

      <div
        className={`transition-opacity duration-500 ${
          activeTab === "respondents" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {activeTab === "respondents" && <RespondentsList />}
      </div>

      <div
        className={`transition-opacity duration-500 ${
          activeTab === "report" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {activeTab === "report" && <Report />}
      </div>
    </div>
  );
}
