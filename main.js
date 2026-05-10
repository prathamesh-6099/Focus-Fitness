// Check for reduced motion
const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Initialize Lucide Icons
lucide.createIcons();

// Initialize AOS Scroll Reveal
AOS.init({
  duration: 800,
  once: true,
  offset: 100,
  disable: isReducedMotion
});

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Scroll Progress Indicator
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  if (scrollProgress) {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = `${scrollPercent}%`;
  }
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuIcon = mobileMenuBtn.querySelector('i');

mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  
  if (mobileMenu.classList.contains('active')) {
    mobileMenuIcon.setAttribute('data-lucide', 'x');
  } else {
    mobileMenuIcon.setAttribute('data-lucide', 'menu');
  }
  lucide.createIcons();
});

// Close mobile menu when clicking a link
const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-btn');
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    mobileMenuIcon.setAttribute('data-lucide', 'menu');
    lucide.createIcons();
  });
});

// GSAP Animations
window.addEventListener('load', () => {
  if (isReducedMotion) return;

  // Hero Animation
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  tl.fromTo('.hero-eyebrow', 
    { y: 30, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.7 }, 
    0.2
  )
  .fromTo('.hero-headline', 
    { y: 30, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.7 }, 
    0.4
  )
  .fromTo('.hero-subtext', 
    { y: 30, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.7 }, 
    0.6
  )
  .fromTo('.hero-buttons', 
    { y: 30, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.7 }, 
    0.8
  );

  // Parallax Hero Content
  gsap.to('.hero-content', {
    yPercent: 30,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  // Parallax Hero Orb
  gsap.to('.hero-bg-orb', {
    yPercent: -15,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  // Section Titles Animation
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach(header => {
    const eyebrow = header.querySelector('.eyebrow');
    const title = header.querySelector('.section-title');
    const accent = header.querySelector('.accent-line');

    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: "top 85%"
      }
    });

    if (eyebrow) headerTl.fromTo(eyebrow, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0);
    if (title) headerTl.fromTo(title, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.15);
    if (accent) headerTl.fromTo(accent, { width: 0, opacity: 0 }, { width: 40, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.3);
  });

  // Service Cards Stagger
  const serviceGrid = document.querySelector('.services-grid');
  if (serviceGrid) {
    gsap.fromTo('.service-card', 
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: serviceGrid,
          start: "top 85%"
        }
      }
    );
  }
});

// Stats Counter Animation using IntersectionObserver
const statsSection = document.querySelector('.stats-strip');
const statNumbers = document.querySelectorAll('.stat-number');
let animated = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !animated) {
      animated = true;
      statNumbers.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        const duration = 1500; // 1.5s
        const frameRate = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;
        
        const counter = setInterval(() => {
          frame++;
          // easeOutQuad formula for smoother animation
          const progress = frame / totalFrames;
          const currentCount = Math.round(target * progress * (2 - progress));
          
          stat.textContent = currentCount;
          
          if (frame === totalFrames) {
            clearInterval(counter);
            stat.textContent = target;
          }
        }, frameRate);
      });
    }
  });
}, { threshold: 0.5 });

if (statsSection) {
  statsObserver.observe(statsSection);
}

// Pricing Cards GSAP Hover Effect
if (!isReducedMotion) {
  const pricingCards = document.querySelectorAll('.pricing-card');
  pricingCards.forEach(card => {
    // Store the default scale so we don't mess up the featured card's 1.03 scale
    const isFeatured = card.classList.contains('pricing-card-featured');
    const baseScale = window.innerWidth >= 768 && isFeatured ? 1.03 : 1;

    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -8,
        scale: baseScale,
        boxShadow: "0 16px 40px rgba(255,92,0,0.2)",
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto"
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        scale: baseScale,
        boxShadow: "none",
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto"
      });
    });
  });
}

// Initialize Swiper for Trainers Section
const trainersSwiper = new Swiper('.trainers-swiper', {
  slidesPerView: 1.15,
  spaceBetween: 16,
  centeredSlides: true,
  loop: true,
  breakpoints: {
    768: {
      slidesPerView: 3,
      spaceBetween: 24,
      allowTouchMove: false,
      centeredSlides: false,
      loop: false
    }
  }
});

// Initialize Swiper for Testimonials Section
const testimonialsSwiper = new Swiper('.testimonials-swiper', {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    }
  }
});
