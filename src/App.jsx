import { useEffect, useRef, useState } from 'react';
import queue from './content/queue.json';
import archive from './content/archive.json';
import { mergePosts, findPost, recentPosts, livePosts } from './posts.js';
import { DEFAULT_AFFIRMATION } from './data.js';
import { currentPost, publishDate } from './todaysPost.js';
import { applyTheme, readSavedTheme, saveTheme } from './theme.js';
import { postTitle, SITE_NAME, HOME_TITLE } from './seo.js';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import AdSlot from './components/AdSlot.jsx';
import NewsletterCard from './components/NewsletterCard.jsx';
import RecentPosts from './components/RecentPosts.jsx';
import PostNav from './components/PostNav.jsx';
import Footer from './components/Footer.jsx';
import NewsletterDialog from './components/NewsletterDialog.jsx';
import { AboutPage, AdvertisePage, ArchivePage } from './components/SitePages.jsx';

// The site's own pages, by path. Each is also built as static HTML for search engines.
function sitePageFor(pathname) {
  if (pathname === '/about') return 'about';
  if (pathname === '/advertise') return 'advertise';
  if (pathname === '/affirmations' || pathname === '/affirmations/') return 'archive';
  return null;
}

const PAGE_TITLES = {
  about: `About | ${SITE_NAME}`,
  advertise: `Advertise | ${SITE_NAME}`,
  archive: `Archive | ${SITE_NAME}`,
};

export default function App() {
  const wrapperRef = useRef(null);
  const [themeKey, setThemeKey] = useState(readSavedTheme);
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  // Every post, from the queue and the permanent archive. Only posts whose day has
  // arrived are shown, so queued posts for later days stay hidden.
  const today = publishDate();
  const allPosts = livePosts(mergePosts(queue, archive), today);

  const pathname = window.location.pathname;
  const sitePage = sitePageFor(pathname);

  // /affirmations/YYYY-MM-DD/<slug> shows that post. The homepage shows today's.
  // The slug is for readers and search engines, so any slug after the date works here.
  const routeMatch = pathname.match(/^\/affirmations\/(\d{4}-\d{2}-\d{2})(?:\/[^/]+)?\/?$/);
  const shown = routeMatch ? findPost(allPosts, routeMatch[1]) : currentPost(queue);
  const notAvailable = Boolean(routeMatch) && !shown;
  const affirmation = shown?.text ?? DEFAULT_AFFIRMATION;
  const heroSrc = shown?.photo?.src ?? '';
  const credit = shown?.photo ?? null;
  const reflection = shown?.reflection ?? '';

  // The seven most recent posts that are already live.
  const recent = recentPosts(allPosts, today, 7);

  // Neighbouring posts, for the previous and next links on a post page.
  const index = shown ? allPosts.findIndex((p) => p.date === shown.date) : -1;
  const prevPost = routeMatch && index > 0 ? allPosts[index - 1] : null;
  const nextPost = routeMatch && index >= 0 && index < allPosts.length - 1 ? allPosts[index + 1] : null;

  useEffect(() => {
    applyTheme(themeKey, wrapperRef.current);
  }, [themeKey]);

  // Pages drawn in the browser still need their own title. Unavailable dates must not be indexed.
  useEffect(() => {
    if (sitePage) document.title = PAGE_TITLES[sitePage];
    else if (routeMatch && shown) document.title = postTitle(shown);
    else document.title = HOME_TITLE;

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
  }, [sitePage, routeMatch, shown, notAvailable]);

  function selectTheme(key) {
    saveTheme(key);
    setThemeKey(key);
  }

  const openNewsletter = () => setNewsletterOpen(true);

  let content;
  if (sitePage === 'about') {
    content = <AboutPage />;
  } else if (sitePage === 'advertise') {
    content = <AdvertisePage />;
  } else if (sitePage === 'archive') {
    content = <ArchivePage posts={allPosts} />;
  } else if (notAvailable) {
    content = (
      <section className="pa-hero-text">
        <span className="pa-kicker">Not available yet</span>
        <h1 className="pa-headline">This affirmation isn't available yet.</h1>
        <p className="pa-intro-text"><a href="/">Go to today's affirmation</a></p>
      </section>
    );
  } else {
    content = (
      <>
        <Hero affirmation={affirmation} heroSrc={heroSrc} credit={credit} reflection={reflection} onHeroChange={null} />

        {routeMatch && shown && <PostNav prev={prevPost} next={nextPost} />}

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
    );
  }

  return (
    <div className="pa-page" ref={wrapperRef}>
      <Nav
        themeKey={themeKey}
        onSelectTheme={selectTheme}
        onOpenNewsletter={openNewsletter}
      />

      <main className="pa-wrap pa-main">{content}</main>

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
