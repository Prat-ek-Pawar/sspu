/**
 * Gallery Page Logic
 * Handles filtering, animations (GSAP), and lightbox
 */

const initializeGallery = () => {
    const items = document.querySelectorAll('.gallery-item');
    const filters = document.querySelectorAll('.filter-btn');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    // If no items are found, wait for them
    if (items.length === 0) return;

    let currentIndex = 0;
    let visibleItems = Array.from(items);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Animation
    const initAnimation = () => {
        if (!prefersReducedMotion && window.gsap) {
            gsap.fromTo(items,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power2.out' }
            );
        } else {
            items.forEach(item => {
                item.style.opacity = 1;
                item.style.transform = 'translateY(0)';
            });
        }
    };
    initAnimation();

    // 2. Filtering
    filters.forEach(btn => {
        // Clone and replace to remove old listeners if re-initializing
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            newBtn.classList.add('active');
            const filterValue = newBtn.getAttribute('data-filter');

            const matches = [];
            const nonMatches = [];
            items.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    matches.push(item);
                } else {
                    nonMatches.push(item);
                }
            });
            visibleItems = matches;

            if (!prefersReducedMotion && window.gsap) {
                gsap.to(nonMatches, { scale: 0.8, opacity: 0, duration: 0.3, onComplete: () => nonMatches.forEach(i => i.style.display = 'none') });
                matches.forEach(i => i.style.display = 'block');
                gsap.fromTo(matches, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, delay: 0.1, stagger: 0.05, ease: 'back.out' });
            } else {
                nonMatches.forEach(i => i.style.display = 'none');
                matches.forEach(i => i.style.display = 'block');
            }
        });
    });

    // 3. Lightbox
    const openLightbox = (index) => {
        if (index < 0) index = visibleItems.length - 1;
        if (index >= visibleItems.length) index = 0;
        currentIndex = index;
        const item = visibleItems[index];
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption');
        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption ? caption.textContent : "Gallery Image";
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    items.forEach(item => {
        item.addEventListener('click', () => {
            const index = visibleItems.indexOf(item);
            if (index !== -1) openLightbox(index);
        });
    });

    closeBtn.onclick = closeLightbox;
    lightbox.onclick = (e) => { if (e.target === lightbox) closeLightbox(); };
    prevBtn.onclick = (e) => { e.stopPropagation(); openLightbox(currentIndex - 1); };
    nextBtn.onclick = (e) => { e.stopPropagation(); openLightbox(currentIndex + 1); };

    document.onkeydown = (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
        if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
    };
};

window.initializeGallery = initializeGallery;

document.addEventListener('DOMContentLoaded', () => {
    // If items already exist (static), init immediately
    if (document.querySelectorAll('.gallery-item').length > 0) {
        initializeGallery();
    }
});

// Listen for dynamic population event
document.addEventListener('galleryPopulated', () => {
    initializeGallery();
});
