/**
 * Gallery Page Logic
 * Handles filtering, animations (GSAP), and lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
    
    const items = document.querySelectorAll('.gallery-item');
    const filters = document.querySelectorAll('.filter-btn');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    let visibleItems = Array.from(items); // Start with all items
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ==========================================
    // 1. INITIAL ANIMATION
    // ==========================================
    const initAnimation = () => {
        if (!prefersReducedMotion && window.gsap) {
            gsap.to(items, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        } else {
            // Fallback for no GSAP or reduced motion
            items.forEach(item => {
                item.style.opacity = 1;
                item.style.transform = 'translateY(0)';
            });
        }
    };

    initAnimation();

    // ==========================================
    // 2. FILTERING LOGIC
    // ==========================================
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            // Determine matches
            const matches = [];
            const nonMatches = [];
            
            items.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    matches.push(item);
                } else {
                    nonMatches.push(item);
                }
            });
            
            // Update visible items list for lightbox navigation
            visibleItems = matches;
            
            // Animation for filtering
            if (!prefersReducedMotion && window.gsap) {
                // 1. Fade out non-matches
                if (nonMatches.length > 0) {
                    gsap.to(nonMatches, {
                        scale: 0.8,
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.in',
                        onComplete: () => {
                            nonMatches.forEach(item => item.style.display = 'none');
                        }
                    });
                } else {
                    // If no non-matches (e.g. 'all' selected), ensure everything is reset if hidden
                     nonMatches.forEach(item => item.style.display = 'none');
                }

                // 2. Fade in matches (with slight delay to allow layout to reflow if needed)
                // In a simple grid, hiding elements reflows immediately. 
                // We use a small timeout or just animate freely.
                
                // Ensure matches are display block before animating in
                matches.forEach(item => {
                    item.style.display = 'block';
                });

                gsap.fromTo(matches, 
                    { scale: 0.9, opacity: 0 },
                    { 
                        scale: 1, 
                        opacity: 1, 
                        duration: 0.4, 
                        delay: 0.1, // Wait slightly for others to hide
                        stagger: 0.05, 
                        ease: 'back.out(1.2)' 
                    }
                );
            } else {
                // Simple toggle without animation
                nonMatches.forEach(item => item.style.display = 'none');
                matches.forEach(item => item.style.display = 'block');
            }
        });
    });

    // ==========================================
    // 3. LIGHTBOX LOGIC
    // ==========================================
    const openLightbox = (index) => {
        if (visibleItems.length === 0) return;

        // Wrap around logic
        if (index < 0) index = visibleItems.length - 1;
        if (index >= visibleItems.length) index = 0;
        
        currentIndex = index;
        const item = visibleItems[index]; // Use visibleItems to respect current filter
        const img = item.querySelector('img');
        const overlaySpan = item.querySelector('.gallery-overlay span');
        const category = item.querySelector('.gallery-category');
        
        let captionText = "Gallery Image";
        if (overlaySpan) captionText = overlaySpan.textContent;
        // Optionally append category
        if (category) captionText += ` (${category.textContent})`;

        // Set content
        lightboxImg.src = img.src; // In a real app, use a data-highres attribute
        lightboxCaption.textContent = captionText;
        
        // Show
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Card Click
    items.forEach(item => {
        item.addEventListener('click', (e) => {
            // Find the index of this item *within the currently visible items*
            const index = visibleItems.indexOf(item);
            if (index !== -1) {
                openLightbox(index);
            }
        });
    });

    // Controls
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(currentIndex - 1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(currentIndex + 1);
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
        if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
    });

});
