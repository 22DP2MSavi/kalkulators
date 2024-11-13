const buttons = document.querySelectorAll('.buttons button');
const inputEl = document.querySelector('#input');
const historyContainer = document.querySelector('.historyContainer');
const clearHistoryBtn = document.querySelector('.clearHistoryBtn');
const STORAGE_NAME = 'history_v4';

// Initialize history if it doesn't exist
if (localStorage.getItem(STORAGE_NAME) === null) {
    localStorage.setItem(STORAGE_NAME, JSON.stringify([]));
}

refreshHistory();

// Handle all number buttons and operators
buttons.forEach(button => {
    const symbol = button.innerHTML;

    button.addEventListener('click', () => {
        if (symbol === 'CLEAR') {
            inputEl.value = ''; // Clear the input
        } else if (symbol === 'DEL') {
            inputEl.value = inputEl.value.slice(0, -1); // Remove last character
        } else if (symbol === '=') {
            handleEqual();
        } else {
            inputEl.value += symbol; // Append symbol to input value
        }
    });
});

// Handle calculation when "=" is pressed
function handleEqual() {
    try {
        const expression = inputEl.value;  // Get the current expression
        const result = eval(expression);  // Evaluate the expression

        if (result !== undefined && result !== null) {
            inputEl.value = result; // Set the result in the input field
            saveHistory(expression, result); // Save the original expression and result to history
            refreshHistory(); // Refresh the history display
        } else {
            inputEl.value = 'ERROR';
        }
    } catch (error) {
        inputEl.value = 'ERROR'; // Handle invalid expressions
    }
}

// Save both the original expression and the result to history
function saveHistory(expression, result) {
    let historyElements = JSON.parse(localStorage.getItem(STORAGE_NAME));
    historyElements.push({ input: expression, result: result });
    localStorage.setItem(STORAGE_NAME, JSON.stringify(historyElements));
}

// Refresh the history section
function refreshHistory() {
    historyContainer.innerHTML = ''; // Clear the current history

    let historyElements = JSON.parse(localStorage.getItem(STORAGE_NAME));

    historyElements.forEach((entry, index) => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('historyItem');
        historyItem.innerHTML = `
            <div>${entry.input}</div>
            <div>= ${entry.result}</div>
            <button class="deleteHistoryBtn" data-index="${index}">Delete</button>
        `;
        historyContainer.appendChild(historyItem);
    });

    // Add delete functionality to each history item
    const deleteBtns = document.querySelectorAll('.deleteHistoryBtn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            deleteHistoryItem(index);
        });
    });
}

// Delete a specific history item
function deleteHistoryItem(index) {
    let historyElements = JSON.parse(localStorage.getItem(STORAGE_NAME));
    historyElements.splice(index, 1); // Remove the history entry
    localStorage.setItem(STORAGE_NAME, JSON.stringify(historyElements)); // Update storage
    refreshHistory(); // Refresh the history display
}

// Clear all history
clearHistoryBtn.addEventListener('click', () => {
    localStorage.setItem(STORAGE_NAME, JSON.stringify([])); // Clear all history
    refreshHistory(); // Refresh the history display
});
