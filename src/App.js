import "./index.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import Search from "./components/Search";

function App() {
  return (
    <div className="App bg-slate-700">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} exact></Route>
          <Route path="/book/:id" element={<BookDetail />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
