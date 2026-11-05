import ImageSlot from './ImageSlot.jsx';

export default function Hero({ affirmation, heroSrc, onHeroChange }) {
  return (
    <>
      <section className="pa-hero-text">
        <span className="pa-kicker">A little good news, every day</span>
        <h1 className="pa-headline">{affirmation}</h1>
      </section>

      <section className="halftone pa-hero-frame">
        <ImageSlot src={heroSrc} onChange={onHeroChange} />
      </section>
    </>
  );
}
