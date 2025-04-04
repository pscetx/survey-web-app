import { useState, useEffect } from "react";
import bcrypt from "bcryptjs";

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
        <h1>Admin Dashboard</h1>
        <p>Welcome to the admin dashboard!</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Login</h1>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Admin;
