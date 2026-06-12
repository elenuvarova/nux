import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { useEffect } from 'react';
import NavBar from './components/NavBar.jsx';
import TabBar from './components/TabBar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Browse from './pages/Browse.jsx';
import MyList from './pages/MyList.jsx';
import FilmDetail from './pages/FilmDetail.jsx';
import TitleDetail from './pages/TitleDetail.jsx';
import Watch from './pages/Watch.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import Downloads from './pages/Downloads.jsx';
import Auth from './pages/Auth.jsx';
import Welcome from './pages/Welcome.jsx';
import Info from './pages/Info.jsx';
import Collection from './pages/Collection.jsx';
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
  const { pathname } = useLocation();
  const isPlayer = pathname.startsWith('/watch/');
  const isBareRoute = pathname === '/welcome' || pathname === '/signin' || pathname === '/signup';
  const bare = isPlayer || isBareRoute;
  return (
    <div className="grain">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <RouteReset />
      {!bare && <NavBar />}
      <div id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/film/:id" element={<FilmDetail />} />
          <Route path="/title/:id" element={<TitleDetail />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/signin" element={<Auth mode="signin" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/collection/:slug" element={<Collection />} />
          <Route path="/p/:slug" element={<Info />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!bare && <Footer />}
      {!bare && <TabBar />}
    </div>
  );
}
