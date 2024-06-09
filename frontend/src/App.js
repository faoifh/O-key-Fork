import Mainpage from "./Mainpage/Mainpage";
import Interest_news from "./Interest_news/Interest_news";
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<Mainpage />} />
        {/* 관심 뉴스 페이지 */}
        <Route path="/Interest_news" element={<Interest_news />} />
      </Routes>
  </BrowserRouter> 
  );
}

export default App;

