import { NavLink } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full mx-auto md:py-8 md:px-16 p-4">
      <div className="text-center border-2 border-primary rounded-lg p-6 mb-16 bg-cover bg-right bg-[url('/bg-hero.png')]">
        <h1 className="md:text-4xl text-2xl font-bold text-primary mb-10">
          BỘ CÔNG CỤ ĐÁNH GIÁ AN TOÀN THÔNG TIN <br /> DÀNH CHO DOANH NGHIỆP NHỎ VÀ VỪA
        </h1>
        <p className="md:text-2xl text-xl font-bold">
          40 câu hỏi
          <br />
          5 trụ cột: Quy chế, Tổ chức, Nhân sự, Đầu tư và Vận hành
        </p>
        <NavLink to="/create">
          <button className="md:text-2xl mt-10 bg-red-700 text-white font-bold py-2 px-8 rounded-lg hover:bg-primary transition">
            LÀM BÀI NGAY
          </button>
        </NavLink>
      </div>

      <div className="text-center mb-16">
        <p className="text-lg font-semibold">
          BẠN ĐÃ LÀM BÀI KHẢO SÁT? TRA CỨU KẾT QUẢ <a href="/result" className="text-primary underline">TẠI ĐÂY</a>
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-center text-2xl font-bold mb-6">
          GIỚI THIỆU VỀ KHẢO SÁT
        </h2>
        <div className="flex flex-col gap-y-6 md:grid md:grid-cols-5 md:gap-x-10">
          <div className="text-justify text-gray-600 md:col-span-3">
            <p className="mb-4">
              Cùng với sự phát triển nhanh chóng của công nghệ thông tin và những lợi ích mà nó đem lại, việc sử dụng và thích nghi với các hệ thống thông tin đã trở thành một điều cơ bản ở bất cứ công ty, doanh nghiệp nào. Tuy nhiên đi kèm với đó là những khó khăn, thách thức liên quan đến vấn đề An toàn An ninh thông tin (ATTT). Theo thống kê của Công ty Cổ phần Công nghệ An ninh mạng Quốc Gia Việt Nam thì trong năm 2023, con người là điểm yếu bị tin tặc tấn công nhiều nhất với tỉ lệ lên tới 32.6% các vụ tấn công. Do đó việc nâng cao nhận thức cán bộ cũng như áp dụng các bộ tiêu chuẩn vào môi trường làm việc của doanh nghiệp, tổ chức đang trở nên cấp thiết.
            </p>
            <div className="md:hidden mb-4">
              <img
                src="img.jpg"
                alt="Survey Introduction"
                className="rounded-lg shadow-lg h-[250px] object-cover mx-auto"
              />
            </div>
            <p>
              Với tinh thần đó, Viện Công nghệ thông tin Đại học Quốc Gia Hà Nội (VNU-ITI) tìm hiểu các chính sách, tiêu chuẩn Quốc Tế cũng như Tiêu chuẩn Việt Nam liên quan đến An toàn An ninh thông tin nhằm đưa ra một bộ câu hỏi đánh giá về tình hình ATTT của doanh nghiệp với nội dung phù hợp để các lãnh đạo và nhân viên không làm việc trong mảng CNTT cũng có thể thực thi tự đánh giá ATTT trong tổ chức, doanh nghiệp.
            </p>
          </div>
          <div className="hidden md:block md:col-span-2">
            <img
              src="img.jpg"
              alt="Survey Introduction"
              className="rounded-lg shadow-lg h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
