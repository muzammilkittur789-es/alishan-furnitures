import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useShowroom } from '../../context/ShowroomContext';

export interface HeroSlide {
  id: string;
  category: string;
  categoryQuery: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  offerBadge: string;
  ctaText: string;
  image: string;
  fallbackImage: string;
  alt: string;
  bgPosition: string;
}

export const HeroOfferSlideshow: React.FC = () => {
  const { recordEvent } = useShowroom();
  const navigate = useNavigate();

  // 4 Promotional Slides following the exact uploaded reference style
  const slides: HeroSlide[] = [
    {
      id: 'slide-sofa',
      category: 'Sofas & Seating',
      categoryQuery: 'Sofas & Seating',
      titleLine1: 'Crafted Comfort.',
      titleLine2: 'Timeless Style.',
      subtitle: 'Discover furniture that fits your life. 25% off today.',
      offerBadge: '25% OFF TODAY',
      ctaText: 'Explore Now',
      image: '/hero-slide-sofa.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      alt: 'Teal Modern Armchair in minimal interior',
      bgPosition: 'right 20% center',
    },
    {
      id: 'slide-bed',
      category: 'Beds & Bedroom Furniture',
      categoryQuery: 'Beds & Bedroom Furniture',
      titleLine1: 'Restful Sanctuary.',
      titleLine2: 'Heirloom Timber.',
      subtitle: 'Solid seasoned timber beds with storage. Save up to ₹12,000.',
      offerBadge: 'SAVE UP TO ₹12,000',
      ctaText: 'Explore Now',
      image: '/hero-slide-bed.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      alt: 'Minimalist Solid Wood Platform Bed in serene bedroom',
      bgPosition: 'right 20% center',
    },
    {
      id: 'slide-dining',
      category: 'Dining Tables & Chairs',
      categoryQuery: 'Dining Tables & Chairs',
      titleLine1: 'Artisan Dining.',
      titleLine2: 'Built to Gather.',
      subtitle: 'Solid teak family tables & sculpted chairs. Flat 20% off.',
      offerBadge: 'FLAT 20% OFF',
      ctaText: 'Explore Now',
      image: '/hero-slide-dining.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
      alt: 'Solid Teak Dining Ensemble in warm interior',
      bgPosition: 'right 20% center',
    },
    {
      id: 'slide-wardrobe',
      category: 'Wardrobes & Storage',
      categoryQuery: 'Wardrobes & Storage',
      titleLine1: 'Space Perfected.',
      titleLine2: 'Modern Closets.',
      subtitle: 'Precision sliding tracks & organizers. 18% off custom closets.',
      offerBadge: '18% OFF STORAGE',
      ctaText: 'Explore Now',
      image: '/hero-slide-wardrobe.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
      alt: 'Modern Full-Height Wooden Wardrobe in architectural space',
      bgPosition: 'right 20% center',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  // Check prefers-reduced-motion accessibility
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Auto-advance slides every 3 seconds
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion, slides.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleCtaClick = (slide: HeroSlide, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    recordEvent('category_filter', {
      category: slide.category,
      metadata: { context: 'reference_hero_cta', offer: slide.offerBadge },
    });
    navigate(`/catalogue?category=${encodeURIComponent(slide.categoryQuery)}`);
  };

  // Touch Swipe gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  const currentSlide = slides[currentIndex];
  const activeImage = imageErrorMap[currentSlide.id] ? currentSlide.fallbackImage : currentSlide.image;

  return (
    <div
      className="relative w-full select-none font-sans"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Hidden preloader for fallback handling */}
      <img
        src={currentSlide.image}
        alt=""
        className="hidden"
        onError={() => setImageErrorMap((prev) => ({ ...prev, [currentSlide.id]: true }))}
      />

      {/* Main Promotional Card (Exact match to reference: rounded-3xl, left text, right furniture, white Explore Now pill, bottom white dock) */}
      <div
        onClick={() => handleCtaClick(currentSlide)}
        className="relative w-full rounded-3xl overflow-hidden shadow-lg border border-sand-200/40 cursor-pointer min-h-[200px] xs:min-h-[215px] sm:min-h-[270px] md:min-h-[330px] lg:min-h-[370px] flex items-center bg-[#466665] transition-all duration-500 ease-out"
      >
        {/* Background Image of the Room with Furniture */}
        <div
          key={currentSlide.id}
          className="absolute inset-0 bg-cover bg-no-repeat transition-all duration-700 ease-out animate-in fade-in"
          style={{
            backgroundImage: `url(${activeImage})`,
            backgroundPosition: currentSlide.bgPosition,
          }}
        />

        {/* Soft Left Gradient Overlay for Text Contrast */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/55 via-black/30 via-48% to-transparent sm:from-black/45 sm:via-black/15" />

        {/* Card Content Layout */}
        <div className="relative z-10 w-full h-full flex items-center p-5 xs:p-6 sm:p-10 md:p-12 lg:p-14">
          <div className="w-[60%] xs:w-[58%] sm:w-[52%] md:w-[48%] space-y-2 xs:space-y-2.5 sm:space-y-3.5">
            {/* 2-Line Bold Headline */}
            <h2 className="font-sans font-bold text-[17px] xs:text-[19px] sm:text-2xl md:text-3xl lg:text-4xl text-white leading-[1.18] tracking-tight drop-shadow-sm">
              <span>{currentSlide.titleLine1}</span>
              <span className="block">{currentSlide.titleLine2}</span>
            </h2>

            {/* Subtitle with product offer highlight */}
            <p className="text-[11px] xs:text-xs sm:text-sm md:text-base text-white/90 font-sans leading-relaxed drop-shadow-xs max-w-sm">
              {currentSlide.subtitle}
            </p>

            {/* Crisp White Pill Button (Explore Now →) with Futuristic Glow */}
            <div className="pt-1 xs:pt-1.5 sm:pt-2">
              <Link
                to={`/catalogue?category=${encodeURIComponent(currentSlide.categoryQuery)}`}
                onClick={(e) => handleCtaClick(currentSlide, e)}
                className="inline-flex items-center gap-1.5 xs:gap-2 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-xs xs:text-xs sm:text-sm px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-full shadow-md hover:shadow-[0_0_22px_rgba(255,255,255,0.7)] transition-all active:scale-95 duration-200 group cursor-pointer"
              >
                <span>{currentSlide.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* White Semi-Pill Dock Recessed into the Bottom Center (Matching Reference Image) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white rounded-t-xl px-3.5 xs:px-4 py-1.5 flex items-center gap-1.5 shadow-sm z-20">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentIndex === idx
                  ? 'w-2 h-2 bg-[#1b3635]'
                  : 'w-1.5 h-1.5 bg-[#d0dcda] hover:bg-[#a9bebc]'
              }`}
              aria-label={`Go to slide ${idx + 1}: ${s.category}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
