/**
 * Rock Paper Scissors Game
 * A modern implementation with statistics tracking and data visualization
 */
document.addEventListener('DOMContentLoaded', function() {
    // ===== Game state variables =====
    let playerScore = 0;
    let computerScore = 0;
    let tieScore = 0;
    let currentStreak = 0;
    let highestStreak = 0;
    let totalGames = 0;
    
    // Player moves tracking
    let playerMoves = {
        rock: 0,
        paper: 0,
        scissors: 0
    };
    
    // Game results tracking
    let gameResults = {
        win: 0,
        lose: 0,
        tie: 0
    };
    
    // ===== DOM Elements =====
    const playerScoreEl = document.getElementById('playerScore');
    const computerScoreEl = document.getElementById('computerScore');
    const gameResultEl = document.getElementById('gameResult');
    
    // Stats elements
    const totalGamesEl = document.querySelector('.card:nth-child(1) h2');
    const winRateEl = document.querySelector('.card:nth-child(2) h2');
    const rankingEl = document.querySelector('.card:nth-child(3) h2');
    const streakEl = document.querySelector('.card:nth-child(4) h2');
    
    // Choice buttons
    const rockBtn = document.getElementById('rock');
    const paperBtn = document.getElementById('paper');
    const scissorsBtn = document.getElementById('scissors');
    
    // Chart elements
    const movesChartEl = document.getElementById('movesChart');
    const resultsChartEl = document.getElementById('resultsChart');
    
    // Chart instances
    let moveChart = null;
    let resultChart = null;
    
    // Add tie score display to the HTML
    const scoreDisplay = document.querySelector('.score-display');
    if (scoreDisplay) {
        const tieScoreItem = document.createElement('div');
        tieScoreItem.className = 'score-item';
        tieScoreItem.innerHTML = `
            <span class="score-label">Ties</span>
            <span class="score-value" id="tieScore">0</span>
        `;
        scoreDisplay.appendChild(tieScoreItem);
    }
    const tieScoreEl = document.getElementById('tieScore');
    
    // ===== Load game data from localStorage if available =====
    loadGameData();
    
    // ===== Event Listeners =====
    // Player choice buttons
    if (rockBtn) {
        rockBtn.addEventListener('click', function() {
            playGame('rock');
            showButtonFeedback(this);
        });
    }
    
    if (paperBtn) {
        paperBtn.addEventListener('click', function() {
            playGame('paper');
            showButtonFeedback(this);
        });
    }
    
    if (scissorsBtn) {
        scissorsBtn.addEventListener('click', function() {
            playGame('scissors');
            showButtonFeedback(this);
        });
    }
    
    // Add staggered animation to dashboard elements
    const dashboardItems = document.querySelectorAll('.dashboard-content > *');
    dashboardItems.forEach((item, index) => {
        item.style.setProperty('--animation-order', index + 1);
    });
    
    // ===== Game Functions =====
    
    /**
     * Main game function - handles the game logic when a player makes a choice
     * @param {string} playerChoice - The player's choice (rock, paper, or scissors)
     */
    function playGame(playerChoice) {
        // Get computer's choice
        const choices = ['rock', 'paper', 'scissors'];
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        
        // Determine the winner
        const result = determineWinner(playerChoice, computerChoice);
        
        // Update the game result display
        updateGameResult(playerChoice, computerChoice, result);
        
        // Track player move
        playerMoves[playerChoice]++;
        
        // Track game result
        gameResults[result]++;
        
        // Update total games
        totalGames++;
        
        // Update streak
        updateStreak(result);
        
        // Update scores if necessary
        updateScores(result);
        
        // Update stats cards
        updateStatsCards();
        
        // Update charts
        updateCharts();
        
        // Add to recent activity
        addGameToHistory(playerChoice, computerChoice, result);
        
        // Save game data to localStorage
        saveGameData();
    }
    
    /**
     * Determine the winner of a round based on player and computer choices
     * @param {string} playerChoice - The player's choice
     * @param {string} computerChoice - The computer's choice
     * @returns {string} - The result: 'win', 'lose', or 'tie'
     */
    function determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'tie';
        }
        
        if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            return 'win';
        }
        
        return 'lose';
    }
    
    /**
     * Update the game result display with animation and detailed visuals
     * @param {string} playerChoice - The player's choice
     * @param {string} computerChoice - The computer's choice
     * @param {string} result - The result of the round
     */
    function updateGameResult(playerChoice, computerChoice, result) {
        // Create result container
        let resultHTML = `
        <div class="result-container page-transition">
            <div class="choices-display">
                <div class="choice-display player">
                    <div class="choice-icon ${playerChoice}">
                        <i class="fas fa-hand-${playerChoice}"></i>
                    </div>
                    <p>You chose <strong>${playerChoice}</strong></p>
                </div>
                <div class="versus">VS</div>
                <div class="choice-display computer">
                    <div class="choice-icon ${computerChoice}">
                        <i class="fas fa-hand-${computerChoice}"></i>
                    </div>
                    <p>Computer chose <strong>${computerChoice}</strong></p>
                </div>
            </div>
            <div class="result-banner ${result}">
                ${result === 'win' ? 'You win!' : result === 'lose' ? 'Computer wins!' : 'It\'s a tie!'}
            </div>
        </div>
        `;
        
        if (gameResultEl) {
            gameResultEl.innerHTML = resultHTML;
        }
    }
    
    /**
     * Update player streak based on game result
     * @param {string} result - The result of the round
     */
    function updateStreak(result) {
        if (result === 'win') {
            currentStreak++;
            if (currentStreak > highestStreak) {
                highestStreak = currentStreak;
            }
        } else {
            currentStreak = 0;
        }
    }
    
    /**
     * Update scores based on game result
     * @param {string} result - The result of the round
     */
    function updateScores(result) {
        if (result === 'win') {
            playerScore++;
            if (playerScoreEl) playerScoreEl.textContent = playerScore;
        } else if (result === 'lose') {
            computerScore++;
            if (computerScoreEl) computerScoreEl.textContent = computerScore;
        } else if (result === 'tie') {
            tieScore++;
            if (tieScoreEl) tieScoreEl.textContent = tieScore;
        }
    }
    
    /**
     * Update stats cards with current game data
     */
    function updateStatsCards() {
        // Update total games
        if (totalGamesEl) totalGamesEl.textContent = totalGames;
        
        // Calculate and update win rate
        const winRate = totalGames > 0 ? Math.round((gameResults.win / totalGames) * 100) : 0;
        if (winRateEl) winRateEl.textContent = `${winRate}%`;
        
        // Determine ranking based on win rate
        let ranking = 'Beginner';
        if (winRate >= 65) ranking = 'Master';
        else if (winRate >= 50) ranking = 'Expert';
        else if (winRate >= 35) ranking = 'Intermediate';
        if (rankingEl) rankingEl.textContent = ranking;
        
        // Update streak
        if (streakEl) streakEl.textContent = highestStreak;
    }
    
    /**
     * Initialize and update charts with current game data
     */
    function updateCharts() {
        if (!movesChartEl || !resultsChartEl) return;
        
        // Clear placeholders
        movesChartEl.innerHTML = '';
        resultsChartEl.innerHTML = '';
        
        // Create canvas elements if they don't exist
        if (!movesChartEl.querySelector('canvas')) {
            movesChartEl.innerHTML = '<canvas></canvas>';
        }
        if (!resultsChartEl.querySelector('canvas')) {
            resultsChartEl.innerHTML = '<canvas></canvas>';
        }
        
        // Get canvas contexts
        const movesCanvas = movesChartEl.querySelector('canvas');
        const resultsCanvas = resultsChartEl.querySelector('canvas');
        
        // Destroy existing charts if they exist
        if (moveChart) moveChart.destroy();
        if (resultChart) resultChart.destroy();
        
        // Create moves distribution chart
        moveChart = new Chart(movesCanvas, {
            type: 'bar',
            data: {
                labels: ['Rock', 'Paper', 'Scissors'],
                datasets: [{
                    label: 'Times Used',
                    data: [playerMoves.rock, playerMoves.paper, playerMoves.scissors],
                    backgroundColor: [
                        'rgba(231, 76, 60, 0.7)',
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(46, 204, 113, 0.7)'
                    ],
                    borderColor: [
                        'rgb(231, 76, 60)',
                        'rgb(52, 152, 219)',
                        'rgb(46, 204, 113)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: 10,
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 13
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
        
        // Create win/loss ratio chart
        resultChart = new Chart(resultsCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Wins', 'Losses', 'Ties'],
                datasets: [{
                    label: 'Game Results',
                    data: [gameResults.win, gameResults.lose, gameResults.tie],
                    backgroundColor: [
                        'rgba(46, 213, 115, 0.7)',
                        'rgba(255, 71, 87, 0.7)',
                        'rgba(55, 66, 250, 0.7)'
                    ],
                    borderColor: [
                        'rgb(46, 213, 115)',
                        'rgb(255, 71, 87)',
                        'rgb(55, 66, 250)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000,
                    easing: 'easeOutCirc'
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: 10,
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 13
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Add game result to the history/recent activity section
     * @param {string} playerChoice - The player's choice
     * @param {string} computerChoice - The computer's choice
     * @param {string} result - The result of the round
     */
    function addGameToHistory(playerChoice, computerChoice, result) {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;
        
        // Clear empty state if it exists
        const emptyState = activityList.querySelector('.empty-state');
        if (emptyState) {
            activityList.innerHTML = '';
        }
        
        // Create game history item
        const historyItem = document.createElement('div');
        historyItem.className = 'activity-item';
        
        const resultClass = result === 'win' ? 'win' : result === 'lose' ? 'lose' : 'tie';
        const resultText = result === 'win' ? 'Won' : result === 'lose' ? 'Lost' : 'Tied';
        
        historyItem.innerHTML = `
            <div class="activity-info">
                <span class="activity-result ${resultClass}">${resultText}</span>
                <span class="activity-detail">You: ${playerChoice} vs Computer: ${computerChoice}</span>
            </div>
            <div class="activity-time">Just now</div>
        `;
        
        // Add to the top of the list with animation
        historyItem.style.opacity = '0';
        historyItem.style.transform = 'translateY(-10px)';
        activityList.insertBefore(historyItem, activityList.firstChild);
        
        // Trigger animation
        setTimeout(() => {
            historyItem.style.transition = 'all 0.3s ease-out';
            historyItem.style.opacity = '1';
            historyItem.style.transform = 'translateY(0)';
        }, 10);
        
        // Limit history to 5 items
        const items = activityList.querySelectorAll('.activity-item');
        if (items.length > 5) {
            activityList.removeChild(items[items.length - 1]);
        }
    }
    
    /**
     * Visual feedback when buttons are clicked
     * @param {HTMLElement} button - The button that was clicked
     */
    function showButtonFeedback(button) {
        // Add a brief highlight effect
        button.classList.add('active-choice');
        
        // Remove the highlight after a short delay
        setTimeout(function() {
            button.classList.remove('active-choice');
        }, 200);
    }
    
    /**
     * Save game data to localStorage
     */
    function saveGameData() {
        const gameData = {
            playerScore,
            computerScore,
            tieScore,
            totalGames,
            highestStreak,
            playerMoves,
            gameResults
        };
        
        localStorage.setItem('rpsGameData', JSON.stringify(gameData));
    }
    
    /**
     * Load game data from localStorage
     */
    function loadGameData() {
        const savedData = localStorage.getItem('rpsGameData');
        if (!savedData) return;
        
        try {
            const gameData = JSON.parse(savedData);
            
            // Restore game state
            playerScore = gameData.playerScore || 0;
            computerScore = gameData.computerScore || 0;
            tieScore = gameData.tieScore || 0;
            totalGames = gameData.totalGames || 0;
            highestStreak = gameData.highestStreak || 0;
            
            // Restore move tracking
            if (gameData.playerMoves) {
                playerMoves = gameData.playerMoves;
            }
            
            // Restore result tracking
            if (gameData.gameResults) {
                gameResults = gameData.gameResults;
            }
            
            // Update UI with loaded data
            if (playerScoreEl) playerScoreEl.textContent = playerScore;
            if (computerScoreEl) computerScoreEl.textContent = computerScore;
            if (tieScoreEl) tieScoreEl.textContent = tieScore;
            
            // Update stats and charts
            updateStatsCards();
            updateCharts();
            
        } catch (error) {
            console.error('Error loading game data:', error);
        }
    }
    
    // ===== UI Helpers =====
    
    /**
     * Mobile Sidebar Toggle Functionality
     */
    function checkWindowSize() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        const navLinks = document.querySelectorAll('.nav-links li a span');
        const logo = document.querySelector('.logo h2');
        const profileInfo = document.querySelector('.profile-info');
        const menuLabels = document.querySelectorAll('.menu-label');
        const sidebarFooter = document.querySelector('.sidebar-footer');

        if (window.innerWidth <= 768) {
            if (sidebar) sidebar.style.width = '70px';
            if (mainContent) mainContent.style.marginLeft = '70px';
            
            // Hide text elements in sidebar
            [navLinks, logo, profileInfo, menuLabels, sidebarFooter].forEach(elements => {
                if (elements) {
                    if (elements.forEach) {
                        elements.forEach(el => {
                            if (el) el.style.display = 'none';
                        });
                    } else {
                        elements.style.display = 'none';
                    }
                }
            });
            
            // Center profile image
            const profileSection = document.querySelector('.profile-section');
            if (profileSection) {
                profileSection.style.justifyContent = 'center';
                profileSection.style.padding = '10px';
            }
        } else {
            if (sidebar) sidebar.style.width = 'var(--sidebar-width)';
            if (mainContent) mainContent.style.marginLeft = 'var(--sidebar-width)';
            
            // Show text elements in sidebar
            if (navLinks) navLinks.forEach(span => { if (span) span.style.display = 'inline'; });
            if (logo) logo.style.display = 'block';
            if (profileInfo) profileInfo.style.display = 'block';
            if (menuLabels) menuLabels.forEach(label => { if (label) label.style.display = 'block'; });
            if (sidebarFooter) sidebarFooter.style.display = 'block';
            
            // Reset profile section
            const profileSection = document.querySelector('.profile-section');
            if (profileSection) {
                profileSection.style.justifyContent = 'flex-start';
                profileSection.style.padding = '15px';
            }
        }
    }

    // Call on page load
    checkWindowSize();

    // Call when window is resized
    window.addEventListener('resize', checkWindowSize);

    // Add active class to nav items on click
    const navItems = document.querySelectorAll('.nav-links li');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't add active class if it's an external link
            if (e.currentTarget.querySelector('a').getAttribute('target') === '_blank') {
                return;
            }
            
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Initial chart update if we have game data
    if (totalGames > 0) {
        updateCharts();
    }
}); 