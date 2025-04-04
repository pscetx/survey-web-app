import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <nav className="bg-primary lg:px-10 lg:py-0 px-5 py-2">
        <div className="flex justify-between items-center">
          <NavLink to="/" className="flex items-center">
            <img alt="ITI logo" className="h-10 lg:h-12" src="/logo.png" />
          </NavLink>

          <button
            className="text-white lg:hidden focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>

          <div className="hidden lg:flex space-x-6">
            <NavLink
              className="inline-flex items-center justify-center whitespace-nowrap text-xs text-white font-bold h-16 w-40 relative border-b-16 border-b-primary hover:border-b-transparent before:content-[''] before:absolute before:left-1/2 before:bottom-0 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:-translate-x-1/2"
              to="/"
            >
              TRANG CHỦ
            </NavLink>
            <NavLink
              className="inline-flex items-center justify-center whitespace-nowrap text-xs text-white font-bold h-16 w-40 relative border-b-16 border-b-primary hover:border-b-transparent before:content-[''] before:absolute before:left-1/2 before:bottom-0 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:-translate-x-1/2"
              to="/info"
            >
              HƯỚNG DẪN SỬ DỤNG
            </NavLink>
            <NavLink
              className="inline-flex items-center justify-center whitespace-nowrap text-xs text-white font-bold h-16 w-40 relative border-b-16 border-b-primary hover:border-b-transparent before:content-[''] before:absolute before:left-1/2 before:bottom-0 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:-translate-x-1/2"
              to="/create"
            >
              LÀM BÀI KHẢO SÁT
            </NavLink>
            <NavLink
              className="inline-flex items-center justify-center whitespace-nowrap text-xs text-white font-bold h-16 w-40 relative border-b-16 border-b-primary hover:border-b-transparent before:content-[''] before:absolute before:left-1/2 before:bottom-0 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:-translate-x-1/2"
              to="/result"
            >
              TRA CỨU KẾT QUẢ
            </NavLink>
          </div>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mt-4 space-y-2">
            <NavLink
              className="block text-lg text-white font-bold h-10 relative hover:text-gray-300 transition-all"
              to="/"
              onClick={toggleMenu}
            >
              TRANG CHỦ
            </NavLink>
            <NavLink
              className="block text-lg text-white font-bold h-10 relative hover:text-gray-300 transition-all"
              to="/info"
              onClick={toggleMenu}
            >
              HƯỚNG DẪN SỬ DỤNG
            </NavLink>
            <NavLink
              className="block text-lg text-white font-bold h-10 relative hover:text-gray-300 transition-all"
              to="/create"
              onClick={toggleMenu}
            >
              LÀM BÀI KHẢO SÁT
            </NavLink>
            <NavLink
              className="block text-lg text-white font-bold h-10 relative hover:text-gray-300 transition-all"
              to="/result"
              onClick={toggleMenu}
            >
              TRA CỨU KẾT QUẢ
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
}
