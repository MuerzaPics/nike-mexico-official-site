// Main JavaScript file for Nike website
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.style.width = '250px';
        });
        
        searchInput.addEventListener('blur', function() {
            if (!this.value) {
                this.style.width = '200px';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll effect to navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card, .equipment-item, .challenge-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Initialize any carousels or sliders
    initializeSliders();
    
    // Add loading states for buttons
    const buttons = document.querySelectorAll('.cta-button, .product-button, .challenge-cta');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                const originalText = this.textContent;
                this.textContent = 'Cargando...';
                
                // Remove loading state after 2 seconds (simulate loading)
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.textContent = originalText;
                }, 2000);
            }
        });
    });
});

// Initialize sliders/carousels
function initializeSliders() {
    const classicsSlider = document.querySelector('.classics-slider');
    if (classicsSlider) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        classicsSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            classicsSlider.classList.add('active');
            startX = e.pageX - classicsSlider.offsetLeft;
            scrollLeft = classicsSlider.scrollLeft;
        });
        
        classicsSlider.addEventListener('mouseleave', () => {
            isDown = false;
            classicsSlider.classList.remove('active');
        });
        
        classicsSlider.addEventListener('mouseup', () => {
            isDown = false;
            classicsSlider.classList.remove('active');
        });
        
        classicsSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - classicsSlider.offsetLeft;
            const walk = (x - startX) * 2;
            classicsSlider.scrollLeft = scrollLeft - walk;
        });
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .navbar.scrolled {
        background-color: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .loading {
        opacity: 0.7;
        pointer-events: none;
    }
    
    .classics-slider.active {
        cursor: grabbing;
        user-select: none;
    }
`;
document.head.appendChild(style);

// Export functions for use in other scripts
window.NikeUtils = {
    showNotification
};
