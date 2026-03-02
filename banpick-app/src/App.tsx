import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BanPickOverlay from './components/BanPickOverlay';
import OverlayPage from './page/OverlayPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BanPickOverlay />} />
        <Route path="/overlay" element={<OverlayPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
