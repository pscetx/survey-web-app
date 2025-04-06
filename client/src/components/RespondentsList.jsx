import React, { useEffect, useState } from "react";
import Loader from "./Loader";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ITEMS_PER_PAGE = 15;

const RespondentsList = () => {
  const [respondents, setRespondents] = useState([]);
  const [filteredRespondents, setFilteredRespondents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const totalPages = Math.ceil(filteredRespondents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  useEffect(() => {
    async function fetchRespondents() {
      try {
        const response = await fetch(`${API_BASE_URL}/respondent`);
        if (!response.ok) {
          throw new Error(`Error fetching respondents: ${response.statusText}`);
        }
        const data = await response.json();

        const respondentsWithStatus = await Promise.all(
          data.map(async (respondent) => {
            try {
              const answerResponse = await fetch(`${API_BASE_URL}/answer/${respondent._id}`);
              if (!answerResponse.ok) {
                throw new Error(`Error fetching answer: ${answerResponse.statusText}`);
              }
              const answerData = await answerResponse.json();
              return { ...respondent, is_finished: answerData.is_finished };
            } catch {
              return { ...respondent, is_finished: false };
            }
          })
        );

        setRespondents(respondentsWithStatus);
        setFilteredRespondents(respondentsWithStatus);
        setLoading(false);
      } catch (error) {
        setError("Error fetching respondents.");
        setLoading(false);
        console.error(error);
      }
    }

    fetchRespondents();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    setFilteredRespondents(
      respondents.filter((respondent) => {
        const id = respondent._id?.toLowerCase() || "";
        const email = respondent.respondent_email?.toLowerCase() || "";
        const date = respondent.date?.toLowerCase() || "";
        return (
          id.includes(lowerCaseQuery) ||
          email.includes(lowerCaseQuery) ||
          date.includes(lowerCaseQuery)
        );
      })
    );
  }, [searchQuery, respondents]);

  const handleDelete = async (id) => {
    try {
      const respondentResponse = await fetch(`${API_BASE_URL}/respondent/${id}`, {
        method: "DELETE",
      });
      if (!respondentResponse.ok) {
        throw new Error(`Error deleting respondent: ${respondentResponse.statusText}`);
      }

      const answerResponse = await fetch(`${API_BASE_URL}/answer/${id}`, {
        method: "DELETE",
      });
      if (!answerResponse.ok) {
        throw new Error(`Error deleting answer: ${answerResponse.statusText}`);
      }

      setRespondents((prev) => prev.filter((respondent) => respondent._id !== id));
    } catch (error) {
      console.error("Error deleting respondent or answer:", error);
      setError("Error deleting respondent or answer.");
    }
  };

  const handleToggleBanned = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/answer/banned/${id}`, {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error(`Error toggling banned state: ${response.statusText}`);
      }

      setRespondents((prev) =>
        prev.map((respondent) =>
          respondent._id === id
            ? { ...respondent, is_banned: !respondent.is_banned }
            : respondent
        )
      );
    } catch (error) {
      console.error("Error toggling banned state:", error);
      setError("Error toggling banned state.");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl mb-4 font-bold text-primary">DANH SÁCH KHẢO SÁT</h2>
      <input
        type="text"
        placeholder="Tìm kiếm theo mã khảo sát, email hoặc thời gian thực hiện"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <div className="overflow-x-auto rounded-md shadow">
        <table className="min-w-full table-auto border border-gray-200 text-xs">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="border p-2">Mã khảo sát</th>
              <th className="border p-2">Email khảo sát</th>
              <th className="border p-2">Tên người khảo sát</th>
              <th className="border p-2">Chức vụ</th>
              <th className="border p-2">Tên tổ chức</th>
              <th className="border p-2">Lĩnh vực</th>
              <th className="border p-2">Nhân sự</th>
              <th className="border p-2">Thời gian thực hiện</th>
              <th className="border p-2">Hoàn thành</th>
              <th className="border px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredRespondents.slice(startIndex, startIndex + ITEMS_PER_PAGE).map((respondent) => (
              <tr key={respondent._id} className="even:bg-gray-50">
                <td className="border p-2">{respondent._id}</td>
                <td className="border p-2">{respondent.respondent_email}</td>
                <td className="border p-2">{respondent.respondent_name}</td>
                <td className="border p-2">{respondent.respondent_role}</td>
                <td className="border p-2">{respondent.org_name}</td>
                <td className="border p-2">{respondent.field}</td>
                <td className="border p-2">{respondent.staff_size}</td>
                <td className="border p-2">{respondent.date}</td>
                <td className="border p-2 italic">{respondent.is_finished ? "true" : "false"}</td>
                <td className=" px-4 py-2 w-44 flex justify-center items-center gap-2">
                  <button
                    onClick={() => {
                      if (window.confirm("Xóa dữ liệu khảo sát này? Dữ liệu sẽ không thể được khôi phục.")) {
                        handleDelete(respondent._id);
                      }
                    }}
                    className="px-6 py-1 bg-red-600 text-white rounded"
                  >
                    Xóa
                  </button>
                  <button
                    onClick={() => handleToggleBanned(respondent._id)}
                    className={`px-6 py-1 rounded ${
                      respondent.is_banned ? "bg-gray-600" : "bg-sky-600"
                    } text-white`}
                  >
                    {respondent.is_banned ? "Ẩn" : "Hiện"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center gap-2 text-xs">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default RespondentsList;
