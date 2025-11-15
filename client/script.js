// Goals data
let goals = [

];

let currentEditId = null;
let currentSavingsId = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderGoals();
    updateOverview();
    
    // Add goal form submission
    document.getElementById('addGoalForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addGoal();
    });
});

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Add new goal
function addGoal() {
    const name = document.getElementById('goalName').value;
    const targetAmount = parseFloat(document.getElementById('targetAmount').value);
    const currentAmount = parseFloat(document.getElementById('currentAmount').value);

    const newGoal = {
        id: Date.now(),
        name: name,
        targetAmount: targetAmount,
        currentAmount: currentAmount,
        icon: getRandomIcon()
    };

    goals.push(newGoal);
    renderGoals();
    updateOverview();
    
    // Reset form
    document.getElementById('addGoalForm').reset();
    showToast('Goal added successfully! 🎉');
}

// Get random icon for goal
function getRandomIcon() {
    const icons = ['💰', '🎯', '🏠', '🚗', '📚', '💍', '🎓', '🏖️', '💻', '📱', '🎮', '⌚'];
    return icons[Math.floor(Math.random() * icons.length)];
}

// Render all goals
function renderGoals() {
    const goalsGrid = document.getElementById('goalsGrid');
    
    if (goals.length === 0) {
        goalsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">🎯</div>
                <p class="empty-state-text">No goals yet. Add your first financial goal above!</p>
            </div>
        `;
        return;
    }

    goalsGrid.innerHTML = goals.map(goal => {
        const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
        const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
        
        return `
            <div class="goal-card">
                <div class="goal-header">
                    <div class="goal-info">
                        <div class="goal-name">${goal.name}</div>
                        <div class="goal-target">Target: N${goal.targetAmount.toLocaleString()}</div>
                    </div>
                </div>
                <div class="progress-section">
                    <div class="progress-info">
                        <span class="progress-label">N${goal.currentAmount.toLocaleString()} saved</span>
                        <span class="progress-label">${progress.toFixed(0)}%</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-info" style="margin-top: 8px;">
                        <span class="progress-label" style="color: ${remaining === 0 ? '#059669' : '#64748b'};">
                            ${remaining === 0 ? '🎉 Goal Achieved!' : `N${remaining.toLocaleString()} remaining`}
                        </span>
                    </div>
                </div>
                <div class="goal-actions">
                    <button class="btn btn-success" onclick="openAddSavingsModal(${goal.id})">
                        Add Savings
                    </button>
                    <button class="btn btn-secondary" onclick="openEditModal(${goal.id})">
                        Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteGoal(${goal.id})">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Update overview statistics
function updateOverview() {
    const totalGoals = goals.length;
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    document.getElementById('totalGoals').textContent = totalGoals;
    document.getElementById('totalTarget').textContent = 'N' + totalTarget.toLocaleString();
    document.getElementById('totalSaved').textContent = 'N' + totalSaved.toLocaleString();
    document.getElementById('overallProgress').textContent = overallProgress.toFixed(0) + '%';
}

// Open add savings modal
function openAddSavingsModal(id) {
    currentSavingsId = id;
    document.getElementById('savingsAmount').value = '';
    document.getElementById('addSavingsModal').classList.add('active');
}

// Confirm add savings
function confirmAddSavings() {
    const amount = parseFloat(document.getElementById('savingsAmount').value);
    
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    const goal = goals.find(g => g.id === currentSavingsId);
    if (goal) {
        goal.currentAmount += amount;
        renderGoals();
        updateOverview();
        closeModal();
        showToast('Savings added successfully! 💰');
    }
}

// Open edit modal
function openEditModal(id) {
    currentEditId = id;
    const goal = goals.find(g => g.id === id);
    
    if (goal) {
        document.getElementById('editGoalName').value = goal.name;
        document.getElementById('editTargetAmount').value = goal.targetAmount;
        document.getElementById('editCurrentAmount').value = goal.currentAmount;
        document.getElementById('editGoalModal').classList.add('active');
    }
}

// Confirm edit goal
function confirmEditGoal() {
    const name = document.getElementById('editGoalName').value;
    const targetAmount = parseFloat(document.getElementById('editTargetAmount').value);
    const currentAmount = parseFloat(document.getElementById('editCurrentAmount').value);

    if (!name || !targetAmount || targetAmount <= 0 || currentAmount < 0) {
        alert('Please enter valid values');
        return;
    }

    const goal = goals.find(g => g.id === currentEditId);
    if (goal) {
        goal.name = name;
        goal.targetAmount = targetAmount;
        goal.currentAmount = currentAmount;
        renderGoals();
        updateOverview();
        closeModal();
        showToast('Goal updated successfully!');
    }
}

// Delete goal
function deleteGoal(id) {
    if (confirm('Are you sure you want to delete this goal?')) {
        goals = goals.filter(g => g.id !== id);
        renderGoals();
        updateOverview();
        showToast('Goal deleted successfully!');
    }
}

// Close modal
function closeModal() {
    document.getElementById('addSavingsModal').classList.remove('active');
    document.getElementById('editGoalModal').classList.remove('active');
    currentEditId = null;
    currentSavingsId = null;
}

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
});