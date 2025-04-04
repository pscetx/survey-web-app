import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <div className="lg:mt-14 mt-8">
      <nav className="flex flex-col lg:flex-row justify-between items-center px-4 lg:px-20 py-5 bg-secondary">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-5">
          <NavLink to="/admin" className="flex items-center justify-center">
            <img
              alt="ITI logo"
              className="h-16 lg:h-24 inline"
              src="/logo-original.png"
            />
          </NavLink>

          <div className="text-center lg:text-left text-white">
            <h1 className="text-md font-bold">VNU Information Technology Institute</h1>
            <p className="text-sm">
              Address: E3, 144 Xuan Thuy, Cau Giay, Hanoi <br />
              Telephone: (024) 3754 7347 <br />
              Email: iti@vnu.edu.vn
            </p>
          </div>
        </div>

        <a
          className="mt-4 lg:mt-0 inline-flex items-center justify-center text-xs text-white font-bold h-12 w-36 lg:h-16 lg:w-56 relative border-b-2 border-b-primary hover:border-b-transparent before:content-[''] before:absolute before:left-1/2 before:bottom-0 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:-translate-x-1/2"
          href="https://www.facebook.com/profile.php?id=100064061143635&ref=embed_page"
          target="_blank"
          rel="noopener noreferrer"
        >
          FANPAGE
        </a>
      </nav>

      <div className="flex flex-col lg:flex-row justify-center items-center text-xs py-2 bg-primary text-white text-center">
        <p>Copyright 2024 © iti.vnu.edu.vn</p>
      </div>
    </div>
  );
}
