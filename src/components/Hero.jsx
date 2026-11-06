import ImageSlot from "./ImageSlot";

export default function Hero({ affirmation, heroSrc, credit }) {
  return (
    <>
      <section className="pa-hero-text">
        <span className="pa-kicker">A little good news, every day</span>
        <h1 className="pa-headline">{affirmation}</h1>
      </section>

      <section className="halftone pa-hero-frame">
        <ImageSlot src={heroSrc} onChange={null} />
      </section>

      {credit && <PhotoCredit photo={credit} />}
    </>
  );
}

// Unsplash asks for a credit that links to the photographer and the photo.
function PhotoCredit({ photo }) {
  return (
    <p className="pa-credit">
      Photo by{' '}
      <a href={photo.photographerUrl} target="_blank" rel="noopener noreferrer">
        {photo.photographer}
      </a>{' '}
      on{' '}
      <a href="https://unsplash.com/?utm_source=puppies_affirmations&utm_medium=referral" target="_blank" rel="noopener noreferrer">
        Unsplash
      </a>
    </p>
  );
}
