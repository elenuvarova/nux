import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { useEffect } from 'react';
import NavBar from './components/NavBar.jsx';
import TabBar from './components/TabBar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Browse from './pages/Browse.jsx';
import MyList from './pages/MyList.jsx';
import FilmDetail from './pages/FilmDetail.jsx';
import Watch from './pages/Watch.jsx';
import NotFound from './pages/NotFound.jsx';

/* On forward navigation: scroll to top and move focus to the new page's
   heading (otherwise focus is lost to <body> when the clicked link unmounts).
   On back/forward (POP) the browser restores scroll — don't fight it. */
function RouteReset() {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if (navType !== 'POP') window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      document.querySelector('main h1')?.focus({ preventScroll: true });
    });
  }, [pathname, navType]);
  return null;
}

export default function App() {
  // the player owns the whole screen — app chrome hides on /watch
  const isPlayer = useLocation().pathname.startsWith('/watch/');
  return (
    <div className="grain">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <RouteReset />
      {!isPlayer && <NavBar />}
      <div id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/film/:id" element={<FilmDetail />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!isPlayer && <Footer />}
      {!isPlayer && <TabBar />}
    </div>
  );
}
