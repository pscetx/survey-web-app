import { useState, useEffect } from "react";
import bcrypt from "bcryptjs";
import AdminDashboard from "./AdminDashboard";

const Admin = () => {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = sessionStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const adminPasswordHash = "$2b$10$867sJG.7enp7cXos6P1BbuZKBPgs2qO/Cq7X7Zdjf2yxGDwZzvbiG";

      const isMatch = await bcrypt.compare(password, adminPasswordHash);
      if (isMatch) {
        sessionStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
      } else {
        alert("Incorrect password!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return (
      <div>
        <h1 className="text-xl font-bold text-secondary">Chào mừng đến với trang quản trị viên!</h1>
        <button onClick={handleLogout} className="mb-6 underline italic font-semibold text-primary">Đăng xuất</button>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10">
      <div className="border border-tertiary border-2 rounded-md p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold mb-6 text-center text-secondary">Đăng nhập quản trị viên</h1>
        <form>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 transition duration-300 ease-in-out"
          />

          <button
            onClick={handleLogin}
            className="w-full items-center px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary transition duration-300 ease-in-out mt-6"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
