import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow lg:mx-44 lg:my-12 m-8">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
export default App;
