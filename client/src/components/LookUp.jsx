import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LookUp() {
  const [respondentId, setRespondentId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/result/${respondentId}`);
  };

  return (
    <div className="result-input-container">
      <h2 className="text-2xl mb-4 font-bold text-primary">TRA CỨU KẾT QUẢ</h2>
      <div className='shadow rounded-md overflow-hidden p-4'>
        <h2 className="text-md mb-4">Nhập mã khảo sát để tra cứu kết quả.</h2>
        <form onSubmit={handleSubmit}>
          <div className='flex text-md rounded-sm border-b border-secondary'>
            <input
            type="text"
            value={respondentId}
            onChange={(e) => setRespondentId(e.target.value)}
            placeholder="Điền mã khảo sát của bạn"
            className="flex-1 border-0 py-2 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            required
          />
          </div>
          <button type="submit" className="mt-4 inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-primary hover:text-white h-9 rounded-md px-3 cursor-pointer">
            Tra cứu kết quả
          </button>
        </form>
      </div>
      <div className="lg:mt-16 mt-8 text-sm leading-6 text-gray-600">
        <div className='italic font-semibold'>
        Lưu ý:</div>
        Mã khảo sát đã được cung cấp sau khi bạn điền thông tin tiền khảo sát.<br />
        Bạn chỉ có thể tra cứu kết quả sau khi đã hoàn tất khảo sát.<br /><br />
        Chưa hoàn tất khảo sát? Tiếp tục làm tại <a href="/create" className="text-primary underline">đây</a>.<br />
        Xem chi tiết hướng dẫn làm khảo sát tại <a href="/info" className="text-primary underline">đây</a>.<br />
      </div>
    </div>
  );
}