import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="flex justify-around items-center bg-primary">
        <NavLink to="/" className="flex items-center">
          <img alt="ITI logo" className="h-12 inline" src="/logo.png"></img>
        </NavLink>
        <div className="flex justify-between items-center">
          <NavLink
            className="inline-flex items-center justify-center whitespace-nowrap text-xs text-white font-bold h-16 w-56 relative border-b-2 border-b-primary hover:border-b-transparent before:content-[''] before:absolute before:left-1/2 before:bottom-0 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:-translate-x-1/2"
            to="/"
            >
            TRANG CHỦ
          </NavLink>
          <NavLink
            className="inline-flex items-center justify-center whitespace-nowrap text-xs text-white font-bold h-16 w-56 relative border-b-2 border-b-primary hover:border-b-transparent before:content-[''] before:absolute before:left-1/2 before:bottom-0 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:-translate-x-1/2"
            to="/info"
            >
            HƯỚNG DẪN SỬ DỤNG
          </NavLink>
          <NavLink
            className="inline-flex items-center justify-center whitespace-nowrap text-xs text-white font-bold h-16 w-56 relative border-b-2 border-b-primary hover:border-b-transparent before:content-[''] before:absolute before:left-1/2 before:bottom-0 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:-translate-x-1/2"
            to="/create"
            >
            LÀM BÀI KHẢO SÁT
          </NavLink>
          <NavLink
            className="inline-flex items-center justify-center whitespace-nowrap text-xs text-white font-bold h-16 w-56 relative border-b-2 border-b-primary hover:border-b-transparent before:content-[''] before:absolute before:left-1/2 before:bottom-0 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:-translate-x-1/2"
            to="/result"
            >
            TRA CỨU KẾT QUẢ
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
