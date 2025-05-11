import { NavLink } from 'react-router-dom';
import Button1 from "./Button1";
import Button2 from "./Button2";
import Button3 from "./Button3";
import Card from './Card';

export default function Home() {
  return (
    <div className="w-full mx-auto lg:pt-4">
      <div className="min-h-[80vh] flex flex-col justify-between text-center border-4 border-tertiary rounded-2xl p-6 mb-16 bg-cover bg-center bg-[url('/bg-hero.png')]">
        <h1 className="p-2 border border-2 border-secondary rounded-2xl bg-white lg:text-3xl text-xl font-bold text-primary drop-shadow-[5px_5px_0px_#b10913]">
          KHẢO SÁT AN TOÀN THÔNG TIN DÀNH CHO DOANH NGHIỆP VỪA VÀ NHỎ
        </h1>
        <div className="lg:flex lg:flex-row lg:justify-around lg:scale-100 scale-75 grid grid-cols-2 gap-x-16 place-items-center">
          <Card
            title="40"
            name="CÂU HỎI"
            $bgColor1="#06befb"
            $bgColor2="#1ac3fb"
            $bgColor3="#f5f5f5"
            $delay="0s"
          />
          <Card
            title="10"
            name="PHÚT LÀM"
            $bgColor1="#fb6762"
            $bgColor2="#B80C14"
            $bgColor3="#f5f5f5"
            $delay="0.25s"
          />
          <div className="col-span-2">
            <Card
            title="5"
            name="KHÍA CẠNH"
            $bgColor1="#06ff88"
            $bgColor2="#43dd93"
            $bgColor3="#f5f5f5"
            $delay="0.5s"
            />
          </div>     
        </div>

        <div className='flex lg:flex-row lg:gap-12 lg:justify-center flex-col gap-8 items-center'>
          <NavLink to="/create">
            <Button1 />
          </NavLink>
          <NavLink to="/result">
            <Button2 />
          </NavLink>
        </div>
      </div>

      <h2 className="text-2xl mb-4 font-bold text-primary">GIỚI THIỆU</h2>
      <div className="lg:grid grid-cols-5 items-center">
        <div className="col-span-3 p-4 border border-2 border-secondary rounded-2xl bg-white drop-shadow-[4px_4px_0px_#b10913]">
          <p className='text-secondary'>
            - Sự phát triển nhanh chóng của Công nghệ Thông tin (CNTT) mang lại nhiều lợi ích nhưng cũng đặt ra thách thức về An toàn An ninh Thông tin (ATTT), đặc biệt trong quá trình chuyển đổi số. Các nguy cơ mất ATTT có thể xuất phát từ nhiều yếu tố như nhân lực, quy định, đầu tư hay công nghệ.
            <br />
            - Nhằm hỗ trợ doanh nghiệp tự đánh giá ATTT, Viện CNTT - ĐHQG Hà Nội (VNU-ITI) đã nghiên cứu và phát triển “Bộ công cụ đánh giá ATTT dành cho doanh nghiệp nhỏ và vừa” dựa trên các tiêu chuẩn quốc tế và Việt Nam. Công cụ này sẽ giúp lãnh đạo và nhân sự không chuyên về ATTT có thể đánh giá tình trạng ATTT của tổ chức mình.
            <br />
            - Nhằm phát triển Bộ công cụ đánh giá sát với các nguy cơ, rủi ro an toàn thông tin, nhóm nghiên cứu cũng tham khảo và lựa chọn các yếu tố phù hợp để xây dựng <strong>Bộ công cụ dựa theo tiêu chuẩn quốc tế ISO 2700x</strong> và <strong>Khung an ninh mạng của Viện Tiêu chuẩn Hoa Kỳ (NIST 800)</strong>.
          </p>
        </div>
        <div className="lg:col-span-2">
          <img src="1st.png" alt="Survey Introduction" className="w-full max-h-[350px] object-contain rounded-lg" />
        </div>
      </div>
      
      <h2 className="text-2xl my-4 font-bold text-primary">SƠ BỘ CÔNG CỤ</h2>
      <div className="lg:grid grid-cols-7 items-center">
        <div className="col-span-4">
          <img src="2nd.png" alt="Survey Introduction" className="w-full max-h-[600px] object-contain rounded-lg" />
        </div>
        <div className="col-span-3 p-4 border border-2 border-secondary rounded-2xl bg-white drop-shadow-[4px_4px_0px_#b10913]">
          <p className='text-secondary'>
            - Bộ công cụ này được thiết kế cho các doanh nghiệp vừa và nhỏ, đặc biệt là những đơn vị chưa có bộ phận ATTT chuyên trách hoặc chưa quan tâm đúng mức đến vấn đề này. Với hệ thống câu hỏi đơn giản, dễ hiểu và có thể đo lường, công cụ hướng đến CEO và nhân sự nắm rõ chính sách doanh nghiệp nhưng không chuyên sâu về ATTT hay CNTT. Mục tiêu là giúp doanh nghiệp tự đánh giá sơ bộ mức độ an toàn thông tin của mình.
            <br />
            - Bộ công cụ tập trung vào 5 khía cạnh quan trọng đó là <strong>Quy chế, Tổ chức, Nhân lực, Đầu tư và Vận hành</strong>. Sau khi hoàn tất khảo sát, doanh nghiệp sẽ nhận được khuyến nghị sơ bộ, từ đó có cái nhìn rõ ràng hơn về tình trạng an toàn thông tin, xác định các điểm yếu cần cải thiện và đưa ra quyết định phù hợp, từ đầu tư thêm nguồn lực đến tìm kiếm hỗ trợ chuyên gia.
            <br />
            - <strong>Lưu ý:</strong> Để có kết quả đánh giá chính xác, người thực hiện cần đọc kỹ câu hỏi và trả lời trung thực, sát với thực tế của doanh nghiệp.
          </p>
        </div>
      </div>

      <div className='mt-12 grid place-content-center'>
        <Button3/>
      </div>

    </div>
  );
}
