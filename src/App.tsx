]import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin, Car, Plane, Church, Building2,
  Phone, MessageCircle, Mail, MapPinned, Check,
  ArrowRight, Star, Menu, X, ChevronRight, Users
} from 'lucide-react';

/* ─── Scroll Progress Hook ─── */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return progress;
}

/* ─── Scroll Reveal Hook ─── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            // Re-observe for scroll up/down animations
            // Don't unobserve so it can animate again when scrolling back
          } else {
            e.target.classList.remove('visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Custom Cursor ─── */
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = (e.clientX - 6) + 'px';
        cursorRef.current.style.top = (e.clientY - 6) + 'px';
      }
    };
    const animate = () => {
      pos.current.rx += (pos.current.x - pos.current.rx) * 0.12;
      pos.current.ry += (pos.current.y - pos.current.ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = (pos.current.rx - 20) + 'px';
        ringRef.current.style.top = (pos.current.ry - 20) + 'px';
      }
      requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove', onMove);
    const raf = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="fixed w-3 h-3 bg-red rounded-full pointer-events-none z-[9999] transition-transform duration-150 mix-blend-difference hidden md:block" />
      <div ref={ringRef} className="fixed w-10 h-10 border border-red-light rounded-full pointer-events-none z-[9998] transition-all duration-100 opacity-50 hidden md:block" />
    </>
  );
}

/* ─── Navigation ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Destinations', href: '#destinations' },
    { label: 'Services', href: '#services' },
    { label: 'Packages', href: '#packages' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/90 backdrop-blur-2xl border-b border-white/[0.08] py-2' : 'py-3 md:py-5'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 md:gap-3">
          <img src="/images/logo.jpg" alt="Maa Travels" className="h-8 md:h-10 w-auto rounded" />
          <span className="font-playfair text-base md:text-xl text-white tracking-wide">
            Maa <span className="text-red">Travels</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-7 xl:gap-9">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="relative text-[11px] tracking-[2px] uppercase text-white/60 hover:text-red-light transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-red transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <a href="#booking" className="btn-3d-wrapper">
            <span className="btn-3d inline-block bg-red text-white px-5 md:px-6 py-2.5 md:py-3 text-[11px] tracking-[2px] uppercase font-inter font-medium rounded-sm cursor-pointer">
              Book Now
            </span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/[0.08] px-6 py-6 max-h-[80vh] overflow-y-auto">
          <ul className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm tracking-[2px] uppercase text-white/70 hover:text-red-light transition-colors block py-2"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a href="#booking" onClick={() => setMenuOpen(false)} className="btn-3d-wrapper inline-block">
                <span className="btn-3d inline-block bg-red text-white px-6 py-3 text-[11px] tracking-[2px] uppercase font-inter font-medium rounded-sm">
                  Book Now
                </span>
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <video
  src="/videos/hero_travel.mp4"
  autoPlay
  muted
  loop
  playsInline
  className="w-full h-full object-cover"
/>
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-red/5 blur-[80px] md:blur-[100px] -top-12 -right-12 md:-top-24 md:-right-24 animate-orbFloat" />
        <div className="absolute w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-red/3 blur-[60px] md:blur-[80px] bottom-0 -left-12 animate-orbFloat" style={{ animationDelay: '-3s' }} />
        <div className="absolute w-[150px] h-[150px] md:w-[300px] md:h-[300px] rounded-full bg-white/3 blur-[40px] md:blur-[60px] top-1/3 left-1/3 animate-orbFloat" style={{ animationDelay: '-5s' }} />
      </div>

      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 60% 50%, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 60% 50%, black 30%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pt-20 md:pt-24">
        <div className="max-w-[800px]">
          <div className="mb-5 md:mb-8 opacity-0 animate-fadeSlideUp text-[10px] md:text-[11px]">
            <span className="w-1.5 h-1.5 bg-red rounded-full pulse-dot mr-2" />
            Bhuj · Gujarat · Est. 2010+
          </div>

          <h1 className="font-playfair text-[clamp(32px,8vw,84px)] font-normal leading-[1.05] tracking-tight text-white mb-4 md:mb-6 opacity-0 animate-fadeSlideUp" style={{ animationDelay: '0.2s' }}>
            Journey Beyond<br />
            <em className="text-red not-italic">Every Horizon</em>
            <span className="block ml-0 md:ml-14 mt-1">You Dream</span>
          </h1>

          <p className="text-[13px] md:text-[15px] text-white/60 leading-[1.8] max-w-[480px] mb-8 md:mb-10 opacity-0 animate-fadeSlideUp" style={{ animationDelay: '0.4s' }}>
            India's most treasured landscapes await. From the salt flats of Kutch to the snowy peaks of Himachal — we craft journeys that become memories for a lifetime.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 opacity-0 animate-fadeSlideUp" style={{ animationDelay: '0.6s' }}>
            <a href="#packages" className="btn-3d-wrapper">
              <span className="btn-3d inline-block bg-red text-white px-6 md:px-8 py-3.5 md:py-4 text-[11px] md:text-[12px] tracking-[2px] uppercase font-inter font-medium rounded-sm cursor-pointer">
                Explore Packages
              </span>
            </a>
            
          </div>
        </div>
      </div>
    
      {/* Stats - positioned at bottom right */}
      <div className="absolute right-4 md:right-12 bottom-16 md:bottom-10 z-10 flex flex-row md:flex-col gap-4 md:gap-5 opacity-0 animate-fadeSlideUp" style={{ animationDelay: '0.8s' }}>
        {[
          { num: '10+', label: 'Years of Trust' },
          { num: '5K+', label: 'Happy Travellers' },
          { num: '50+', label: 'Destinations' },
        ].map((stat) => (
          <div key={stat.label} className="text-center md:text-right">
            <div className="font-playfair text-[28px] md:text-[42px] font-light text-red leading-none">{stat.num}</div>
            <div className="text-[9px] md:text-[10px] tracking-[2px] uppercase text-white/50 mt-0.5 md:mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
</section>
  );
}

/* ─── Marquee ─── */
function Marquee() {
  const items = [
    'Saurashtra Darshan', 'Kutch Desert Festival', 'Goa Beach Escape',
    'Himachal Snow Retreat', 'Char Dham Yatra', 'Rajasthan Royal Tour',
    'Gujarat Heritage Circuit', 'Corporate Tours &amp; Events',
  ];

  return (
    <div className="bg-red-pale border-y border-red/20 py-4 md:py-5 overflow-hidden whitespace-nowrap">
      <div className="marquee-track inline-flex">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="font-playfair text-[11px] md:text-[13px] tracking-[3px] uppercase text-red-light px-6 md:px-10">
            {item}
            <span className="text-red ml-6 md:ml-10">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Destinations ─── */
function Destinations() {
  const destinations = [
    { name: 'Saurashtra Darshan', tag: 'Cultural Heritage', desc: 'Ancient temples, folk traditions and artistic heritage of Gujarat\'s heartland.', img: '/images/saurashtra.png' },
    { name: 'Rann of Kutch', tag: 'Desert Wonder', desc: 'The world\'s largest salt desert shimmers under the moonlight.', img: '/images/kutch.png' },
    { name: 'Goa Paradise', tag: 'Beach &amp; Sun', desc: 'Endless beaches and vibrant nightlife on India\'s sunny coast.', img: '/images/goa.png' },
    { name: 'Himachal Pradesh', tag: 'Mountain Escape', desc: 'Snow-capped peaks and valley meadows await the bold explorer.', img: '/images/himachal.png' },
    { name: 'Rajasthan Royale', tag: 'Royal Legacy', desc: 'Palaces, forts and golden sands of India\'s most regal state.', img: '/images/rajasthan.png' },
    { name: 'Gujarat Splendour', tag: 'Jain Heritage', desc: 'Magnificent temples, wildlife and coastal wonders of Gujarat.', img: '/images/gujarat.png' },
  ];

  return (
    <section id="destinations" className="py-16 md:py-24 lg:py-32 px-4 md:px-8 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 reveal">
          <div>
            <div className="section-label mb-3 md:mb-4">Our Destinations</div>
            <h2 className="section-title text-[clamp(28px,5vw,56px)]">
              India's Most <em>Breathtaking</em><br className="hidden md:block" /> Corners Await You
            </h2>
          </div>
          <a href="#packages" className="group flex items-center gap-3 text-white text-[11px] md:text-[12px] tracking-[2px] uppercase mt-4 md:mt-0 transition-all duration-300 hover:gap-5">
            <span className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/15 flex items-center justify-center group-hover:bg-white/10 group-hover:border-red transition-all duration-300">
              <ArrowRight size={16} />
            </span>
            All Destinations
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4">
          <div className="dest-card sm:col-span-2 lg:col-span-6 h-[300px] md:h-[420px] relative overflow-hidden rounded cursor-pointer group card-3d reveal-up">
            <img src={destinations[0].img} alt={destinations[0].name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
              <span className="inline-block glass-card px-2.5 md:px-3 py-1 text-[8px] md:text-[9px] tracking-[2px] uppercase text-red-light rounded-sm mb-2 md:mb-3">{destinations[0].tag}</span>
              <h3 className="font-playfair text-[22px] md:text-[clamp(22px,2.5vw,32px)] font-normal leading-tight text-white whitespace-pre-line">{destinations[0].name}</h3>
              <p className="text-[11px] md:text-[12px] text-white/60 mt-2 max-h-0 overflow-hidden opacity-0 group-hover:max-h-[80px] group-hover:opacity-100 transition-all duration-400">{destinations[0].desc}</p>
            </div>
            <div className="absolute top-5 right-5 md:top-6 md:right-6 w-8 h-8 md:w-9 md:h-9 rounded-full glass-card flex items-center justify-center -rotate-45 opacity-0 group-hover:opacity-100 group-hover:rotate-0 transition-all duration-300">
              <ArrowRight size={14} className="text-white" />
            </div>
          </div>

          <div className="dest-card lg:col-span-3 h-[300px] md:h-[420px] relative overflow-hidden rounded cursor-pointer group card-3d reveal-up reveal-delay-1">
            <img src={destinations[1].img} alt={destinations[1].name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
              <span className="inline-block glass-card px-2.5 md:px-3 py-1 text-[8px] md:text-[9px] tracking-[2px] uppercase text-red-light rounded-sm mb-2 md:mb-3">{destinations[1].tag}</span>
              <h3 className="font-playfair text-[20px] md:text-[clamp(20px,2vw,28px)] font-normal leading-tight text-white whitespace-pre-line">{destinations[1].name}</h3>
              <p className="text-[11px] md:text-[12px] text-white/60 mt-2 max-h-0 overflow-hidden opacity-0 group-hover:max-h-[80px] group-hover:opacity-100 transition-all duration-400">{destinations[1].desc}</p>
            </div>
            <div className="absolute top-5 right-5 md:top-6 md:right-6 w-8 h-8 md:w-9 md:h-9 rounded-full glass-card flex items-center justify-center -rotate-45 opacity-0 group-hover:opacity-100 group-hover:rotate-0 transition-all duration-300">
              <ArrowRight size={14} className="text-white" />
            </div>
          </div>

          <div className="dest-card lg:col-span-3 h-[300px] md:h-[420px] relative overflow-hidden rounded cursor-pointer group card-3d reveal-up reveal-delay-2">
            <img src={destinations[2].img} alt={destinations[2].name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
              <span className="inline-block glass-card px-2.5 md:px-3 py-1 text-[8px] md:text-[9px] tracking-[2px] uppercase text-red-light rounded-sm mb-2 md:mb-3">{destinations[2].tag}</span>
              <h3 className="font-playfair text-[20px] md:text-[clamp(20px,2vw,28px)] font-normal leading-tight text-white whitespace-pre-line">{destinations[2].name}</h3>
              <p className="text-[11px] md:text-[12px] text-white/60 mt-2 max-h-0 overflow-hidden opacity-0 group-hover:max-h-[80px] group-hover:opacity-100 transition-all duration-400">{destinations[2].desc}</p>
            </div>
            <div className="absolute top-5 right-5 md:top-6 md:right-6 w-8 h-8 md:w-9 md:h-9 rounded-full glass-card flex items-center justify-center -rotate-45 opacity-0 group-hover:opacity-100 group-hover:rotate-0 transition-all duration-300">
              <ArrowRight size={14} className="text-white" />
            </div>
          </div>

          {destinations.slice(3).map((dest, i) => (
            <div key={dest.name} className={`dest-card sm:col-span-1 lg:col-span-4 h-[240px] md:h-[320px] relative overflow-hidden rounded cursor-pointer group card-3d reveal-up reveal-delay-${i + 1}`}>
              <img src={dest.img} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                <span className="inline-block glass-card px-2.5 md:px-3 py-1 text-[8px] md:text-[9px] tracking-[2px] uppercase text-red-light rounded-sm mb-2 md:mb-3">{dest.tag}</span>
                <h3 className="font-playfair text-[20px] md:text-[clamp(20px,2vw,28px)] font-normal leading-tight text-white whitespace-pre-line">{dest.name}</h3>
                <p className="text-[11px] md:text-[12px] text-white/60 mt-2 max-h-0 overflow-hidden opacity-0 group-hover:max-h-[80px] group-hover:opacity-100 transition-all duration-400">{dest.desc}</p>
              </div>
              <div className="absolute top-5 right-5 md:top-6 md:right-6 w-8 h-8 md:w-9 md:h-9 rounded-full glass-card flex items-center justify-center -rotate-45 opacity-0 group-hover:opacity-100 group-hover:rotate-0 transition-all duration-300">
                <ArrowRight size={14} className="text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Services ─── */
function Services() {
  const services = [
    { icon: <MapPin size={22} />, title: 'Custom Tour Packages', desc: 'Tailor-made itineraries for families, friends and corporates. From budget getaways to luxury escapes - designed around your dreams.', link: '#packages' },
    { icon: <Car size={22} />, title: 'Premium Taxi &amp; Cab Service', desc: 'Comfortable, sanitized vehicles with experienced, courteous drivers for airport transfers, local sightseeing and intercity travel.', link: '#booking' },
    { icon: <Plane size={22} />, title: 'Airport Pick & Drop', desc: 'Punctual, comfortable airport transfers to and from all major airports. Flight tracking, meet & greet, and zero waiting stress.', link: '#booking' },
    { icon: <MapPin size={22} />, title: 'Railway Station Pick & Drop', desc: 'Reliable pickup and drop service to all major railway stations. On-time arrivals, luggage assistance, and hassle-free rides.', link: '#booking' },
    { icon: <Church size={22} />, title: 'Spiritual &amp; Pilgrimage Tours', desc: 'Char Dham, Ujjain, Dwarka and beyond - reverent journeys to India\'s most sacred destinations, planned with devotion.', link: '#packages' },
    { icon: <Building2 size={22} />, title: 'Corporate Travel', desc: 'Seamless travel management for government and corporate organizations. Contract vehicles, group travel and executive solutions.', link: '#booking' },
  ];

  return (
    <section id="services" className="py-16 md:py-24 lg:py-32 px-4 md:px-8 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12 md:mb-16 reveal-down">
          <div className="section-label mb-3 md:mb-4">What We Offer</div>
          <h2 className="section-title text-[clamp(28px,5vw,56px)]">
            Travel Services<br className="md:hidden" /> Crafted for <em>Comfort</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-white/[0.08] rounded-lg overflow-hidden reveal-scale">
          {services.map((service, i) => (
            <div
              key={service.title}
              className={`service-card bg-[#0a0a0a] p-6 md:p-10 lg:p-12 relative overflow-hidden group transition-all duration-400 hover:bg-[#111] ${
                i < services.length - 1 ? 'border-b border-white/[0.08]' : ''
              } ${i % 2 === 0 && i < services.length - 1 ? 'sm:border-r lg:border-r border-white/[0.08]' : ''} ${i % 3 !== 2 ? 'lg:border-r border-white/[0.08]' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              <div className="relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/[0.03] border border-white/[0.08] rounded flex items-center justify-center mb-5 md:mb-7 text-white/70 group-hover:text-red-light group-hover:border-red/30 transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="font-playfair text-[18px] md:text-[22px] font-normal text-white mb-2 md:mb-3">{service.title}</h3>
                <p className="text-[12px] md:text-[13px] text-white/50 leading-[1.8]">{service.desc}</p>
                <a href={service.link} className="inline-flex items-center gap-2 mt-4 md:mt-6 text-[10px] md:text-[11px] tracking-[2px] uppercase text-red hover:gap-4 transition-all duration-300">
                  Explore <ChevronRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── About ─── */
function About() {
  const features = [
    { strong: '10+ Years', text: 'of industry expertise &amp; local knowledge' },
    { strong: 'Safety First', text: '- sanitized vehicles, trained drivers, regular checks' },
    { strong: 'Transparent Pricing', text: '- no hidden charges, ever' },
    { strong: 'Government &amp; Corporate', text: 'approved travel contracts' },
    { strong: '24/7 Support', text: '- your ride is always just a call away' },
  ];

  return (
    <section id="about" className="py-16 md:py-24 lg:py-32 px-4 md:px-8 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">
          <div className="relative order-2 lg:order-1 reveal-left">
            <div className="w-full aspect-[4/5] relative rounded overflow-hidden max-w-[500px] mx-auto lg:mx-0">
              <img src="/images/about_journey.png" alt="Family journey" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 md:-bottom-8 -right-2 md:-right-4 lg:-right-8 glass-card rounded-lg p-4 md:p-6 lg:p-7 min-w-[140px] md:min-w-[180px]">
              <div className="font-playfair text-[32px] md:text-[48px] font-light text-red leading-none">10+</div>
              <div className="text-[10px] md:text-[11px] text-white/50 tracking-[1px] mt-1 md:mt-2">Years of Excellence</div>
            </div>
          </div>

          <div className="order-1 lg:order-2 reveal-right">
            <div className="section-label mb-3 md:mb-4">Our Story</div>
            <h2 className="section-title text-[clamp(28px,5vw,56px)] mb-4 md:mb-6">
              Your Most Trusted<br /><em>Travel Partner</em><br />in Gujarat
            </h2>
            <p className="text-[13px] md:text-[15px] text-white/50 leading-[1.9] mb-4 md:mb-5">
              For over a decade, Maa Tour &amp; Travels has been the most respected name in travel across Bhuj, Gujarat, Rajasthan, Maharashtra and Goa. Founded with a passion for making travel accessible, comfortable and unforgettable.
            </p>
            <p className="text-[13px] md:text-[15px] text-white/50 leading-[1.9] mb-6 md:mb-8">
              Our commitment: economical pricing, friendly staff, expert drivers and completely transparent service - because your dream holiday deserves nothing less than perfection.
            </p>

            <div className="flex flex-col gap-3 md:gap-4">
              {features.map((f) => (
                <div key={f.strong} className="flex items-start md:items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/[0.03] border border-white/[0.08] rounded transition-all duration-300 hover:bg-white/[0.06] hover:border-red/30">
                  <div className="w-6 h-6 md:w-7 md:h-7 min-w-[24px] md:min-w-[28px] rounded-full bg-red-pale border border-red/30 flex items-center justify-center mt-0.5 md:mt-0">
                    <Check size={12} className="text-red" />
                  </div>
                  <span className="text-[12px] md:text-[13px] text-white/50 leading-[1.6]">
                    <strong className="text-white font-medium">{f.strong}</strong> {f.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Packages ─── */
function Packages() {
  const packages = [
    {
      img: '/images/saurashtra.png',
      dur: '3 Days',
      route: 'Rajkot -> Somnath -> Dwarka -> Return',
      name: 'Saurashtra Darshan',
      pax: 'Up to 6',
      vehicle: 'A/C Vehicle',
      price: '7,500',
      featured: false,
    },
    {
      img: '/images/kutch.png',
      dur: '2 Days',
      route: 'Bhuj -> Rann of Kutch -> Mandvi -> Return',
      name: 'Rann of Kutch',
      pax: 'Up to 6',
      vehicle: 'A/C Vehicle',
      price: '6,500',
      featured: false,
    },
    {
      img: '/images/goa.png',
      dur: '5 Days',
      route: 'Panaji -> Calangute -> Baga -> Palolem -> Return',
      name: 'Goa Paradise',
      pax: 'Up to 6',
      vehicle: 'A/C Vehicle',
      price: '12,000',
      featured: false,
    },
    {
      img: '/images/himachal.png',
      dur: '6 Days',
      route: 'Shimla -> Manali -> Dharamshala -> Return',
      name: 'Himachal Pradesh',
      pax: 'Up to 6',
      vehicle: 'A/C Vehicle',
      price: '15,000',
      featured: false,
    },
    {
      img: '/images/rajasthan.png',
      dur: '5 Days',
      route: 'Bhuj -> Jaipur -> Jaisalmer -> Udaipur',
      name: 'Rajasthan Royal Heritage',
      pax: 'Up to 6',
      vehicle: 'A/C Vehicle',
      price: '9,500',
      featured: true,
    },
    {
      img: '/images/gujarat.png',
      dur: '4 Days',
      route: 'Ahmedabad -> Vadodara -> Surat -> Bhuj',
      name: 'Gujarat Splendour',
      pax: 'Up to 6',
      vehicle: 'A/C Vehicle',
      price: '8,000',
      featured: false,
    },
  ];

  return (
    <section id="packages" className="py-16 md:py-24 lg:py-32 px-4 md:px-8 lg:px-12 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 reveal">
          <div>
            <div className="section-label mb-3 md:mb-4">Featured Tours</div>
            <h2 className="section-title text-[clamp(28px,5vw,56px)]">
              Our Most Beloved<br /><em>Journeys</em>
            </h2>
          </div>
          <a href="#booking" className="group flex items-center gap-3 text-white text-[11px] md:text-[12px] tracking-[2px] uppercase mt-4 md:mt-0 transition-all duration-300 hover:gap-5">
            <span className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/15 flex items-center justify-center group-hover:bg-white/10 group-hover:border-red transition-all duration-300">
              <ArrowRight size={16} />
            </span>
            Custom Package
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {packages.map((pkg, i) => (
            <div key={pkg.name} className={`pkg-card bg-[#111] border border-white/[0.08] rounded-lg overflow-hidden transition-all duration-500 group card-3d reveal-up reveal-delay-${i + 1} ${pkg.featured ? 'border-red/40' : ''}`}>
              {pkg.featured && (
                <div className="absolute top-3 md:top-4 right-3 md:right-4 z-10 bg-red text-black text-[8px] md:text-[9px] tracking-[2px] uppercase px-2.5 md:px-3 py-0.5 md:py-1 rounded-sm">
                  Popular
                </div>
              )}
              <div className="h-[180px] md:h-[220px] relative overflow-hidden">
                <img src={pkg.img} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                <div className="absolute top-3 md:top-4 left-3 md:left-4 glass-card px-2.5 md:px-3 py-0.5 md:py-1 text-[9px] md:text-[10px] tracking-[1.5px] uppercase text-red-light rounded-sm">
                  {pkg.dur}
                </div>
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 glass-card px-2.5 md:px-3 py-0.5 md:py-1 text-[9px] md:text-[10px] tracking-[1.5px] uppercase text-white/70 rounded-sm">
                  {pkg.vehicle}
                </div>
              </div>
              <div className="p-4 md:p-6">
                <div className="text-[9px] md:text-[10px] tracking-[2px] uppercase text-red mb-2">{pkg.route}</div>
                <h3 className="font-playfair text-[18px] md:text-[22px] font-normal leading-tight text-white mb-3 md:mb-4">{pkg.name}</h3>
                <div className="flex items-center gap-3 mb-4 md:mb-5">
                  <span className="flex items-center gap-1.5 text-[10px] md:text-[11px] text-white/50"><Users size={11} /> {pkg.pax} Passengers</span>
                </div>
                <div className="pt-3 md:pt-4 border-t border-white/[0.08]">
                  <a href="#booking" className="btn-3d-wrapper block w-full">
                    <span className="btn-3d flex items-center justify-center gap-2 w-full bg-white/[0.05] border border-white/[0.15] text-white text-[9px] md:text-[10px] tracking-[2px] uppercase px-3 md:px-4 py-2.5 md:py-3 rounded-sm group-hover:bg-red group-hover:border-red group-hover:text-white transition-colors duration-300">
                      <Car size={12} /> Book Cab
                    </span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
function Testimonials() {
  const testimonials = [
    { stars: 5, text: '"Best trip destination knowledge, too much cooperative and honest, excellent service, driving skill excellent. Highly recommend to everyone."', name: 'Rajesh Mehta', loc: 'Bhuj, Gujarat', avatar: 'R' },
    { stars: 5, text: '"Best service and best travel planner in Bhuj - all Gujarat, Rajasthan, Maharashtra and Goa. Most popular and trusted."', name: 'Priya Sharma', loc: 'Ahmedabad, Gujarat', avatar: 'P' },
    { stars: 5, text: '"Very good service, enjoyed my trip a lot, cars are also good and completely satisfied with the driver. They deserve to be at the top."', name: 'Amit Patel', loc: 'Surat, Gujarat', avatar: 'A' },
    { stars: 5, text: '"Economical cost, friendly staff and drivers, affordable trip for family. Comfortable and suitable for any occasion. Absolutely loved every moment!"', name: 'Sunita Joshi', loc: 'Vadodara, Gujarat', avatar: 'S' },
    { stars: 5, text: '"Our Saurashtra darshan was perfectly planned. The driver was so knowledgeable about local temples and traditions. Truly a spiritual experience."', name: 'Deepak Trivedi', loc: 'Mumbai, Maharashtra', avatar: 'D' },
    { stars: 5, text: '"They arranged our company annual trip flawlessly - 40 employees, 4 days in Goa. Every detail was perfect. Will definitely book again."', name: 'Kavita Bhai', loc: 'Bhuj, Gujarat', avatar: 'K' },
    { stars: 5, text: '"The Kutch trip was magical. Sanitized car, professional driver, great hotel recommendations. Maa Tours truly made it once in a lifetime."', name: 'Mohan Desai', loc: 'Bhavnagar, Gujarat', avatar: 'M' },
    { stars: 5, text: '"Airport pickup was seamless, driver was on time and very polite. Baggage transfer was smooth. Will use Maa Tours for all my future travel needs."', name: 'Neha Chauhan', loc: 'Junagadh, Gujarat', avatar: 'N' },
  ];

  const allTestimonials = [...testimonials, ...testimonials];

  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const resumeTimerRef = useRef<number | null>(null);
  const wasDraggingRef = useRef(false);
  const animationRef = useRef<Animation | null>(null);

  const clearResumeTimer = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  };

  const startResumeTimer = () => {
    clearResumeTimer();
    resumeTimerRef.current = window.setTimeout(() => {
      setIsPaused(false);
    }, 15000);
  };

  // Start CSS animation when not paused
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (!isPaused) {
      // Create or resume animation
      const keyframes = [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-50%)' }
      ];
      const options: KeyframeAnimationOptions = {
        duration: 20000,
        iterations: Infinity,
        easing: 'linear'
      };

      if (animationRef.current) {
        animationRef.current.play();
      } else {
        animationRef.current = track.animate(keyframes, options);
      }
    } else {
      // Pause animation
      if (animationRef.current) {
        animationRef.current.pause();
      }
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.cancel();
        animationRef.current = null;
      }
    };
  }, [isPaused]);

  const handleMouseEnter = () => {
    if (!isDragging) {
      setIsPaused(true);
      clearResumeTimer();
    }
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      startResumeTimer();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setIsPaused(true);
    clearResumeTimer();
    wasDraggingRef.current = false;
    setStartX(e.pageX);
    setScrollStart(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    wasDraggingRef.current = true;
    const walk = (e.pageX - startX) * 1.5;
    containerRef.current.scrollLeft = scrollStart - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    startResumeTimer();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setIsPaused(true);
    clearResumeTimer();
    wasDraggingRef.current = false;
    setStartX(e.touches[0].pageX);
    setScrollStart(containerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    wasDraggingRef.current = true;
    const walk = (e.touches[0].pageX - startX) * 1.5;
    containerRef.current.scrollLeft = scrollStart - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    startResumeTimer();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (wasDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
    wasDraggingRef.current = false;
  };

  useEffect(() => {
    return () => {
      clearResumeTimer();
      if (animationRef.current) {
        animationRef.current.cancel();
      }
    };
  }, []);

  return (
    <section id="testimonials" className="py-16 md:py-24 lg:py-32 px-4 md:px-8 lg:px-12 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-10 md:mb-16 reveal-down">
          <div className="section-label mb-3 md:mb-4">Traveller Stories</div>
          <h2 className="section-title text-[clamp(28px,5vw,56px)]">
            Memories Crafted,<br /><em>Trust Earned</em>
          </h2>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="overflow-x-auto scrollbar-hide"
        style={{ 
          cursor: isDragging ? 'grabbing' : 'grab',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        <div 
          ref={trackRef}
          className="flex gap-4 md:gap-6"
          style={{ width: 'max-content' }}
        >
          {allTestimonials.map((t, i) => (
            <div 
              key={i} 
              className="testi-card min-w-[300px] md:min-w-[380px] max-w-[300px] md:max-w-[380px] bg-[#111] border border-white/[0.08] rounded-lg p-5 md:p-8 flex-shrink-0 transition-all duration-300 hover:border-red/30 select-none"
            >
              <div className="flex gap-1 mb-3 md:mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={13} className="text-red fill-red" />
                ))}
              </div>
              <p className="font-playfair text-[15px] md:text-[17px] italic font-light leading-[1.7] text-white/90 mb-4 md:mb-6">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-red/30 to-red/10 flex items-center justify-center font-playfair text-[14px] md:text-[16px] text-red-light border border-red/30">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-[12px] md:text-[13px] font-medium text-white">{t.name}</div>
                  <div className="text-[10px] md:text-[11px] text-white/50 tracking-[1px]">{t.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Our Fleet ─── */
function OurFleet() {
  const cars = [
    { name: 'Ertiga', slug: 'ertiga', type: 'MPV · 7 Seater', desc: 'Spacious and comfortable MPV, ideal for family trips and group travel across Gujarat.' },
    { name: 'Toyota Innova', slug: 'toyota-innova', type: 'SUV · 7 Seater', desc: 'The gold standard in premium cab travel — powerful, plush, and perfect for long journeys.' },
    { name: 'Innova Crysta', slug: 'innova-crysta', type: 'SUV · 7 Seater', desc: 'Premium variant of the Innova with superior interiors and ride comfort for discerning travellers.' },
    { name: 'Sedan', slug: 'sedan', type: 'Sedan · 4 Seater', desc: 'Sleek and fuel-efficient sedan for comfortable airport transfers and city rides.' },
    { name: 'Toofan (Non-AC)', slug: 'toofan-non-ac', type: 'Van · 8 Seater', desc: 'Rugged and economical van — perfect for group travel on a budget without compromising on space.' },
    { name: 'Toofan (AC)', slug: 'toofan-ac', type: 'Van · 8 Seater', desc: 'Air-conditioned Toofan for comfortable group journeys in all seasons across Gujarat.' },
    { name: 'Tempo Traveller', slug: 'tempo-traveller', type: 'Minivan · 12–17 Seater', desc: 'The ultimate choice for large group travel — spacious, comfortable, and built for long routes.' },
    { name: 'Bus', slug: 'bus', type: 'Bus · 20–50 Seater', desc: 'Full-size buses for corporate trips, school excursions, and large group pilgrimages across India.' },
    { name: 'Urbania', slug: 'urbania', type: 'Luxury Van · 17 Seater', desc: 'Force Urbania — a luxury coach with premium seating for a first-class group travel experience.' },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollStart(scrollRef.current?.scrollLeft ?? 0);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    scrollRef.current.scrollLeft = scrollStart - (e.pageX - startX);
  };
  const onMouseUp = () => setIsDragging(false);

  return (
    <section className="py-16 md:py-24 lg:py-32 px-4 md:px-8 lg:px-12 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-10 md:mb-16 reveal-down">
          <div className="section-label mb-3 md:mb-4">Our Fleet</div>
          <h2 className="section-title text-[clamp(28px,5vw,56px)]">
            Travel in <em>Comfort &amp; Style</em>
          </h2>
          <p className="text-[13px] md:text-[14px] text-white/50 mt-3 md:mt-4 max-w-[480px] mx-auto leading-[1.8]">Swipe to explore the vehicles we use for your journeys</p>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide px-4 md:px-8 lg:px-12"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: isDragging ? 'grabbing' : 'grab', WebkitOverflowScrolling: 'touch' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div className="flex gap-4 md:gap-6" style={{ width: 'max-content', paddingBottom: '8px' }}>
          {cars.map((car) => (
            <div
              key={car.slug}
              className="flex-shrink-0 w-[280px] md:w-[360px] bg-[#111] border border-white/[0.08] rounded-lg overflow-hidden group hover:border-red/30 transition-all duration-300 select-none"
            >
              {/* Car Image */}
              <div className="h-[180px] md:h-[220px] bg-white/[0.03] relative overflow-hidden flex items-center justify-center">
                <img
                  src={`/images/${car.slug}.jpg`}
                  alt={car.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent && !parent.querySelector('.placeholder-icon')) {
                      const ph = document.createElement('div');
                      ph.className = 'placeholder-icon flex flex-col items-center justify-center gap-3 absolute inset-0';
                      ph.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><rect x="7" y="14" width="10" height="6" rx="1"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg><span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.2)">Image Coming Soon</span>`;
                      parent.appendChild(ph);
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 glass-card px-2.5 py-0.5 text-[9px] tracking-[1.5px] uppercase text-red-light rounded-sm">
                  {car.type}
                </div>
              </div>
              {/* Car Info */}
              <div className="p-5 md:p-6">
                <h3 className="font-playfair text-[20px] md:text-[24px] font-normal text-white mb-2">{car.name}</h3>
                <p className="text-[12px] md:text-[13px] text-white/50 leading-[1.7]">{car.desc}</p>
                <a
                  href="#booking"
                  className="mt-4 flex items-center gap-2 text-[9px] md:text-[10px] tracking-[2px] uppercase text-red hover:text-red-light transition-colors duration-300"
                >
                  <Car size={12} /> Book This Car
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    serviceType: '',
    carType: '',
    pickup: '',
    drop: '',
    date: '',
    time: ''
  });

  const cities = [
    'Ahmedabad', 'Vadodara', 'Rajkot', 'Jamnagar', 'Surat', 'Porbandar', 'Junagadh', 'Morbi', 'Anand',
    'Patan', 'Bharuch', 'Bhavnagar', 'Mehsana', 'Navsari', 'Bhuj', 'Gandhidham', 'Gondal', 'Gandhinagar',
    'Godhra', 'Palanpur', 'Nadiad', 'Valsad', 'Deesa', 'Kheda', 'Amreli', 'Botad', 'Vapi', 'Veraval',
    'Kalol', 'Jetpur', 'Dudhrej', 'Chhota Udepur', 'Dahod', 'Mandavi', 'Vankaner', 'Idar', 'Lunawada',
    'Khambhariya', 'Himatnagar', 'Modasa', 'Vyara', 'Rajpipla', 'Dhandhuka', 'Ankleshwar', 'Padra',
    'Bhachau', 'Jambusar', 'Ranavav', 'Dwarka', 'Okha', 'Saputara', 'Somnath', 'Una', 'Diu', 'Daman',
    'Viramgam', 'Harvard', 'Matamadh', 'Mundra', 'Bhanvad', 'Sasangir', 'Udaipur', 'Chittorgarh',
    'Nathdwara', 'Abu', 'Sirohi', 'Jodhpur', 'Ajmer', 'Kumbhalgarh', 'Pindwada', 'Jaalol', 'Radhanpur'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceLabel = formData.serviceType === 'airport' ? 'Airport Pick & Drop' : formData.serviceType === 'railway' ? 'Railway Station Pick & Drop' : 'Outstation Pick & Drop';
    const msg = `Hello Maa Travels! I would like to book a journey.

*Service Type:* ${serviceLabel}
*Car Type:* ${formData.carType || 'Not specified'}
*Name:* ${formData.name}
*Pickup:* ${formData.pickup}
*Drop:* ${formData.drop}
*Date:* ${formData.date}
*Time:* ${formData.time}`;
    const encodedMsg = encodeURIComponent(msg);
    window.open(`https://wa.me/919558050710?text=${encodedMsg}`, '_blank');
  };

  const contactItems = [
    { icon: <Phone size={16} />, label: 'Call Us', val: '+91 9558050710' },
    { icon: <MessageCircle size={16} />, label: 'WhatsApp', val: '+91 9558050710' },
    { icon: <Mail size={16} />, label: 'Email', val: 'info@maatourandtravels.in' },
    { icon: <MapPinned size={16} />, label: 'Office', val: 'Bhuj, Gujarat, India' },
  ];

  return (
    <section id="contact" className="py-16 md:py-24 lg:py-32 px-4 md:px-8 lg:px-12 bg-gradient-to-br from-[#0a0a0a] to-[#111] relative overflow-hidden">
      <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-red/5 blur-[100px] md:blur-[150px] -top-[100px] md:-top-[200px] -right-[100px] md:-right-[200px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-20">
          <div className="reveal-left">
            <div className="section-label mb-3 md:mb-4">Get In Touch</div>
            <h2 className="section-title text-[clamp(28px,5vw,56px)] mb-4 md:mb-6">
              Begin Your<br /><em>Journey</em><br />With Us Today
            </h2>
            <p className="text-[13px] md:text-[15px] text-white/50 leading-[1.9] mb-8 md:mb-10">
              Whether you're planning a family holiday, a spiritual pilgrimage, a corporate retreat or simply need a reliable ride - we're here, ready to make it extraordinary.
            </p>

            <div className="flex flex-col gap-3 md:gap-5">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3 md:gap-4 p-4 md:p-5 bg-white/[0.03] border border-white/[0.08] rounded transition-all duration-300 hover:bg-white/[0.06] hover:border-red/30">
                  <div className="w-10 h-10 md:w-11 md:h-11 min-w-[40px] md:min-w-[44px] bg-red-pale border border-red/20 rounded flex items-center justify-center text-red">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[9px] md:text-[10px] tracking-[2px] uppercase text-red mb-0.5">{item.label}</div>
                    <div className="text-[13px] md:text-[14px] text-white">{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-right" id="booking">
            <form onSubmit={handleSubmit} className="glass-card rounded-lg p-6 md:p-8 lg:p-12">
              <h3 className="font-playfair text-[22px] md:text-[28px] font-light text-white mb-4 md:mb-6">Plan Your Journey</h3>

              {/* Service Type Selector */}
              <div className="flex flex-col gap-2 mb-5 md:mb-6">
                <label className="text-[9px] md:text-[10px] tracking-[2px] uppercase text-white/50">Select Service Type</label>
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {([
                    { value: 'airport', label: 'Airport', icon: <Plane size={15} /> },
                    { value: 'railway', label: 'Railway', icon: <MapPinned size={15} /> },
                    { value: 'outstation', label: 'Outstation', icon: <Car size={15} /> },
                  ] as { value: string; label: string; icon: React.ReactNode }[]).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceType: opt.value })}
                      className={`flex flex-col items-center justify-center gap-1.5 py-3 px-1 rounded text-[9px] tracking-[1.5px] uppercase font-medium transition-all duration-300 border ${
                        formData.serviceType === opt.value
                          ? 'bg-red border-red text-white'
                          : 'bg-white/5 border-white/[0.08] text-white/60 hover:border-red/40 hover:text-white'
                      }`}
                    >
                      {opt.icon}
                      <span className="leading-none">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Car Type Selector */}
              <div className="flex flex-col gap-2 mb-5 md:mb-6">
                <label className="text-[9px] md:text-[10px] tracking-[2px] uppercase text-white/50">Select Car Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: 'Ertiga', label: 'Ertiga' },
                    { value: 'Toyota Innova', label: 'Innova' },
                    { value: 'Innova Crysta', label: 'Crysta' },
                    { value: 'Sedan', label: 'Sedan' },
                    { value: 'Toofan (Non-AC)', label: 'Toofan Non-AC' },
                    { value: 'Toofan (AC)', label: 'Toofan AC' },
                    { value: 'Tempo Traveller', label: 'Tempo' },
                    { value: 'Bus', label: 'Bus' },
                    { value: 'Urbania', label: 'Urbania' },
                  ] as { value: string; label: string }[]).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, carType: opt.value })}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-1 rounded text-[9px] tracking-[1px] uppercase font-medium transition-all duration-300 border ${
                        formData.carType === opt.value
                          ? 'bg-red border-red text-white'
                          : 'bg-white/5 border-white/[0.08] text-white/60 hover:border-red/40 hover:text-white'
                      }`}
                    >
                      <Car size={11} />
                      <span className="leading-none truncate">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 md:gap-4 mb-5 md:mb-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] md:text-[10px] tracking-[2px] uppercase text-white/50">Your Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name" 
                    className="bg-white/5 border border-white/[0.08] rounded px-3 md:px-4 py-2.5 md:py-3 text-white text-sm outline-none focus:border-red/50 focus:bg-white/[0.08] transition-all" 
                    required 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] md:text-[10px] tracking-[2px] uppercase text-white/50">Pickup Location</label>
                  <select 
                    name="pickup"
                    value={formData.pickup}
                    onChange={handleChange}
                    className="bg-white/5 border border-white/[0.08] rounded px-3 md:px-4 py-2.5 md:py-3 text-black text-sm outline-none focus:border-red/50 focus:bg-white/[0.08] transition-all"
                    required
                  >
                    <option value="">Select pickup city</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] md:text-[10px] tracking-[2px] uppercase text-white/50">Drop Location</label>
                  <select 
                    name="drop"
                    value={formData.drop}
                    onChange={handleChange}
                    className="bg-white/5 border border-white/[0.08] rounded px-3 md:px-4 py-2.5 md:py-3 text-black text-sm outline-none focus:border-red/50 focus:bg-white/[0.08] transition-all"
                    required
                  >
                    <option value="">Select drop city</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] md:text-[10px] tracking-[2px] uppercase text-white/50">Date</label>
                    <input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="bg-white/5 border border-white/[0.08] rounded px-3 md:px-4 py-2.5 md:py-3 text-white text-sm outline-none focus:border-red/50 focus:bg-white/[0.08] transition-all" 
                      required 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] md:text-[10px] tracking-[2px] uppercase text-white/50">Time</label>
                    <input 
                      type="time" 
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="bg-white/5 border border-white/[0.08] rounded px-3 md:px-4 py-2.5 md:py-3 text-white text-sm outline-none focus:border-red/50 focus:bg-white/[0.08] transition-all" 
                      required 
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!formData.serviceType}
                className="w-full py-3.5 md:py-4 rounded-sm text-[10px] md:text-[11px] tracking-[3px] uppercase font-inter font-medium transition-all duration-300 btn-3d bg-red text-black hover:bg-red-light disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Send Booking Enquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="bg-black pt-12 md:pt-20 pb-8 md:pb-10 px-4 md:px-8 lg:px-12 border-t border-white/[0.08]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16 mb-10 md:mb-16">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <img src="/images/logo.jpg" alt="Maa Travels" className="h-8 md:h-10 w-auto rounded" />
              <span className="font-playfair text-xl md:text-2xl text-white">
                Maa <span className="text-red">Travels</span>
              </span>
            </div>
            <p className="text-[12px] md:text-[13px] text-white/50 leading-[1.8] max-w-[300px]">
              Your trusted journey companion for over a decade. Crafting unforgettable experiences across India's most magnificent destinations.
            </p>
          </div>

          <div>
            <div className="text-[10px] tracking-[3px] uppercase text-red mb-4 md:mb-6">Destinations</div>
            <ul className="flex flex-col gap-2 md:gap-3">
              {['Saurashtra', 'Kutch', 'Rajasthan', 'Himachal', 'Goa', 'Gujarat'].map((item) => (
                <li key={item}>
                  <a href="#destinations" className="text-[12px] md:text-[13px] text-white/50 hover:text-red-light transition-colors duration-300 flex items-center gap-2 group">
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">-</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[10px] tracking-[3px] uppercase text-red mb-4 md:mb-6">Services</div>
            <ul className="flex flex-col gap-2 md:gap-3">
              {['Tour Packages', 'Taxi Service', 'Flight Booking', 'Hotel Booking', 'Pilgrimage Tours', 'Corporate Travel'].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-[12px] md:text-[13px] text-white/50 hover:text-red-light transition-colors duration-300 flex items-center gap-2 group">
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">-</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[10px] tracking-[3px] uppercase text-red mb-4 md:mb-6">Company</div>
            <ul className="flex flex-col gap-2 md:gap-3">
              {['About Us', 'Testimonials', 'Contact', 'WhatsApp Us'].map((item) => (
                <li key={item}>
                  <a href={item === 'About Us' ? '#about' : item === 'Testimonials' ? '#testimonials' : item === 'Contact' ? '#contact' : '#contact'} className="text-[12px] md:text-[13px] text-white/50 hover:text-red-light transition-colors duration-300 flex items-center gap-2 group">
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">-</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-6 md:pt-8 border-t border-white/[0.08] text-[11px] md:text-[12px] text-white/50 gap-2 md:gap-4">
          <div>© 2025 Maa Tour &amp; Travels. All rights reserved.</div>
          <div>
            Designed with <span className="text-red">♥</span> in Bhuj, Gujarat | <a href="#" className="text-red-light hover:underline">maatourandtravels.in</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── WhatsApp Button ─── */
function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919558050710"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 md:bottom-8 right-4 md:right-8 z-50 w-12 h-12 md:w-14 md:h-14 bg-[#25D366] rounded-full flex items-center justify-center whatsapp-pulse hover:scale-110 transition-transform duration-300"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 md:w-7 md:h-7">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
}

/* ─── Splash Screen ─── */
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFading, setIsFading] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Lock scroll while splash is showing
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => setVideoLoaded(true);

    const handleEnded = () => {
      setIsFading(true);
      setTimeout(() => {
        document.body.style.overflow = '';
        window.scrollTo(0, 0);
        onComplete();
      }, 800);
    };

    video.addEventListener('loadeddata', handleLoaded);
    video.addEventListener('ended', handleEnded);

    // Auto-skip after 10 seconds if video is still playing
    const timeout = setTimeout(() => {
      if (!video.paused) {
        setIsFading(true);
        setTimeout(() => {
          document.body.style.overflow = '';
          window.scrollTo(0, 0);
          onComplete();
        }, 800);
      }
    }, 10000);

    return () => {
      video.removeEventListener('loadeddata', handleLoaded);
      video.removeEventListener('ended', handleEnded);
      clearTimeout(timeout);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black pointer-events-none"
      style={{
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: videoLoaded ? 'scale(1)' : 'scale(1.05)',
          transition: 'transform 3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <video
          ref={videoRef}
          src="/videos/splash.mp4"
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}

/* ─── Main App ─── */
function App() {
  const [splashDone, setSplashDone] = useState(false);
  const progress = useScrollProgress();
  useReveal();

  return (
    <>
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
      <div className="bg-black text-white min-h-screen relative">
          <style>{`
            @keyframes testiScroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        <CustomCursor />
        <div
          className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-red to-red-light z-[1000] transition-all duration-100"
          style={{ width: progress + '%' }}
        />
        <Navbar />
        <Hero />
        <Marquee />
        <Destinations />
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mx-4 md:mx-8 lg:mx-12" />
        <Services />
        <About />
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mx-4 md:mx-8 lg:mx-12" />
        <Packages />
        <Testimonials />
        <OurFleet />
        <Contact />
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
}

export default App;