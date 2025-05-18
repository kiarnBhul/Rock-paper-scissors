document.addEventListener('DOMContentLoaded', function() {
    // Game state variables
    let playerScore = 0;
    let computerScore = 0;
    let tieScore = 0;
    let playerScoreEl = document.getElementById('playerScore');
    let computerScoreEl = document.getElementById('computerScore');
    let gameResultEl = document.getElementById('gameResult');
    
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
    `;
    document.head.appendChild(style);
}); 