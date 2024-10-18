import { NavLink } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full mx-auto py-8 p-4">
      <div className="text-center border-2 border-primary rounded-lg p-6 mb-16 bg-cover bg-right bg-[url('/bg-hero.png')]">
        <h1 className="lg:text-4xl text-2xl font-bold text-primary mb-10">
          BỘ CÔNG CỤ KHẢO SÁT AN TOÀN THÔNG TIN <br /> DÀNH CHO DOANH NGHIỆP VỪA VÀ NHỎ
        </h1>
        <p className="lg:text-2xl text-xl font-bold">
          40 câu hỏi
          <br />
          5 khía cạnh: Quy chế, Tổ chức, Nhân lực, Đầu tư và Vận hành
        </p>
        <NavLink to="/create">
          <button className="lg:text-2xl mt-10 bg-red-700 text-white font-bold py-2 px-8 rounded-lg hover:bg-primary transition">
            LÀM BÀI NGAY
          </button>
        </NavLink>
      </div>

      <div className="text-center mb-10">
        <p className="text-lg font-semibold">
          BẠN ĐÃ LÀM BÀI KHẢO SÁT? TRA CỨU KẾT QUẢ <a href="/result" className="text-primary underline">TẠI ĐÂY</a>
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-center text-2xl font-bold mb-6">
          GIỚI THIỆU VỀ KHẢO SÁT
        </h2>
        <div className="flex flex-col gap-y-6 lg:grid lg:grid-cols-5 lg:gap-x-10">
          <div className="text-justify text-gray-600 lg:col-span-3">
            <p className="mb-4">
              Cùng với sự phát triển nhanh chóng của công nghệ thông tin và những lợi ích mà nó đem lại, việc sử dụng và thích nghi với các hệ thống thông tin đã trở thành một điều cơ bản ở bất cứ công ty, doanh nghiệp nào. Tuy nhiên đi kèm với đó là những khó khăn, thách thức liên quan đến vấn đề An toàn An ninh thông tin (ATTT). Do đó, việc có một phương pháp đánh giá tình hình an toàn thông tin cho doanh nghiệp là rất cần thiết.
            </p>
            <div className="lg:hidden mb-4">
              <img
                src="img.jpg"
                alt="Survey Introduction"
                className="rounded-lg shadow-lg h-[250px] object-cover mx-auto"
              />
            </div>
            <p>
              Với tinh thần đó, viện Công nghệ thông tin Đại học Quốc Gia Hà Nội (VNU-ITI) tìm hiểu các chính sách, tiêu chuẩn Quốc Tế cũng như Tiêu chuẩn Việt Nam liên quan đến An toàn An ninh thông tin nhằm đưa ra một bộ câu hỏi đánh giá về tình hình ATTT theo 5 khía cạnh: Quy chế, Tổ chức, Nhân lực, Đầu tư, Vận hành. Từ đó tìm ra điểm yếu về an toàn thông tin của doanh nghiệp và đưa ra những lời khuyên phù hợp nhằm tránh rủi ro về an toàn thông tin.
            </p>
          </div>
          <div className="hidden lg:block lg:col-span-2">
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
