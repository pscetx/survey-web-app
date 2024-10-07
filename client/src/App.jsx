import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="w-full">
      <Navbar />
      <div className="m-20">
      <Outlet />
      </div>
      <Footer />
    </div>
  );
};
export default App;
