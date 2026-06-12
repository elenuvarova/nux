import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import NavBar from './components/NavBar.jsx';
import TabBar from './components/TabBar.jsx';
import Footer from './components/Footer.jsx';
import ToastHost from './components/ToastHost.jsx';
import OfflineBanner from './components/OfflineBanner.jsx';
import Home from './pages/Home.jsx';
import Browse from './pages/Browse.jsx';
import FilmDetail from './pages/FilmDetail.jsx';

// core routes load eagerly; everything else is code-split so the player's
// YouTube engine, auth, settings etc. don't weigh down the first paint
const MyList = lazy(() => import('./pages/MyList.jsx'));
const TitleDetail = lazy(() => import('./pages/TitleDetail.jsx'));
const Watch = lazy(() => import('./pages/Watch.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));
const Downloads = lazy(() => import('./pages/Downloads.jsx'));
const Auth = lazy(() => import('./pages/Auth.jsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'));
const Welcome = lazy(() => import('./pages/Welcome.jsx'));
const Info = lazy(() => import('./pages/Info.jsx'));
const Collection = lazy(() => import('./pages/Collection.jsx'));
const Genre = lazy(() => import('./pages/Genre.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

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
  const isBareRoute = ['/welcome', '/signin', '/signup', '/forgot', '/reset'].includes(pathname);
  const bare = isPlayer || isBareRoute;
  return (
    <div className="grain">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <RouteReset />
      {!bare && <NavBar />}
      <div id="main">
        <Suspense fallback={<div className="route-fallback" aria-hidden="true" />}>
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
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/collection/:slug" element={<Collection />} />
            <Route path="/genre/:id" element={<Genre />} />
            <Route path="/p/:slug" element={<Info />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      {!bare && <Footer />}
      {!bare && <TabBar />}
      <OfflineBanner />
      <ToastHost />
    </div>
  );
}
