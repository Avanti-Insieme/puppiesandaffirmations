export default function AdSlot({ label, wide = false }) {
  return (
    <div className={`card elev-sm pa-ad${wide ? ' pa-ad--wide' : ''}`}>
      <span className="tag tag-neutral">Advertisement</span>
      <p className="pa-ad-size">{label}</p>
    </div>
  );
}
