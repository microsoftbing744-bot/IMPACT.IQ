/**
 * ImpactIQ - Main Script
 * Handles all interactions, animations, and responsive behaviors.
 */

document.addEventListener('DOMContentLoaded', () => {
    // === Variables ===
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const stats = document.querySelectorAll('.stat-number');
    const sections = document.querySelectorAll('.section, .hero');
    const contactForm = document.querySelector('.contact-form');

    // === Mobile Menu ===
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('open');

            // Animate hamburger to X
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (mobileMenuBtn.classList.contains('open')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('open');

                // Reset hamburger
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // === Stats Counter Animation ===
    const animateStats = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const frameDuration = 1000 / 60;
                const totalFrames = Math.round(duration / frameDuration);
                const easeOutQuad = t => t * (2 - t);
                let frame = 0;

                const counter = setInterval(() => {
                    frame++;
                    const progress = easeOutQuad(frame / totalFrames);
                    const currentCount = Math.round(countTo * progress);

                    if (parseInt(target.innerHTML) !== currentCount) {
                        target.innerHTML = currentCount;
                    }

                    if (frame === totalFrames) {
                        clearInterval(counter);
                        target.innerHTML = countTo; // Ensure final number is exact
                    }
                }, frameDuration);

                observer.unobserve(target);
            }
        });
    };

    const statsObserver = new IntersectionObserver(animateStats, {
        threshold: 0.5
    });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // === Smooth Scroll ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // === Scroll Animations (Reveal on Scroll) ===
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    // Select elements to animate
    const animatedElements = document.querySelectorAll(
        '.section-header, .feature-card, .service-card, .insight-card, .hero-content > *, .stat-item, .output-card, .principle, .contact-content'
    );

    animatedElements.forEach((el, index) => {
        el.classList.add('reveal');

        // Add staggering if needed (simple heuristic: sequential siblings)
        // This is a basic implementation; for complex grids, manual classes in HTML are often better, 
        // but this automates the effect without touching HTML.
        /* 
        if (el.parentElement.classList.contains('health-grid')) {
             // Logic could go here, but CSS classes are cleaner if manually added.
             // We will rely on natural scroll order for now.
        }
        */

        revealObserver.observe(el);
    });


    // === Contact Form Handling ===
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.disabled = true;

            // Simulate sending
            setTimeout(() => {
                btn.innerText = 'Message Sent!';
                btn.style.backgroundColor = 'var(--color-green)';

                setTimeout(() => {
                    contactForm.reset();
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                }, 3000);
            }, 1500);
        });
    }

    // === Active Navigation Link Highlighting ===
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.querySelectorAll('a').forEach(li => {
            li.style.color = ''; // Reset
            if (current && li.getAttribute('href').includes(current)) {
                li.style.color = 'var(--color-cyan)';
            }
        });
    });
});
