import React from 'react';

export default function Info() {
  return (
    <div className="max-w-4xl mx-auto p-6 shadow-md rounded-lg">
      <h2 className="text-3xl mb-6 font-bold text-primary text-center">HƯỚNG DẪN SỬ DỤNG</h2>

      <div className="space-y-6 text-lg leading-7 text-gray-700">
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
          Vui lòng điền các thông tin liên quan đến cá nhân doanh nghiệp của bạn.
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
          Lưu ý: Nhớ lưu lại mã khảo sát để có thể tra cứu lại kết quả trong tương lai.
        </p>

        <p className="font-semibold text-center text-primary">
          Chúc bạn hoàn thành bài khảo sát thành công và nhận được kết quả hữu ích!
        </p>
      </div>
    </div>
  );
}
// Cùng với sự phát triển nhanh chóng của công nghệ thông tin (CNTT) và những lợi ích mà nó đem lại, việc sử dụng và thích nghi với các hệ thống thông tin đã trở thành một điều cơ bản ở bất cứ công ty, tổ chức, doanh nghiệp nào, đặc biệt trong bối cảnh của cuộc cách mạng số, chuyển đổi số mạnh mẽ hiện nay. Tuy vậy, đi kèm với đó là những khó khăn, thách thức liên quan đến vấn đề An toàn An ninh thông tin (ATTT), đây là một vấn đề trọng tâm, then chốt khi thực hiện chuyển đổi số của các tổ chức, doanh nghiệp. Các nguy cơ mất an toàn thông tin của mỗi tổ chức, doanh nghiệp có thể đến từ nhiều yếu tố khác nhau, nhưng có thể dễ dàng nhận thấy những yếu tố chính như nguồn nhân lực, thể chế - quy định, nguồn lực đầu tư, công nghệ là những yếu tố có ảnh hưởng quyết định.

// Với mong muốn đưa ra những khuyến cáo sơ bộ về các nguy cơ rủi ro đối với các tổ chức, doanh nghiệp, Viện Công nghệ thông tin, Đại học Quốc Gia Hà Nội (VNU-ITI) đã đưa ra “Bộ công cụ đánh giá an toàn thông tin dành cho doanh nghiệp vừa và nhỏ” dựa trên các chính sách, tiêu chuẩn Quốc Tế cũng như Tiêu chuẩn Việt Nam liên quan đến An toàn An ninh thông tin. Bộ công cụ này sẽ đánh giá về tình hình ATTT của tổ chức, doanh nghiệp dựa trên bộ câu hỏi với nội dung phù hợp để các lãnh đạo và nhân viên chuyên trách dù không có kiến thức chuyên sâu trong lĩnh vực ATTT hay CNTT cũng có thể trả lời và thực thi tự đánh giá ATTT trong tổ chức, doanh nghiệp của mình.


// Để phát triển Bộ công cụ đánh giá an toàn thông tin này, nhóm nghiên cứu tại VNU-ITI đã tiếp cận theo phương pháp sử dụng Kiến trúc Tổng thể cho Tổ chức và Doanh nghiệp (Enterprise Architecture). Dựa trên phương pháp này, nhóm đã lựa chọn các yếu tố quan trọng để bao quát toàn diện các vấn đề an toàn thông tin trong hoạt động hằng ngày của doanh nghiệp, cụ thể là 5 khía cạnh: Quy chế, Tổ chức, Nhân lực, Đầu tư và Vận hành. Bên cạnh đó, để Bộ công cụ đánh giá sát với các nguy cơ, rủi ro an toàn thông tin, nhóm nghiên cứu cũng tham khảo và lựa chọn các yếu tố phù hợp để xây dựng Bộ công cụ dựa theo tiêu chuẩn quốc tế ISO 2700x và Khung an ninh mạng của Viện Tiêu chuẩn Hoa Kỳ (NIST 800).


// Bộ công cụ này dành cho các doanh nghiệp, tổ chức vừa và nhỏ, những đơn vị chưa có bộ phận an toàn thông tin thường trực hoặc chưa chú trọng đến vấn đề này. Bộ công cụ tập trung vào việc tạo ra các câu hỏi đơn giản, dễ hiểu và dễ trả lời, có thể đo lường được, hướng đến các Giám đốc Điều hành (CEO) hoặc nhân sự hiểu biết về chính sách và hoạt động của doanh nghiệp, nhưng cũng không chuyên sâu về ATTT hay CNTT. Mục tiêu là hỗ trợ doanh nghiệp tự đánh giá sơ bộ tình hình an toàn thông tin của mình.


// Bộ công cụ tiến hành đánh giá, khảo sát trên 5 khía cạnh: Quy chế, Tổ chức, Nhân lực, Đầu tư và Vận hành. Sau khi hoàn tất khảo sát, bộ công cụ sẽ cung cấp khuyến nghị sơ bộ về an toàn thông tin dựa trên các khía cạnh được đánh giá. Dựa vào kết quả này, doanh nghiệp có thể hiểu rõ hơn về tình trạng an toàn thông tin và đưa ra quyết định đầu tư thêm nguồn lực vào các mặt còn hạn chế, tự kiểm tra sâu hơn hoặc tìm đến sự hỗ trợ của chuyên gia để đảm bảo an toàn thông tin.


// Lưu ý: Để nhận được khuyến nghị chính xác nhất, người thực hiện khảo sát cần đọc kỹ câu hỏi và trả lời sát với tình hình thực tế của doanh nghiệp.