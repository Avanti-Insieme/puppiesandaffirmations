import { useEffect, useRef, useState } from 'react';
import { DEFAULT_AFFIRMATION } from './data.js';
import { applyTheme, readSavedTheme, saveTheme } from './theme.js';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import AdSlot from './components/AdSlot.jsx';
import Footer from './components/Footer.jsx';
import NewsletterDialog from './components/NewsletterDialog.jsx';
import AdminDialog from './components/AdminDialog.jsx';
import AdminPanel from './components/AdminPanel.jsx';

export default function App() {
  const wrapperRef = useRef(null);
  const [themeKey, setThemeKey] = useState(readSavedTheme);
  const [affirmation, setAffirmation] = useState(DEFAULT_AFFIRMATION);
  const [heroSrc, setHeroSrc] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  useEffect(() => {
    applyTheme(themeKey, wrapperRef.current);
  }, [themeKey]);

  function selectTheme(key) {
    saveTheme(key);
    setThemeKey(key);
  }

  function handleLogin() {
    setAdminDialogOpen(false);
    setAdminPanelOpen(true);
  }

  function handleLogout() {
    setAdminPanelOpen(false);
    setAdminDialogOpen(false);
  }

  return (
    <div className="pa-page" ref={wrapperRef}>
      <Nav
        affirmation={affirmation}
        themeKey={themeKey}
        onSelectTheme={selectTheme}
        onOpenNewsletter={() => setNewsletterOpen(true)}
        onOpenAdmin={() => setAdminDialogOpen(true)}
      />

      <main className="pa-wrap pa-main">
        <Hero affirmation={affirmation} heroSrc={heroSrc} onHeroChange={setHeroSrc} />

        <section className="pa-ad-row">
          <AdSlot label="728 × 90 ad slot" wide />
        </section>

        <section className="pa-intro">
          <div>
            <span className="pa-kicker-sm">Why this exists</span>
            <p className="pa-intro-text">
              One photo, one honest sentence, updated by hand — not a feed, not a scroll. Some days
              that's all the comfort a browser tab needs to offer.
            </p>
          </div>
          <AdSlot label="300 × 250 ad slot" />
        </section>
      </main>

      <Footer subscribed={subscribed} onSubscribe={() => setSubscribed(true)} />

      {newsletterOpen && (
        <NewsletterDialog
          subscribed={subscribed}
          onSubscribe={() => setSubscribed(true)}
          onClose={() => setNewsletterOpen(false)}
        />
      )}

      {adminDialogOpen && (
        <AdminDialog onClose={() => setAdminDialogOpen(false)} onLogin={handleLogin} />
      )}

      {adminPanelOpen && (
        <AdminPanel
          affirmation={affirmation}
          onSaveAffirmation={setAffirmation}
          onApplyImage={setHeroSrc}
          onClose={() => setAdminPanelOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
