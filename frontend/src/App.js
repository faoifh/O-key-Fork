import Mainpage from "./Mainpage/Mainpage";
import Interest_news from "./Interest_news/Interest_news";
import {Routes, Route} from "react-router-dom";
import ReduxReset from "./ReduxReset";

function App() {
    return (
        <Routes>
            {/* 메인 페이지 */}
            <Route path="/" element={<Mainpage/>}/>
            {/* 관심 뉴스 페이지 */}
            <Route path="/Interest_news" element={<Interest_news/>}/>

            <Route path="/redux_reset" element={<ReduxReset/>}/>
        </Routes>
    );
}

export default App;

