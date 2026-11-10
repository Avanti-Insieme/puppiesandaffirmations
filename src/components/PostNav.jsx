import { postPath } from '../posts.js';
import { TIME_ZONE } from '../todaysPost.js';

const briefDate = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, month: 'short', day: 'numeric' });
const label = (post) => briefDate.format(new Date(`${post.date}T12:00:00Z`));

// Links to the neighbouring posts, so readers can move through the archive.
// The static pages render the same markup, so the links are there before the app loads.
export default function PostNav({ prev, next }) {
  return (
    <nav className="pa-post-nav" aria-label="Other affirmations">
      {prev ? <a rel="prev" href={postPath(prev)}>← {label(prev)}</a> : <span />}
      <a href="/affirmations/">All affirmations</a>
      {next ? <a rel="next" href={postPath(next)}>{label(next)} →</a> : <span />}
    </nav>
  );
}
