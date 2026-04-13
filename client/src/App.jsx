import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import MemoBoardPage from './MemoBoardPage'; // 방금 만든 상세 페이지
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/memo/:shareKey" element={<MemoBoardPage />} />
      </Routes>
    </div>
  );
}

export default App;