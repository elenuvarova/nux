import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import NavBar from './components/NavBar.jsx';
import TabBar from './components/TabBar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Browse from './pages/Browse.jsx';
import MyList from './pages/MyList.jsx';
import FilmDetail from './pages/FilmDetail.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="grain">
      <ScrollToTop />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/my-list" element={<MyList />} />
        <Route path="/film/:id" element={<FilmDetail />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
      <TabBar />
    </div>
  );
}
