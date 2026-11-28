import { useEffect, useRef, useState, type ReactNode } from 'react';
import { BedDouble, ChevronDown, ChevronLeft, ChevronRight, Coffee, Gamepad2, House, MapPin, Menu, Trees, Waves, X } from 'lucide-react';
import { Soundtrack } from './Soundtrack';
import { ActivityScene, AdventureLandscape, LakeDoodle, MotionToggle, WhimsyFrame } from './Whimsy';
import { activities, bedrooms, comforts, faqs, links, navigation, photos, property, recommendations, type Photo } from './content';

const icons = { coffee: Coffee, trees: Trees, games: Gamepad2, home: House };

function MountainMark({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 76 48" fill="none" aria-hidden="true"><path d="m4 39 25-33 16 22 10-13 17 24H4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="m20 18 9 5 6-9M8 46h60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}

function BookingLink({ className = '', children = 'Check availability on Airbnb' }: { className?: string; children?: ReactNode }) {
  return <a className={`button ${className}`} href={property.bookingUrl} target="_blank" rel="noopener noreferrer">{children}<span className="sr-only"> (opens in a new tab)</span></a>;
}

function ExternalLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return <a href={href} className={`text-link ${className}`} target="_blank" rel="noopener noreferrer">{children}<span className="sr-only"> (opens in a new tab)</span></a>;
}

function PropertyImage({ id, className = '', priority = false, sizes = '(max-width: 700px) 100vw, 50vw', decorative = false, parallax }: { id: string; className?: string; priority?: boolean; sizes?: string; decorative?: boolean; parallax?: number }) {
  const photo = photos.find(item => item.id === id);
  if (!photo) return <div className={`photo-pending ${className}`}><MountainMark /><span>Original photography coming soon</span></div>;
  const image = <img data-parallax={parallax} className={photo.avifSrcSet ? undefined : className} src={photo.src} srcSet={photo.srcSet} sizes={sizes} width={photo.width} height={photo.height} alt={decorative ? '' : photo.alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" style={{ objectPosition: photo.position }} />;
  return photo.avifSrcSet ? <picture className={className}><source type="image/avif" srcSet={photo.avifSrcSet} sizes={sizes} />{image}</picture> : image;
}

function Gallery({ initialIndex, onClose }: { initialIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const photo: Photo = photos[index];
  const move = (direction: number) => setIndex(current => (current + direction + photos.length) % photos.length);

  useEffect(() => {
    const dialog = dialogRef.current!;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  return <dialog ref={dialogRef} className="gallery-dialog" aria-labelledby="gallery-title" onCancel={onClose} onKeyDown={event => {
    if (event.key === 'Tab') {
      const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button')];
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  }}>
    <div className="gallery-top"><h2 id="gallery-title">A look around Basecamp</h2><button ref={closeRef} className="icon-button" onClick={onClose} aria-label="Close photo gallery"><X /></button></div>
    <div className="gallery-view"><button className="icon-button gallery-prev" onClick={() => move(-1)} aria-label="Previous photo"><ChevronLeft /></button><img key={photo.id} src={photo.src} srcSet={photo.srcSet} sizes="(max-width: 700px) 100vw, 85vw" width={photo.width} height={photo.height} alt={photo.alt} /><button className="icon-button gallery-next" onClick={() => move(1)} aria-label="Next photo"><ChevronRight /></button></div>
    <div className="gallery-caption" aria-live="polite" aria-atomic="true"><p>{photo.caption}</p><span>{index + 1} / {photos.length}</span></div>
    <div className="gallery-thumbs" aria-label="Choose a photo">{photos.map((item, i) => <button key={item.id} aria-label={`View photo ${i + 1}: ${item.caption}`} aria-pressed={index === i} onClick={() => setIndex(i)}><img src={item.srcSet.split(',')[0].trim().split(' ')[0]} alt="" width="100" height="70" loading="lazy" /></button>)}</div>
  </dialog>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); } };
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !navRef.current?.contains(event.target) && !menuButton.current?.contains(event.target)) setMenuOpen(false); };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', outside); };
  }, [menuOpen]);

  const openPhoto = (id: string) => { const index = photos.findIndex(photo => photo.id === id); if (index >= 0) setGalleryIndex(index); };

  return <WhimsyFrame>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Basecamp at Bryce, home"><MountainMark /><span><span className="brand-name">BASECAMP</span>{' '}<span className="brand-subtitle">AT BRYCE</span></span></a>
      <MotionToggle />
      <button ref={menuButton} className="menu-toggle icon-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <nav ref={navRef} id="main-navigation" className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">{navigation.map(item => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}<BookingLink className="header-booking">Plan your stay</BookingLink></nav>
    </header>

    <main id="main">
      <section id="top" className="hero" aria-labelledby="hero-title">
        <div className="hero-content"><p className="eyebrow"><MapPin size={14} /> BASYE, VIRGINIA · SHENANDOAH VALLEY</p><p className="hero-property-name">The Basecamp at Bryce</p><h1 id="hero-title">Slow mornings.<br /><em>Mountain adventures.</em></h1><p className="hero-description">A mountain home for getting outside,<br className="desktop-break" /> coming together, and doing a little less.</p><BookingLink className="button-light" /><p className="hero-booking-note">Your next getaway starts here.</p><Soundtrack /></div>
        <div className="hero-postcard"><div className="postcard-photo"><PropertyImage id="exterior" className="hero-image" priority parallax={14} sizes="(max-width: 700px) 90vw, 42vw" /></div><span className="postcard-caption">The Basecamp at Bryce · Basye, Virginia</span><span className="postcard-stamp" aria-hidden="true"><MountainMark /></span></div>
        <AdventureLandscape />
        <a className="hero-scroll" href="#the-home">SETTLE IN <ChevronDown size={18} /></a><span className="hero-side-note">A LITTLE CLOSER TO WHAT MATTERS</span>
      </section>

      <div className="facts-bar"><p>Room for your people.<br /><span>Space to make it your own.</span></p><dl>{property.facts.map(fact => <div key={fact.label}><dt>{fact.value}</dt><dd>{fact.label}</dd></div>)}</dl></div>

      <section id="the-home" className="section home-section" aria-labelledby="home-title">
        <div className="home-intro"><div><p className="eyebrow">YOUR HOME IN THE MOUNTAINS</p><h2 id="home-title">Unpack. Exhale.<br /><em>You’re at Basecamp.</em></h2></div><div className="home-intro-copy"><p>Some places make it easy to slow down. Tucked into the Bryce Resort community near Lake Laura, our four-bedroom home is one of them.</p><p>Start with coffee on the deck. Head out for a day in the mountains. Come back to dinner together and one more game before bed. There’s room here for all of it.</p></div></div>
        <div className="home-photos"><button className="photo-button home-photo-large" onClick={() => openPhoto('living')} aria-label="The best days end right here. Open living room photo in gallery"><PropertyImage id="living" parallax={16} /><span className="photo-caption">The best days end right here.</span></button><div className="home-photo-secondary"><button className="photo-button" onClick={() => openPhoto('deck')} aria-label="Open deck photo in gallery"><PropertyImage id="deck" parallax={10} sizes="(max-width: 700px) 100vw, 35vw" /></button><div className="photo-aside"><span className="little-line" /><p>Fresh air.<br />A full cup.<br /><em>No rush.</em></p></div></div></div>
        <div className="comfort-grid">{comforts.map(item => { const Icon = icons[item.icon]; return <div className="comfort" key={item.title}><Icon aria-hidden="true" strokeWidth={1.3} /><h3>{item.title}</h3><p>{item.text}</p></div>; })}</div>
        <div className="home-extras"><span><Trees size={17} /> Mountain views</span><span>Wi-Fi & workspace</span><span>{property.parking}</span><span>Washer & dryer</span><span>Air conditioning</span></div>
      </section>

      <section className="gallery-section section" aria-labelledby="photos-title"><div className="section-heading"><div><p className="eyebrow">COME ON IN</p><h2 id="photos-title">Picture yourself <em>here.</em></h2></div>{photos.length > 0 && <button className="button button-outline" onClick={() => setGalleryIndex(0)}>View all {photos.length} photos</button>}</div><div className="photo-mosaic">{['kitchen', 'coffee', 'game-room', 'kids'].map((id, index) => <button className={`photo-button mosaic-${index}`} key={id} onClick={() => openPhoto(id)} aria-label={`Open ${photos.find(photo => photo.id === id)?.caption ?? id} photo in gallery`}><PropertyImage id={id} sizes="(max-width: 700px) 50vw, 30vw" /><span className="photo-caption">{photos.find(photo => photo.id === id)?.caption}</span></button>)}</div></section>

      <section className="bedrooms-section section" aria-labelledby="bedrooms-title"><div className="section-heading"><div><p className="eyebrow">A GOOD NIGHT, A SLOW MORNING</p><h2 id="bedrooms-title">Find your <em>resting place.</em></h2></div><p>Four bedrooms. Their own personalities.<br />A little space for everyone.</p></div><div className="bedroom-grid">{bedrooms.map(room => <article className="bedroom" key={room.id}><button className="photo-button" onClick={() => openPhoto(room.id)} aria-label={`View ${room.name} photo`}><PropertyImage id={room.id} sizes="(max-width: 700px) 85vw, 25vw" /></button><h3>{room.name}</h3><p><BedDouble size={16} aria-hidden="true" />{room.bed}</p></article>)}</div></section>

      <section id="lake-laura" className="lake-section" aria-labelledby="lake-title"><div className="lake-photo"><LakeDoodle /><PropertyImage id="lake" parallax={18} sizes="(max-width: 850px) 1100px, 100vw" /><span className="lake-photo-label"><Waves size={17} aria-hidden="true" /> LAKE LAURA, CLOSE TO HOME</span></div><div className="lake-content"><p className="eyebrow">LESS SCREEN TIME. MORE SHORE TIME.</p><h2 id="lake-title">Take the<br /><em>long way around.</em></h2><p>Lake Laura is one of our favorite reasons to be here. A quiet walk through the trees. An afternoon on the water. The kind of day that doesn’t need much of a plan.</p><div className="lake-loop"><span className="lake-loop-number">2.5<span>miles</span></span><div><h3>A loop worth slowing down for.</h3><p>Follow the approximately 2.5-mile trail around the lake for wooded stretches, water views, and a little breathing room.</p></div></div><p className="lake-small">The trail is easy to moderate with natural, uneven terrain. Swimming, beach access, and paddle rentals are seasonal resort offerings, with separate fees and access rules.</p><ExternalLink href={links.lakeLaura}>Explore Lake Laura</ExternalLink></div></section>

      <section id="adventure" className="section adventure-section" aria-labelledby="adventure-title"><div className="centered-heading"><p className="eyebrow">ONE BASECAMP. EVERY SEASON.</p><h2 id="adventure-title">Get out there.<br /><em>Then get comfortable.</em></h2><p>Make it a powder-day getaway, a trail-filled weekend,<br className="desktop-break" /> or a whole lot of nothing. There’s a season for all of it.</p></div><div className="activity-grid">{activities.map(item => <article className={`activity activity-${item.id}`} key={item.id}><ActivityScene kind={item.id} season={item.season} /><div className="activity-copy"><h3>{item.title}</h3><p>{item.text}</p><ExternalLink href={item.url}>{item.linkLabel}</ExternalLink></div></article>)}</div><p className="activity-note">Plan ahead with Bryce Resort for current conditions, tickets, lessons, rentals, and tee times.</p><div className="slow-day"><Coffee size={30} strokeWidth={1} aria-hidden="true" /><div><h3>And some days? Stay right here.</h3><p>Coffee on the deck. A good book. A game with your favorite people. Doing less is a perfectly good plan.</p></div><span className="slow-day-tag">THE ART OF TAKING IT EASY</span></div></section>

      <section id="explore" className="section explore-section" aria-labelledby="explore-title"><div className="explore-intro"><p className="eyebrow">A LITTLE FARTHER AFIELD</p><h2 id="explore-title">Make a day<br /><em>of the Valley.</em></h2><p>Good food, small-town discoveries, and a few worthwhile detours. Here are some ideas for your time in the Shenandoah Valley.</p><div className="host-tip"><span>THE HOST’S PICK</span><p>“Our family especially loves grabbing a pizza at Pale Fire Brewing — and a beer for the adults!”</p><span className="host-signature">— Sara & Everett</span></div></div><div className="recommendations">{recommendations.map(item => <article key={item.name}><p className="eyebrow">{item.category}</p><div className="recommendation-title"><h3>{item.name}</h3><span>{item.location}</span></div><p>{item.text}</p><ExternalLink href={item.url}>{item.label}</ExternalLink></article>)}</div></section>

      <section className="section host-section" aria-labelledby="host-title"><MountainMark /><div><p className="eyebrow">FROM OUR FAMILY TO YOURS</p><h2 id="host-title">A place we love.<br /><em>A place to make memories.</em></h2><p>We’re Sara and Everett, a family from Northern Virginia with two little boys and a love for skiing, biking, and being outside. We created Basecamp with the kind of getaway we love in mind: plenty to explore, space to be together, and time to just be.</p><p className="host-signoff">We hope you feel right at home.</p></div></section>

      <section className="section faq-section" aria-labelledby="faq-title"><div><p className="eyebrow">BEFORE YOU PACK</p><h2 id="faq-title">A few good<br /><em>things to know.</em></h2></div><div className="faq-list">{faqs.map(item => <details key={item.question}><summary>{item.question}<ChevronDown size={18} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div></section>

      <section className="booking-section" aria-labelledby="booking-title"><p className="eyebrow">FRESH AIR IS CALLING</p><h2 id="booking-title">See you at <em>Basecamp.</em></h2><p>Bring your people. Leave a little room for adventure.</p><BookingLink className="button-light" /><p className="booking-note">View dates, pricing, and all the details on Airbnb.</p></section>
    </main>

    <footer className="site-footer"><a href="#top" className="brand"><MountainMark /><span><span className="brand-name">BASECAMP</span>{' '}<span className="brand-subtitle">AT BRYCE</span></span></a><p>Basye, Virginia<br /><span>Good days start here.</span></p><div><p>© {new Date().getFullYear()} The Basecamp at Bryce</p><p className="footer-disclaimer">An independently hosted vacation home.<br />Resort activities are operated separately by Bryce Resort.</p></div></footer>
    <div className="mobile-booking"><div><strong>The Basecamp at Bryce</strong><span>8 guests · 4 bedrooms</span></div><div id="mobile-sound-slot" /><BookingLink>Check availability</BookingLink></div>
    {galleryIndex !== null && photos.length > 0 && <Gallery initialIndex={galleryIndex} onClose={() => setGalleryIndex(null)} />}
  </WhimsyFrame>;
}
