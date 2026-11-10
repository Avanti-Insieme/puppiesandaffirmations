// A reserved box for an advertisement. The box keeps its exact size whether or not an
// ad is showing, so the page never shifts when an ad loads. When no ad is connected,
// the box shows `fallback` (the newsletter card) instead of an empty placeholder.
// Sizes: "leaderboard" is 728 x 90, "rectangle" is 300 x 250.
export default function AdSlot({ size = 'leaderboard', ad = null, fallback = null, advertiseLink = true }) {
  return (
    <div className="pa-ad-wrap">
      <div className={`pa-slot pa-slot--${size}`}>
        {ad ?? fallback}
      </div>
      {advertiseLink && (
        <a className="pa-advertise-link" href="/advertise">Advertise here</a>
      )}
    </div>
  );
}
