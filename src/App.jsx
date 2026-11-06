import { useEffect, useRef, useState } from 'react';
import queue from './content/queue.json';
import { DEFAULT_AFFIRMATION } from './data.js';
import { currentPost } from './todaysPost.js';
import { applyTheme, readSavedTheme, saveTheme } from './theme.js';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import AdSlot from './components/AdSlot.jsx';
import Footer from './components/Footer.jsx';
import NewsletterDialog from './components/NewsletterDialog.jsx';

export default function App() {
  const wrapperRef = useRef(null);
  const [themeKey, setThemeKey] = useState(readSavedTheme);
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  // Today's post comes from the approved queue (src/content/queue.json).
  const todays = currentPost(queue);
  const affirmation = todays?.text ?? DEFAULT_AFFIRMATION;
  const heroSrc = todays?.photo?.src ?? '';
  const credit = todays?.photo ?? null;

  useEffect(() => {
    applyTheme(themeKey, wrapperRef.current);
  }, [themeKey]);

  function selectTheme(key) {
    saveTheme(key);
    setThemeKey(key);
  }

  return (
    <div className="pa-page" ref={wrapperRef}>
      <Nav
        themeKey={themeKey}
        onSelectTheme={selectTheme}
        onOpenNewsletter={() => setNewsletterOpen(true)}
      />

      <main className="pa-wrap pa-main">
        <Hero affirmation={affirmation} heroSrc={heroSrc} credit={credit} onHeroChange={() => {}} />

        <section className="pa-ad-row">
          <AdSlot label="728 × 90 ad slot" wide />
        </section>

        <section className="pa-intro">
          <div>
            <h4>Acknowledgement</h4>
            <span className="pa-kicker-sm">Why this exists</span>
            <p className="pa-intro-text">
              <img src='/public/pupsandaffsv2.png' style={{display: 'inline'}} width={100}/>
              Some time ago, I gifted a dear friend with a small gift - a simple calendar with handwritten 
              notes for the month. It was something, that in the moment, was meant to brighten the day. Yet,
              months later, I heard how it brightened yet another day.
              So, this year round, I wanted to take it further. I took my tech skills and built a website
              that would provide daily affirmations and photos.
              Some days that's all the comfort a browser tab needs to offer.
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
    </div>
  );
}
