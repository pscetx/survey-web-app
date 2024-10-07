import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LookUp() {
  const [respondentId, setRespondentId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redirect to the results page with the respondent ID
    navigate(`/result/${respondentId}`);
  };

  return (
    <div className="result-input-container">
      <h2 className="text-xl mb-4">Nhập mã khảo sát</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={respondentId}
          onChange={(e) => setRespondentId(e.target.value)}
          placeholder="Enter survey ID"
          className="border p-2 mb-4 w-full"
          required
        />
        <button type="submit" className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-primary hover:text-white h-9 rounded-md px-3 cursor-pointer">
          Tra cứu
        </button>
      </form>
    </div>
  );
}