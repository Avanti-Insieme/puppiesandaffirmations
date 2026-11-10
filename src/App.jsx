import { useEffect, useRef, useState } from 'react';
import queue from './content/queue.json';
import archive from './content/archive.json';
import { mergePosts, findPost, recentPosts, livePosts } from './posts.js';
import { DEFAULT_AFFIRMATION } from './data.js';
import { currentPost, publishDate } from './todaysPost.js';
import { applyTheme, readSavedTheme, saveTheme } from './theme.js';
import { postTitle } from './seo.js';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import AdSlot from './components/AdSlot.jsx';
import NewsletterCard from './components/NewsletterCard.jsx';
import RecentPosts from './components/RecentPosts.jsx';
import Footer from './components/Footer.jsx';
import NewsletterDialog from './components/NewsletterDialog.jsx';

export default function App() {
  const wrapperRef = useRef(null);
  const [themeKey, setThemeKey] = useState(readSavedTheme);
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  // Every post, from the queue and the permanent archive. Only posts whose day has
  // arrived are shown, so queued posts for later days stay hidden.
  const today = publishDate();
  const allPosts = livePosts(mergePosts(queue, archive), today);

  // /affirmations/YYYY-MM-DD/<slug> shows that post. The homepage shows today's.
  // The slug is for readers and search engines, so any slug after the date works here.
  const routeMatch = window.location.pathname.match(/^\/affirmations\/(\d{4}-\d{2}-\d{2})(?:\/[^/]+)?\/?$/);
  const shown = routeMatch ? findPost(allPosts, routeMatch[1]) : currentPost(queue);
  const notAvailable = Boolean(routeMatch) && !shown;
  const affirmation = shown?.text ?? DEFAULT_AFFIRMATION;
  const heroSrc = shown?.photo?.src ?? '';
  const credit = shown?.photo ?? null;
  const reflection = shown?.reflection ?? '';

  // The seven most recent posts that are already live.
  const recent = recentPosts(allPosts, today, 7);

  useEffect(() => {
    applyTheme(themeKey, wrapperRef.current);
  }, [themeKey]);

  // Posts rendered in the browser (not yet built) still need their own title, and
  // unavailable dates must not be indexed.
  useEffect(() => {
    if (shown && routeMatch) document.title = postTitle(shown);
    let robots = document.querySelector('meta[name="robots"]');
    if (notAvailable) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.name = 'robots';
        robots.dataset.app = 'true';
        document.head.appendChild(robots);
      }
      robots.content = 'noindex';
    } else if (robots?.dataset.app) {
      robots.remove();
    }
  }, [shown, routeMatch, notAvailable]);

  function selectTheme(key) {
    saveTheme(key);
    setThemeKey(key);
  }

  const openNewsletter = () => setNewsletterOpen(true);

  return (
    <div className="pa-page" ref={wrapperRef}>
      <Nav
        themeKey={themeKey}
        onSelectTheme={selectTheme}
        onOpenNewsletter={openNewsletter}
      />

      <main className="pa-wrap pa-main">
        {notAvailable ? (
          <section className="pa-hero-text">
            <span className="pa-kicker">Not available yet</span>
            <h1 className="pa-headline">This affirmation isn't available yet.</h1>
            <p className="pa-intro-text"><a href="/">Go to today's affirmation</a></p>
          </section>
        ) : (
          <>
            <Hero affirmation={affirmation} heroSrc={heroSrc} credit={credit} reflection={reflection} onHeroChange={null} />

            <section className="pa-ad-row">
              <AdSlot
                size="leaderboard"
                fallback={<NewsletterCard variant="strip" onOpen={openNewsletter} />}
              />
            </section>

            <section className="pa-intro">
              <div>
                <h4>Acknowledgement</h4>
                <span className="pa-kicker-sm">Why this exists</span>
                <p className="pa-intro-text">
                  <img src='/pupsandaffsv2.png' style={{display: 'inline'}} width={100}/>
                  Some time ago, I gifted a dear friend with a small gift - a simple calendar with handwritten
                  notes for the month. It was something, that in the moment, was meant to brighten the day. Yet,
                  months later, I heard how it brightened yet another day.
                  So, this year round, I wanted to take it further. I took my tech skills and built a website
                  that would provide daily affirmations and photos.
                  Some days that's all the comfort a browser tab needs to offer.
                </p>
                <p className="pa-about-link"><a href="/about">Read more about this site</a> · <a href="/affirmations/">Browse the archive</a></p>
              </div>
              <AdSlot
                size="rectangle"
                fallback={<NewsletterCard variant="box" onOpen={openNewsletter} />}
              />
            </section>
          </>
        )}
      </main>

      <RecentPosts posts={recent} />

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
