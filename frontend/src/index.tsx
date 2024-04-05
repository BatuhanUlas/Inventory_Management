import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { App } from "./App";

//Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

//Toastify
import "react-toastify/dist/ReactToastify.css";

//Global Styling
import "./index.css";

//AOS
import AOS from "aos";
import "aos/dist/aos.css";
import { AuthProvider } from "./components/Auth";

AOS.init({
  once: true,
  duration: 1000,
  useClassNames: true,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
