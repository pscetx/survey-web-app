import React from 'react';

export default function Info() {
  return (
    <div className="max-w-4xl mx-auto p-6 shadow-sm rounded-lg">
      <h2 className="lg:text-3xl text-2xl mb-6 font-bold text-primary text-center">HƯỚNG DẪN SỬ DỤNG</h2>

      <div className="space-y-6 text-lg leading-6 text-gray-800">
        <p>
          Mọi thắc mắc, xin vui lòng liên hệ email: <strong>sme.iti@vnu.edu.vn</strong><br /><br />
          Chào mừng bạn đến với <strong>Bộ công cụ khảo sát An toàn thông tin dành cho doanh nghiệp vừa và nhỏ! </strong><br />
          Dưới đây sẽ là hướng dẫn sử dụng chi tiết giúp bạn hoàn thành khảo sát một cách dễ dàng.
        </p>

        <h3 className="text-xl font-semibold text-secondary">Bước 1: Truy cập vào trang khảo sát</h3>
        <p>
          Mở trình duyệt và truy cập vào trang web qua liên kết: <a href="https://sme.iti.vnu.edu.vn/" className="text-blue-600 underline">sme.iti.vnu.edu.vn</a>.
          Tại trang chủ, nhấn vào mục <strong>"LÀM BÀI KHẢO SÁT"</strong> trên thanh điều hướng hoặc tìm nút <strong>“LÀM BÀI NGAY”</strong> tại giao diện trang chủ.
        </p>

        <h3 className="text-xl font-semibold text-secondary">Bước 2: Điền thông tin tiền khảo sát</h3>
        <p>
          Sau khi nhấn vào <strong>"LÀM BÀI KHẢO SÁT"</strong>, bạn sẽ được đưa đến trang thông tin tiền khảo sát.
          Vui lòng điền các thông tin liên quan đến doanh nghiệp của bạn.
        </p>
        <p className="italic">
          Lưu ý: Bạn vẫn có thể thay đổi các thông tin này trong quá trình làm bài khảo sát. 
          Dữ liệu thu thập sẽ chỉ được sử dụng cho mục đích nghiên cứu và sẽ không được trao đổi với bất kỳ bên thứ ba nào khác nhằm mục đích thương mại.
        </p>

        <h3 className="text-xl font-semibold text-secondary">Bước 3: Bắt đầu làm khảo sát</h3>
        <p>
          Sau khi nhấn vào <strong>“Bắt đầu làm bài khảo sát”</strong>, bạn sẽ được đưa đến giao diện khảo sát. 
          Bạn có thể thay đổi các thông tin tiền khảo sát nếu muốn. Kéo xuống và các câu hỏi sẽ được hiển thị tuần tự, bạn chọn đáp án bằng cách nhấp vào 01 trong các tùy chọn.
        </p>
        <p>
          Mỗi câu hỏi sẽ có 5 đáp án với nội dung tương ứng như sau:
        </p>
        <ul className="list-disc pl-5">
          <li>0 điểm - Chưa từng nghe đến yếu tố an toàn thông tin này</li>
          <li>1 điểm - Đã từng nghe tới yếu tố nhưng chưa có cách xử lý</li>
          <li>2 điểm - Đã xây dựng được phương pháp nhưng chưa áp dụng hiệu quả</li>
          <li>3 điểm - Đã có phương pháp giảm thiểu yếu tố rủi ro hiệu quả</li>
          <li>4 điểm - Đã thích ứng được với vấn đề và không còn gặp khó khăn</li>
        </ul>
        <p>
          Đảm bảo rằng bạn chọn đáp án sát với tình hình thực tế tại doanh nghiệp của mình nhất. 
          Hệ thống sẽ tự động ghi nhận câu trả lời ngay sau khi bạn chọn.
        </p>

        <h3 className="text-xl font-semibold text-secondary">Bước 4: Điều hướng giữa các câu hỏi</h3>
        <p>
          Bạn có thể nhấn vào nút <strong>“Trước”</strong> / <strong>“Sau”</strong> để di chuyển giữa các câu hỏi trước đó / kế tiếp.
          Bạn có thể tùy ý chọn câu hỏi mình muốn trả lời thông qua bảng đánh số câu hỏi. Nhấn nút <strong>“Đánh dấu”</strong> sẽ tạm thời bôi vàng câu hỏi hiện tại.
        </p>

        <h3 className="text-xl font-semibold text-secondary">Bước 5: Hoàn thành khảo sát</h3>
        <p>
          Nhấn nút <strong>"Hoàn tất khảo sát"</strong> để kết thúc khảo sát của bạn và nhận kết quả. Đảm bảo rằng bạn đã hoàn thành tất cả câu hỏi trước khi gửi, 
          vì bạn không thể chỉnh sửa câu trả lời sau khi đã nộp bài.
        </p>

        <h3 className="text-xl font-semibold text-secondary">Bước 6: Xem kết quả khảo sát</h3>
        <p>
          Sau khi gửi khảo sát, bạn sẽ được hiển thị kết quả phân tích dưới dạng biểu đồ, nhận xét tổng quan và bảng điểm chi tiết.
        </p>
        <p className="italic">
          Lưu ý: Lưu lại mã khảo sát để có thể tra cứu kết quả trong tương lai.
        </p>

        <p className="font-semibold text-center text-primary">
          Chúc bạn hoàn thành bài khảo sát thành công và nhận được kết quả hữu ích!
        </p>
      </div>
    </div>
  );
}