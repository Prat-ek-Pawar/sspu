// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. HERO SECTION ANIMATIONS
// ==========================================
const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });

// Staggered Text Reveal
heroTimeline
    .from(".hero-content h1", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        delay: 0.2
    })
    .from(".hero-text", {
        y: 50,
        opacity: 0,
        duration: 1
    }, "-=1")
    .from(".hero-content .btn, .hero-content h3, .hero-content span", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1
    }, "-=0.8")
    .from(".hero-img-wrapper", {
        x: 100,
        opacity: 0,
        duration: 1.5,
        rotation: 10
    }, "-=1.5");

// Floating Hero Image
gsap.to(".hero-img-wrapper", {
    y: -20,
    rotation: 3,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});

// ==========================================
// 2. GOVERNING COUNCIL (Staggered Cards)
// ==========================================
gsap.from(".council-header", {
    scrollTrigger: {
        trigger: ".council-section",
        start: "top 80%",
        toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 1
});

gsap.from(".council-card", {
    scrollTrigger: {
        trigger: ".council-grid",
        start: "top 85%",
        toggleActions: "play none none reverse"
    },
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "back.out(1.7)"
});

// ==========================================
// 3. GALLERY SECTION (Mosaic Reveal)
// ==========================================
gsap.from(".section-title-box", {
    scrollTrigger: {
        trigger: ".gallery-section",
        start: "top 80%"
    },
    scale: 0.9,
    opacity: 0,
    duration: 1
});

gsap.from(".gallery-item", {
    scrollTrigger: {
        trigger: ".gallery-mosaic",
        start: "top 85%"
    },
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out"
});

// ==========================================
// 4. FOOTER & MISC
// ==========================================
gsap.from("footer .footer-container > div", {
    scrollTrigger: {
        trigger: "footer",
        start: "top 90%"
    },
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.2
});

// Navbar smooth appearance
gsap.from("header", {
    y: -100,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "power2.out"
});
