document.addEventListener('DOMContentLoaded', function() {
    // Game state variables
    let playerScore = 0;
    let computerScore = 0;
    let tieScore = 0;
    let playerScoreEl = document.getElementById('playerScore');
    let computerScoreEl = document.getElementById('computerScore');
    let gameResultEl = document.getElementById('gameResult');
    
    // Stats tracking variables
    let totalGames = 0;
    let currentStreak = 0;
    let highestStreak = 0;
    let playerMoves = {
        rock: 0,
        paper: 0,
        scissors: 0
    };
    let gameResults = {
        win: 0,
        lose: 0,
        tie: 0
    };
    
    // Add tie score display to the HTML
    const scoreDisplay = document.querySelector('.score-display');
    const tieScoreItem = document.createElement('div');
    tieScoreItem.className = 'score-item';
    tieScoreItem.innerHTML = `
        <span class="score-label">Ties</span>
        <span class="score-value" id="tieScore">0</span>
    `;
    scoreDisplay.appendChild(tieScoreItem);
    const tieScoreEl = document.getElementById('tieScore');
    
    // Get stats elements
    const totalGamesEl = document.querySelector('.card:nth-child(1) h2');
    const winRateEl = document.querySelector('.card:nth-child(2) h2');
    const rankingEl = document.querySelector('.card:nth-child(3) h2');
    const streakEl = document.querySelector('.card:nth-child(4) h2');
    
    // Initialize charts
    let moveChart = null;
    let resultChart = null;
    
    // Choice buttons
    const rockBtn = document.getElementById('rock');
    const paperBtn = document.getElementById('paper');
    const scissorsBtn = document.getElementById('scissors');
    
    // Event listeners for player choices
    rockBtn.addEventListener('click', function() {
        playGame('rock');
        showButtonFeedback(this);
    });
    
    paperBtn.addEventListener('click', function() {
        playGame('paper');
        showButtonFeedback(this);
    });
    
    scissorsBtn.addEventListener('click', function() {
        playGame('scissors');
        showButtonFeedback(this);
    });
    
    // Main game function
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
        if (result === 'win') {
            currentStreak++;
            if (currentStreak > highestStreak) {
                highestStreak = currentStreak;
            }
        } else {
            currentStreak = 0;
        }
        
        // Update scores if necessary
        if (result === 'win') {
            playerScore++;
            playerScoreEl.textContent = playerScore;
        } else if (result === 'lose') {
            computerScore++;
            computerScoreEl.textContent = computerScore;
        } else if (result === 'tie') {
            tieScore++;
            tieScoreEl.textContent = tieScore;
        }
        
        // Update stats cards
        updateStatsCards();
        
        // Update charts
        updateCharts();
        
        // Add to recent activity
        addGameToHistory(playerChoice, computerChoice, result);
    }
    
    // Determine who wins the round
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
    
    // Update game result message
    function updateGameResult(playerChoice, computerChoice, result) {
        // Create result container
        let resultHTML = `
        <div class="result-container">
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
        
        gameResultEl.innerHTML = resultHTML;
    }
    
    // Update stats cards with current data
    function updateStatsCards() {
        // Update total games
        totalGamesEl.textContent = totalGames;
        
        // Calculate and update win rate
        const winRate = totalGames > 0 ? Math.round((gameResults.win / totalGames) * 100) : 0;
        winRateEl.textContent = `${winRate}%`;
        
        // Determine ranking based on win rate
        let ranking = 'Beginner';
        if (winRate >= 65) ranking = 'Master';
        else if (winRate >= 50) ranking = 'Expert';
        else if (winRate >= 35) ranking = 'Intermediate';
        rankingEl.textContent = ranking;
        
        // Update streak
        streakEl.textContent = highestStreak;
    }
    
    // Initialize and update charts
    function updateCharts() {
        const movesChartEl = document.getElementById('movesChart');
        const resultsChartEl = document.getElementById('resultsChart');
        
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
                        'rgba(255, 118, 117, 0.7)',
                        'rgba(116, 185, 255, 0.7)',
                        'rgba(85, 239, 196, 0.7)'
                    ],
                    borderColor: [
                        'rgb(255, 118, 117)',
                        'rgb(116, 185, 255)',
                        'rgb(85, 239, 196)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
                maintainAspectRatio: false
            }
        });
    }
    
    // Add game to history
    function addGameToHistory(playerChoice, computerChoice, result) {
        const activityList = document.querySelector('.activity-list');
        
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
        
        // Add to the top of the list
        activityList.insertBefore(historyItem, activityList.firstChild);
        
        // Limit history to 5 items
        const items = activityList.querySelectorAll('.activity-item');
        if (items.length > 5) {
            activityList.removeChild(items[items.length - 1]);
        }
    }
    
    // Function for visual feedback when buttons are clicked
    function showButtonFeedback(button) {
        // Add a brief highlight effect
        button.classList.add('active-choice');
        
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
    
    // Add CSS for the game styling
    const style = document.createElement('style');
    style.textContent = `
        .active-choice {
            transform: scale(0.95);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }
        
        .result-container {
            background-color: #f8f9fa;
            border-radius: 12px;
            padding: 15px;
            margin-top: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        
        .choices-display {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .choice-display {
            text-align: center;
            flex: 1;
        }
        
        .choice-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 10px;
            font-size: 24px;
        }
        
        .choice-icon.rock {
            background-color: #ff7675;
            color: white;
        }
        
        .choice-icon.paper {
            background-color: #74b9ff;
            color: white;
        }
        
        .choice-icon.scissors {
            background-color: #55efc4;
            color: white;
        }
        
        .versus {
            font-weight: bold;
            font-size: 20px;
            margin: 0 15px;
            color: #636e72;
        }
        
        .result-banner {
            text-align: center;
            padding: 10px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 1.3em;
            margin-top: 10px;
        }
        
        .result-banner.win {
            background-color: #b8e994;
            color: #1e441e;
        }
        
        .result-banner.lose {
            background-color: #ffcccc;
            color: #5c2626;
        }
        
        .result-banner.tie {
            background-color: #dfe6e9;
            color: #2d3436;
        }
        
        /* Activity list styles */
        .activity-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 15px;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .activity-result {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: bold;
            margin-right: 10px;
            font-size: 0.85em;
        }
        
        .activity-result.win {
            background-color: #e3fcef;
            color: #1e441e;
        }
        
        .activity-result.lose {
            background-color: #fee7e7;
            color: #5c2626;
        }
        
        .activity-result.tie {
            background-color: #e6eaee;
            color: #2d3436;
        }
        
        .activity-time {
            color: #a0a0a0;
            font-size: 0.85em;
        }
    `;
    document.head.appendChild(style);
}); 