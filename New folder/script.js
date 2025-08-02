// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

// Initialize NEPSE market data
let nepseData = {
    currentIndex: 2100.45,
    change: 12.34,
    percentChange: 0.59,
    volume: 4500000,
    turnover: 2.5, // in billion NPR
    lastUpdated: new Date().toLocaleTimeString()
};

// Update market data in the header
function updateMarketData() {
    const marketDataElement = document.querySelector('.market-data');
    if (marketDataElement) {
        marketDataElement.innerHTML = `
            <span class="market-index">NEPSE: ${nepseData.currentIndex.toFixed(2)}</span>
            <span class="market-change ${nepseData.change >= 0 ? 'positive' : 'negative'}">
                ${nepseData.change >= 0 ? '↑' : '↓'} ${Math.abs(nepseData.change)} (${Math.abs(nepseData.percentChange)}%)
            </span>
            <span class="market-volume">Vol: ${(nepseData.volume / 1000).toFixed(0)}K</span>
            <span class="market-updated">Updated: ${nepseData.lastUpdated}</span>
        `;
    }
}

// Initialize market data
updateMarketData();

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
navItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Sticky Navigation
const nav = document.querySelector('nav');
const header = document.querySelector('.hero');
const navHeight = nav.offsetHeight;

const stickyNav = () => {
    if (window.scrollY > header.offsetHeight - navHeight) {
        nav.classList.add('sticky');
    } else {
        nav.classList.remove('sticky');
    }
};

window.addEventListener('scroll', stickyNav);

// Smooth Scrolling for Anchor Links with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const headerOffset = 100; // Adjust this value based on your header height
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Testimonial Slider with Auto-advance
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;
let slideInterval;

const showSlide = (index) => {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    slides[index].classList.add('active');
    dots[index].classList.add('active');
};

const nextSlide = () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
};

const prevSlide = () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentScroll);
};

// Event listeners for slider controls
document.querySelector('.next-btn').addEventListener('click', nextSlide);
document.querySelector('.prev-btn').addEventListener('click', prevSlide);

// Dot navigation for testimonials
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Auto-advance testimonials with pause on hover
function startSlideShow() {
    slideInterval = setInterval(nextSlide, 5000);
}

function pauseSlideShow() {
    clearInterval(slideInterval);
}

const testimonialSlider = document.querySelector('.testimonial-slider');
if (testimonialSlider) {
    testimonialSlider.addEventListener('mouseenter', pauseSlideShow);
    testimonialSlider.addEventListener('mouseleave', startSlideShow);
}

// Start the slideshow
startSlideShow();

// Investment Consultation Form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';
        const message = document.getElementById('message').value.trim();
        const investmentAmount = document.getElementById('investment-amount') ? document.getElementById('investment-amount').value : '';
        const investmentGoal = document.getElementById('investment-goal') ? document.getElementById('investment-goal').value : '';
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            // Here you would typically send the data to your server
            // For demo purposes, we'll simulate an API call with a timeout
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            showNotification('Thank you for your inquiry! We will contact you shortly to discuss your investment goals.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Log the form data (in a real app, this would be sent to your server)
            console.log('Form submitted:', {
                name,
                email,
                phone,
                investmentAmount,
                investmentGoal,
                message,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotification('There was an error sending your message. Please try again later.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// Show notification function
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto-remove after 5 seconds
    const removeTimer = setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            clearTimeout(removeTimer);
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }
}

// Active navigation link highlighting on scroll
const sections = document.querySelectorAll('section');

const highlightNav = () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = `#${section.id}`;
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === current) {
            item.classList.add('active');
        }
    });
};

window.addEventListener('scroll', highlightNav);

// Initialize the first slide and set up event listeners
function initSlider() {
    // Show first slide
    showSlide(0);
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });
    
    // Touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    testimonialSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    testimonialSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        if (touchEndX < touchStartX) {
            nextSlide();
        }
        if (touchEndX > touchStartX) {
            prevSlide();
        }
    }
}

// Initialize the slider
initSlider();

// Animation on scroll with Intersection Observer for better performance
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .blog-card, .about-content, .contact-container, .testimonial-slide');
    
    // Use Intersection Observer if available for better performance
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
};

// Set initial styles for animation
window.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .blog-card, .about-content, .contact-container');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        element.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Trigger initial animation
    setTimeout(animateOnScroll, 500);
});

window.addEventListener('scroll', animateOnScroll);

// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
});
