/**
 * ============================================================================
 * STARRY BACKGROUND ANIMATION
 * ============================================================================
 */
const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];

// Configuration
const numStars = 200; // adjust for density
const starSpeed = 0.5; // adjust for speed

// Resize scale to handle window changes
function initCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initStars();
}

// Generate random stars
function initStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5,
            alpha: Math.random(),
            speed: (Math.random() * starSpeed) + 0.1
        });
    }
}

// Mouse interaction for constellations & custom cursor
let mouse = {
    x: null,
    y: null
};

const customCursor = document.getElementById('customCursor');

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    if (customCursor) {
        customCursor.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
    }
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
    if (customCursor) customCursor.style.opacity = '0';
});

window.addEventListener('mouseover', () => {
    if (customCursor) customCursor.style.opacity = '1';
});

// Interactive elements hover state for custom cursor
document.querySelectorAll('a, button, .planet-card, .mission-card, .badge-card, input, textarea, .social-icon').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (customCursor) customCursor.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
        if (customCursor) customCursor.classList.remove('hovering');
    });
});

// Animate frame by frame
function animateStars() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach((star, index) => {
        // Move star slower or faster down
        star.y -= star.speed;

        // Reset to bottom if it goes over top
        if (star.y < 0) {
            star.y = height;
            star.x = Math.random() * width;
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();

        // Connect stars (Constellation effect)
        for (let j = index + 1; j < stars.length; j++) {
            let dx = star.x - stars[j].x;
            let dy = star.y - stars[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 70) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 - distance/700})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(stars[j].x, stars[j].y);
                ctx.stroke();
            }
        }

        // Connect to mouse
        if (mouse.x && mouse.y) {
            let dx = star.x - mouse.x;
            let dy = star.y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 - distance/300})`; // Accent blue glow
                ctx.lineWidth = 1;
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animateStars);
}

// Listeners
window.addEventListener('resize', initCanvas);
initCanvas();
animateStars();

/**
 * ============================================================================
 * UI INTERACTIONS & NAVIGATION
 * ============================================================================
 */

// Sticky Navbar Background
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Toggle icon (bars to x)
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

/**
 * ============================================================================
 * SCROLL ANIMATIONS (Intersection Observer)
 * ============================================================================
 */
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // trigger when 10% is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Stop observing once animated if we want it to happen only once
            // observer.unobserve(entry.target);
        } else {
            // Optional: remove class to re-animate on scroll up
            // entry.target.classList.remove('is-visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-section').forEach(section => {
    observer.observe(section);
});

// Handle form submission to prevent page reload
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = 'Transmission Sent <i class="fas fa-check"></i>';
        btn.style.background = 'linear-gradient(135deg, var(--glow-green), #047857)';
        
        this.reset();
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = ''; // reset to default css
        }, 3000);
    });
}

/**
 * ============================================================================
 * TYPEWRITER EFFECT
 * ============================================================================
 */
const phrases = ["Software Developer", "AI Enthusiast", "Problem Solver"];
let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typewriterElement = document.getElementById('typewriter');

function type() {
    if (!typewriterElement) return;

    const currentPhrase = phrases[currentPhraseIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
        currentCharIndex--;
    } else {
        typewriterElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
        currentCharIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && currentCharIndex === currentPhrase.length) {
        typeSpeed = 2000; // Pause at end of phrase
        isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        typeSpeed = 500; // Pause before typing new phrase
    }

    setTimeout(type, typeSpeed);
}

// Start typewriter effect
setTimeout(type, 1000);

/**
 * ============================================================================
 * BACK TO TOP BUTTON
 * ============================================================================
 */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

/**
 * ============================================================================
 * 3D TILT EFFECT ON CARDS
 * ============================================================================
 */
const cards = document.querySelectorAll('.planet-card, .mission-card, .badge-card');

cards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'none';
        card.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease';
        card.style.zIndex = '1';
    });
});
