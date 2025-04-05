import React, { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';
import Loader from "./Loader";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SurveyComparison({ id1, id2 }) {
  const [averages, setAverages] = useState({ survey1: null, survey2: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = ['Quy chế', 'Tổ chức', 'Nhân lực', 'Đầu tư', 'Vận hành'];

  const fetchSurveyAverage = async (id) => {
    const response = await fetch(`${API_BASE_URL}/answer/${id}`);
    if (!response.ok) throw new Error(`Survey ${id} not found`);
    const data = await response.json();

    if (!data.is_finished) throw new Error(`Không thể so sánh do khảo sát mã ${id} chưa hoàn thiện!`);

    const questions = data.questions.slice(0, -1);
    const score = [0, 0, 0, 0, 0];
    const count = [0, 0, 0, 0, 0];

    for (let q of questions) {
      const qRes = await fetch(`${API_BASE_URL}/question/${q._id}`);
      const qData = await qRes.json();
      const index = categories.indexOf(qData.category);
      if (index !== -1) {
        score[index] += q.score;
        count[index]++;
      }
    }

    return score.map((s, i) => (count[i] > 0 ? s / count[i] : 0));
  };

  const compare = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const [avg1, avg2] = await Promise.all([
        fetchSurveyAverage(id1),
        fetchSurveyAverage(id2)
      ]);
      setAverages({ survey1: avg1, survey2: avg2 });
    } catch (err) {
      setError(err.message); // Set error state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id1 && id2) {
      compare();
    }
  }, [id1, id2]);

  const data = {
    labels: categories.map((c) => c.toUpperCase()),
    datasets: [
      {
        label: `${id1}`,
        data: averages.survey1 || [],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      },
      {
        label: `${id2}`,
        data: averages.survey2 || [],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointBackgroundColor: 'rgb(54, 162, 235)'
      }
    ]
  };

  const options = {
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 4,
        ticks: { stepSize: 1 }
      }
    }
  };

  return (
    <div className="mt-10 mb-16">
      {loading && <Loader />}

      {error && <p className="text-red-600">{error}</p>}

      <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-10 gap-4 mt-4 overflow-hidden'>
        {averages.survey1 && averages.survey2 && (
          <div className="max-w-sm mx-auto">
            <Radar data={data} options={options} />
          </div>
        )}

        {averages.survey1 && averages.survey2 && (
          <div className="overflow-x-auto overflow-hidden">
            <table className="table-auto w-full rounded-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left">Phân loại</th>
                  <th className="border-l-[#ff6384] border-l-4 bg-[#ffe0e6]"></th>
                  <th className="border-r-[#36a2eb] border-r-4 bg-[#d7ecfb]"></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border-b border-gray-200 p-2">{category}</td>
                    <td className="border-b border-gray-200 p-2 text-center">
                      {averages.survey1[index]?.toFixed(2) || 'N/A'}
                    </td>
                    <td className="border-b border-gray-200 p-2 text-center">
                      {averages.survey2[index]?.toFixed(2) || 'N/A'}
                    </td>
                  </tr>
                ))}
                <tr className="bg-tertiary font-bold">
                  <td className="border-b border-gray-200 text-primary p-2">Trung bình</td>
                  <td className="border-b border-gray-200 text-secondary p-2 text-center">
                    {averages.survey1.length ? (
                      (averages.survey1.reduce((acc, val) => acc + val, 0) / averages.survey1.length).toFixed(2)
                    ) : 'N/A'}
                  </td>
                  <td className="border-b border-gray-200 text-secondary p-2 text-center">
                    {averages.survey2.length ? (
                      (averages.survey2.reduce((acc, val) => acc + val, 0) / averages.survey2.length).toFixed(2)
                    ) : 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
