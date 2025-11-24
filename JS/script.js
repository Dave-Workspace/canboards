document.addEventListener('DOMContentLoaded', function () {
    console.log('Responsive Website Loaded');

    // Generic typing animation helper for a target element and text
    function startTyping(el, fullText, charDelay = 90, loopDelay = 1800) {
        if (!el) return;
        let i = 0;
        function typeChar() {
            if (i < fullText.length) {
                el.textContent += fullText[i];
                i++;
                setTimeout(typeChar, charDelay);
            } else {
                setTimeout(() => {
                    // Keep line height by inserting a non-breaking space before restart
                    el.textContent = '\u00A0';
                    setTimeout(() => {
                        i = 0;
                        el.textContent = '';
                        typeChar();
                    }, 120);
                }, loopDelay);
            }
        }
        // start typing loop
        el.textContent = '';
        typeChar();
    }

    // Animate headings used across pages
    startTyping(document.getElementById('immigration-anim'), 'Canadian Immigration', 90, 1800);
    startTyping(document.getElementById('work-anim'), 'Work Services', 90, 1800);
    startTyping(document.getElementById('visit-anim'), 'Visit Services', 90, 1800);
    startTyping(document.getElementById('settle-services-anim'), 'Settle Services', 90, 1800);
    startTyping(document.getElementById('additional-anim'), 'Additional Services', 90, 1800);
    startTyping(document.getElementById('study-anim'), 'Study Services', 90, 1800);
    startTyping(document.getElementById('card-anim'), 'Pay only if your visa is approved....', 90, 1800);

    // Subtle cursor-direction-following motion for hero image boxes (index hero tiles) + Work hero floater
    (function initHeroParallax() {
        const items = [
            { el: document.querySelector('.hero-img-box-1'), amp: 12 },
            { el: document.querySelector('.hero-img-box-2'), amp: 10 },
            { el: document.querySelector('.hero-img-box-3'), amp: 11 },
            { el: document.querySelector('.hero-img-box-4'), amp: 9 },
            // Work page hero image: FURTHER REDUCED amp from 6 to 3 for minimal movement
            { el: document.querySelector('.work-hero-floater'), amp: 3, pre: 'translate(-50%, -50%)' }
        ].filter(x => !!x.el);

        if (!items.length) return;

        items.forEach(it => {
            it.pos = { x: 0, y: 0 }; // current offset
            it.vel = { x: 0, y: 0 }; // velocity influenced by pointer movement
            // Preserve any existing computed transform (e.g. translateY used in specific pages)
            if (!it.pre) {
                try {
                    const computed = window.getComputedStyle(it.el).transform;
                    it.pre = (computed && computed !== 'none') ? computed + ' ' : '';
                } catch (e) {
                    it.pre = '';
                }
            }
            it.el.style.willChange = 'transform';
        });

        const onMove = (e) => {
            const dx = (e.movementX || 0);
            const dy = (e.movementY || 0);
            items.forEach((it, idx) => {
                // FURTHER REDUCED baseGain from 0.08 to 0.04 for much slower response
                const baseGain = 0.04; // baseline sensitivity (was 0.08)
                const gain = Math.max(0.01, baseGain - idx * 0.005); // vary very slightly (was 0.03 and 0.01)
                it.vel.x += dx * gain;
                it.vel.y += dy * gain;
            });
        };

        window.addEventListener('mousemove', onMove, { passive: true });

        function frame() {
            items.forEach(it => {
                // FURTHER INCREASED friction from 0.95 to 0.97 for much slower, smoother movement
                it.vel.x *= 0.97; // friction (was 0.95)
                it.vel.y *= 0.97;
                // FURTHER REDUCED integration from 0.03 to 0.015 for even slower tracking
                it.pos.x += it.vel.x * 0.015; // integrate (was 0.03)
                it.pos.y += it.vel.y * 0.015;
                // clamp to amplitude
                it.pos.x = Math.max(-it.amp, Math.min(it.amp, it.pos.x));
                it.pos.y = Math.max(-it.amp, Math.min(it.amp, it.pos.y));
                const base = it.pre || '';
                // Append parallax translate to the preserved base transform so we don't wipe out CSS positioning
                it.el.style.transform = `${base}translate(${it.pos.x}px, ${it.pos.y}px)`;
            });
            requestAnimationFrame(frame);
        }
        frame();
    })();

    // Flip card behavior for why-copy-flip (scoped)
    (function () {
        const flipContainers = document.querySelectorAll('.why-copy-flip .flip-container');
        if (!flipContainers || !flipContainers.length) return;

        // Hover behavior for desktop: only one active at a time
        flipContainers.forEach(container => {
            container.addEventListener('mouseenter', () => {
                flipContainers.forEach(c => c.classList.remove('active'));
                container.classList.add('active');
            });
            container.addEventListener('mouseleave', () => {
                container.classList.remove('active');
            });
        });

        // Click/tap behavior for mobile: toggle active but keep only one
        flipContainers.forEach(container => {
            container.addEventListener('click', (e) => {
                e.stopPropagation();
                const already = container.classList.contains('active');
                flipContainers.forEach(c => c.classList.remove('active'));
                if (!already) container.classList.add('active');
            });
        });

        // Click outside closes all
        document.addEventListener('click', (e) => {
            if (![...flipContainers].some(c => c.contains(e.target))) {
                flipContainers.forEach(c => c.classList.remove('active'));
            }
        });
    })();

    // Navbar transparency toggle at top of page
    (function () {
        const header = document.querySelector('.sticky-header');
        if (!header) return;
        const apply = () => {
            if (window.scrollY <= 0) {
                header.classList.add('top-of-page');
                header.classList.remove('scrolled');
            } else {
                header.classList.remove('top-of-page');
                header.classList.add('scrolled');
            }
        };
        window.addEventListener('scroll', apply, { passive: true });
        window.addEventListener('load', apply);
        apply();
    })();

    // Animated floating sprites for the celebrate section - CONFINED MOVEMENT
    (function () {
        const sprites = document.querySelectorAll('.celebrate-sprite');
        if (!sprites || !sprites.length) return;

        // Set initial positions and create animation data for each sprite
        sprites.forEach(sprite => {
            // Get initial position from CSS (already set in stylesheet)
            const computedStyle = window.getComputedStyle(sprite);

            // Create animation data with confined movement
            sprite.animationData = {
                // Start at center of confined area (0,0 offset from CSS position)
                xPos: 0,
                yPos: 0,
                // Slower, gentler speeds for subtle movement
                xSpeed: (Math.random() - 0.5) * 0.3,
                ySpeed: (Math.random() - 0.5) * 0.3,
                // Rotation parameters
                rotation: Math.random() * 360, // Random starting rotation
                rotationSpeed: (Math.random() - 0.5) * 0.5, // Slow rotation speed
                // Wave motion parameters
                sinOffset: Math.random() * Math.PI * 2,
                amplitude: 3 + Math.random() * 7, // Smaller amplitude for confined movement
                frequency: 0.0008 + Math.random() * 0.0015, // Slower frequency
                // Boundaries - confine to small area (adjust these values to change confined area size)
                maxX: 30, // Maximum 30px left/right from initial position
                maxY: 30  // Maximum 30px up/down from initial position
            };
        });

        // Animation loop
        function animateSprites(timestamp) {
            sprites.forEach(sprite => {
                const data = sprite.animationData;

                // Update position with speed
                data.xPos += data.xSpeed;
                data.yPos += data.ySpeed;

                // Boundary checking - bounce back if hitting limits
                if (Math.abs(data.xPos) > data.maxX) {
                    data.xSpeed *= -1; // Reverse direction
                    data.xPos = Math.sign(data.xPos) * data.maxX; // Clamp to boundary
                }
                if (Math.abs(data.yPos) > data.maxY) {
                    data.ySpeed *= -1; // Reverse direction
                    data.yPos = Math.sign(data.yPos) * data.maxY; // Clamp to boundary
                }

                // Add gentle sin wave motion for organic feel
                const sinWaveX = Math.sin(timestamp * data.frequency + data.sinOffset) * data.amplitude;
                const sinWaveY = Math.cos(timestamp * data.frequency + data.sinOffset * 1.3) * data.amplitude;

                // Update rotation
                data.rotation += data.rotationSpeed;

                // Apply transform with confined position, wave motion, and rotation
                sprite.style.transform = `translate(${data.xPos + sinWaveX}px, ${data.yPos + sinWaveY}px) rotate(${data.rotation}deg)`;
            });

            // Continue animation
            requestAnimationFrame(animateSprites);
        }

        // Start animation
        requestAnimationFrame(animateSprites);
    })();

    // Settle page: Headline animation (letters + gradient arc)
    (function () {
        const container = document.getElementById('settle-anim-text');
        const path = document.querySelector('#settle-anim .arc-underline path');
        if (!container || !path) return;

        const text = 'Settle in Canada';
        // Animation timing parameters (in seconds)
        const delayPerLetter = 0.05;
        const animationDuration = 0.6;
        const pauseAfterAnimation = 1;

        const pathLength = 590;
        const steps = text.length;

        const totalTextTime = delayPerLetter * (steps - 1) + animationDuration;
        const halfIndex = Math.floor(steps / 2) - 1;
        const arcStartDelay = delayPerLetter * halfIndex + animationDuration;
        const arcDuration = totalTextTime - arcStartDelay;

        function createText() {
            container.innerHTML = '';
            text.split('').forEach((char, i) => {
                const span = document.createElement('span');
                span.classList.add('letter');
                if (char === ' ') {
                    span.innerHTML = '&nbsp;';
                } else {
                    span.textContent = char;
                }
                span.style.animationDelay = `${i * delayPerLetter}s`;
                container.appendChild(span);
            });
        }

        function animateArc() {
            path.style.strokeDashoffset = pathLength;
            setTimeout(() => {
                let startTime = null;
                function animate(time) {
                    if (!startTime) startTime = time;
                    const elapsed = (time - startTime) / 1000; // seconds
                    if (elapsed < arcDuration) {
                        const progress = elapsed / arcDuration;
                        path.style.strokeDashoffset = pathLength * (1 - progress);
                        requestAnimationFrame(animate);
                    } else {
                        path.style.strokeDashoffset = 0;
                    }
                }
                requestAnimationFrame(animate);
            }, arcStartDelay * 1000);
        }

        function startAnimation() {
            createText();
            animateArc();
        }

        function getTotalAnimationTimeMs() {
            return (totalTextTime + pauseAfterAnimation) * 1000;
        }

        startAnimation();
        setInterval(startAnimation, getTotalAnimationTimeMs());
    })();

    // Index page: Map icons animation - reveal icons with stagger when map-wrap scrolls into view
    (function () {
        const wraps = document.querySelectorAll('.map-wrap');
        if (!wraps || !wraps.length) return;

        wraps.forEach((wrap) => {
            const icons = wrap.querySelectorAll('.map-icon');

            const io = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        wrap.classList.add('in-view');
                        icons.forEach((icon, i) => {
                            const delay = parseInt(icon.dataset.delay || (i * 100), 10);
                            setTimeout(() => {
                                icon.classList.add('visible');
                            }, delay);
                        });
                        observer.unobserve(wrap);
                    }
                });
            }, { threshold: 0.3 });

            io.observe(wrap);
        });
    })();

    // Index page: Stats counters animation - animate from 0 to target when the panel scrolls into view
    (function () {
        const panel = document.querySelector('.stats-panel');
        if (!panel) return;

        const animateCount = (el, target, suffix, duration) => {
            let start = 0;
            const startTime = performance.now();
            const isInteger = Number.isInteger(target);

            const step = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const value = Math.floor(progress * target);
                el.textContent = (isInteger ? value : value.toFixed(0)) + (suffix || '');
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target + (suffix || '');
                }
            };

            requestAnimationFrame(step);
        };

        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const nums = panel.querySelectorAll('.stat-number');
                    nums.forEach(n => {
                        const target = parseInt(n.dataset.target || '0', 10);
                        const suffix = n.dataset.suffix || '';
                        animateCount(n, target, suffix, 1500);
                    });
                    observer.unobserve(panel);
                }
            });
        }, { threshold: 0.25 });

        io.observe(panel);
    })();

    // Contact page: Form validation
    (function () {
        'use strict';
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (form.checkValidity()) {
                // Form is valid - you can add your submission logic here
                alert('Thank you for contacting us! We will get back to you soon.');
                form.reset();
                form.classList.remove('was-validated');
            } else {
                form.classList.add('was-validated');
            }
        }, false);
    })();

    // Contact page: Animate contact form image when section is in view
    (function () {
        const formImage = document.querySelector('.contact-form-image');
        const formSection = document.querySelector('.contact-form-section');

        if (!formImage || !formSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    formImage.classList.add('animate');
                    observer.unobserve(formSection); // Only animate once
                }
            });
        }, {
            threshold: 0.3 // Trigger when 30% of the section is visible
        });

        observer.observe(formSection);
    })();

    // Our Story page: History image switching on accordion click and accent handling
    (function () {
        const historyImage = document.getElementById('historyImage');
        const accordionButtons = document.querySelectorAll('.history-accordion .accordion-button');

        if (!accordionButtons || !accordionButtons.length) return;

        accordionButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                const newImage = this.getAttribute('data-image');
                if (newImage && historyImage) {
                    historyImage.src = newImage;
                }

                // Prevent closing if this item is already active
                const targetId = this.getAttribute('data-bs-target');
                const targetCollapse = document.querySelector(targetId);
                if (targetCollapse && targetCollapse.classList.contains('show')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            });
        });

        const historyAccordion = document.getElementById('historyAccordion');
        if (!historyAccordion) return;

        // When a collapse starts showing, mark its parent item as active and clear others immediately
        historyAccordion.addEventListener('show.bs.collapse', function (e) {
            const items = historyAccordion.querySelectorAll('.history-item');
            items.forEach(i => i.classList.remove('is-active'));
            const showingCollapse = e.target;
            const item = showingCollapse.closest('.history-item');
            if (item) item.classList.add('is-active');
        });

        // Initialize active class for any panel already open on load
        const initiallyOpen = historyAccordion.querySelector('.accordion-collapse.show');
        if (initiallyOpen) {
            const parent = initiallyOpen.closest('.history-item');
            if (parent) parent.classList.add('is-active');
        }
    })();

});

document.addEventListener('DOMContentLoaded', function () {
    const footerLinks = document.querySelectorAll('#site-footer .footer-link, #site-footer .footer-bottom a');

    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.classList.remove('exit');
        });

        link.addEventListener('mouseleave', function () {
            this.classList.add('exit');
        });
    });
});

const footer = document.getElementById('site-footer');
const footerContent = document.getElementById('footer-content');
const spacer = document.getElementById('footer-spacer');

function updateFooter() {
    const scrollY = window.scrollY;
    const docHeight = document.body.scrollHeight;
    const winHeight = window.innerHeight;

    const distanceFromBottom = docHeight - (scrollY + winHeight);
    const totalHeight = footerContent.scrollHeight;

    // Calculate visible footer height
    let visibleHeight = (totalHeight - distanceFromBottom);
    visibleHeight = Math.max(0, Math.min(visibleHeight, totalHeight));

    footer.style.height = visibleHeight + "px";

    // Dynamically set spacer height to footer's full content height
    spacer.style.height = totalHeight + "px";
}

window.addEventListener('scroll', updateFooter);
window.addEventListener('resize', updateFooter);
window.addEventListener('load', () => {
    footer.style.height = "0px";
    updateFooter();
});