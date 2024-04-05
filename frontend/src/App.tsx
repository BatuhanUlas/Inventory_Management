import Routes from "./router/index";
import { AppNavbar } from "./components/App";
import { ToastContainer } from "react-toastify";
import { ScrollToTopButton } from "components/App/ScrollToTopButton";

export const App = () => {
  return (
    <div className="app">
      <div className="content-wrapper">
        <AppNavbar />
        <ToastContainer position="top-right" />
        <Routes />
        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default App;
