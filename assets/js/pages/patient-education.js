/**
 * Patient Education Interactions
 * 1. GSAP Layout Animations (Staggered Entry)
 * 2. Accordion Logic (Accessible)
 */

document.addEventListener('DOMContentLoaded', () => {

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 1. ENTRY ANIMATIONS ---
    const runAnimations = () => {
        // If GSAP is available and user hasn't requested reduced motion
        if (window.gsap && !prefersReducedMotion) {

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // Animate Hero Text
            const heroTitle = document.querySelector('.edu-title');
            const heroSub = document.querySelector('.edu-subtitle');

            if (heroTitle) tl.from(heroTitle, { y: 30, opacity: 0, duration: 0.8 });
            if (heroSub) tl.from(heroSub, { y: 20, opacity: 0, duration: 0.6 }, '-=0.5');

            // Animate Grid Cards (Staggered)
            const cards = document.querySelectorAll('.topic-card');
            if (cards.length > 0) {
                tl.from(cards, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    clearProps: 'all' // Ensure hover effects work cleanest after animation
                }, '-=0.3');
            }

            // Animate Article Content (if on article page)
            const article = document.querySelector('.edu-article-body');
            if (article) {
                tl.from(article, { y: 20, opacity: 0, duration: 0.8 }, '-=0.4');
            }
        }
    };

    // Run animations
    runAnimations();

    // --- 2. ACCORDION LOGIC ---
    const faqHeaders = document.querySelectorAll('.faq-header');

    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            const body = header.nextElementSibling;

            // Toggle current
            header.setAttribute('aria-expanded', !isExpanded);

            if (!isExpanded) {
                body.style.maxHeight = body.scrollHeight + 'px';
            } else {
                body.style.maxHeight = null;
            }
        });
    });

});
