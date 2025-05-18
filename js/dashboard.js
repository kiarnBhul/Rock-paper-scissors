document.addEventListener('DOMContentLoaded', function() {
    // Basic event listeners for choice buttons (just for structure, no functionality)
    const rockBtn = document.getElementById('rock');
    const paperBtn = document.getElementById('paper');
    const scissorsBtn = document.getElementById('scissors');
    
    rockBtn.addEventListener('click', function() {
        // Just UI feedback with no actual functionality
        showButtonFeedback(this);
    });
    
    paperBtn.addEventListener('click', function() {
        // Just UI feedback with no actual functionality
        showButtonFeedback(this);
    });
    
    scissorsBtn.addEventListener('click', function() {
        // Just UI feedback with no actual functionality
        showButtonFeedback(this);
    });
    
    // Function for visual feedback when buttons are clicked
    function showButtonFeedback(button) {
        // Add a brief highlight effect
        button.classList.add('active-choice');
        
        // Show a message in the game result area
        const gameResultEl = document.getElementById('gameResult');
        gameResultEl.innerHTML = `<p>You chose ${button.id}!</p>`;
        
        // Remove the highlight after a short delay
        setTimeout(function() {
            button.classList.remove('active-choice');
        }, 200);
    }
    
    // Mobile Sidebar Toggle Functionality
    function checkWindowSize() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        const navLinks = document.querySelectorAll('.nav-links li a span');
        const logo = document.querySelector('.logo h2');

        if (window.innerWidth <= 768) {
            sidebar.style.width = '70px';
            mainContent.style.marginLeft = '70px';
            navLinks.forEach(span => span.style.display = 'none');
            logo.style.display = 'none';
        } else {
            sidebar.style.width = 'var(--sidebar-width)';
            mainContent.style.marginLeft = 'var(--sidebar-width)';
            navLinks.forEach(span => span.style.display = 'inline');
            logo.style.display = 'block';
        }
    }

    // Call on page load
    checkWindowSize();

    // Call when window is resized
    window.addEventListener('resize', checkWindowSize);

    // Add active class to nav items on click
    const navItems = document.querySelectorAll('.nav-links li');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Add CSS for active choice button
    const style = document.createElement('style');
    style.textContent = `
        .active-choice {
            transform: scale(0.95);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }
    `;
    document.head.appendChild(style);
}); 