const buttons = document.querySelectorAll('.buttonGrid .button'); // Atlasa visas pogas
const inputEl = document.querySelector('#input'); // Atlasa ievades lauku
const historyContainer = document.querySelector('.historyContainer'); // Atlasa vēstures konteineru
const clearHistoryBtn = document.querySelector('.clearHistoryBtn'); // Atlasa pogu vēstures dzēšanai

// Vēstures inicializācija
if (!localStorage.getItem('history')) { // Pārbauda, vai vēsture eksistē
    localStorage.setItem('history', JSON.stringify([])); // Izveido tukšu vēstures masīvu
}
refreshHistory(); // Atjauno vēsturi lapā

// Pogu spiesanas apstrāde
buttons.forEach(button => { // Cikls katrai pogai
    const value = button.getAttribute('data-value'); // Iegūst pogas vērtību

    button.addEventListener('click', () => { // Klikšķa notikuma klausītājs
        if (value === 'CLEAR') inputEl.value = ''; // Notīra ievades lauku
        else if (value === 'DEL') inputEl.value = inputEl.value.slice(0, -1); // Noņem pēdējo simbolu
        else if (value === '=') handleEqual(); // Aprēķina rezultātu
        else inputEl.value += value; // Pievieno ievadīto vērtību
    });
});

// Funkcija "=" pogas apstrādei
function handleEqual() {
    try {
        const expression = inputEl.value; // Ievadītā izteiksme
        const result = eval(expression); // Aprēķina rezultātu

        inputEl.value = result; // Parāda rezultātu ievades laukumā
        saveHistory(expression, result); // Saglabā rezultātu vēsturē
        refreshHistory(); // Atjauno vēstures sadaļu
    } catch {
        inputEl.value = 'ERROR'; // Kļūda, ja nepareiza izteiksme
    }
}

// Funkcija rezultāta un izteiksmes saglabāšanai vēsturē
function saveHistory(expression, result) {
    let history = JSON.parse(localStorage.getItem('history')); // Iegūst vēsturi
    history.push({ input: expression, result }); // Pievieno jaunu ierakstu
    localStorage.setItem('history', JSON.stringify(history)); // Saglabā atjaunoto vēsturi
}

// Funkcija vēstures atjaunošanai
function refreshHistory() {
    const history = JSON.parse(localStorage.getItem('history')); // Iegūst vēsturi
    historyContainer.innerHTML = history.map((entry, index) => `
        <div class="historyItem"> <!-- Katrs vēstures ieraksts -->
            <div>${entry.input}</div> <!-- Rāda izteiksmi -->
            <div>= ${entry.result}</div> <!-- Rāda rezultātu -->
            <button class="deleteHistoryBtn" data-index="${index}">Delete</button> <!-- Dzēšanas poga --> 
        </div>
    `).join(''); 

    // Katras vēstures dzēšanas pogas apstrāde
    document.querySelectorAll('.deleteHistoryBtn').forEach(btn => {
        btn.addEventListener('click', (event) => deleteHistoryItem(event.target.getAttribute('data-index'))); // Dzēš izvēlēto vēstures ierakstu
    });
}

// Funkcija konkrēta vēstures ieraksta dzēšanai
function deleteHistoryItem(index) {
    let history = JSON.parse(localStorage.getItem('history')); // Iegūst vēsturi
    history.splice(index, 1); // Dzēš konkrēto ierakstu
    localStorage.setItem('history', JSON.stringify(history)); // Saglabā atjaunoto vēsturi
    refreshHistory(); // Atjauno vēsturi lapā
}

// Vēstures tīrīšana
clearHistoryBtn.addEventListener('click', () => {
    localStorage.setItem('history', JSON.stringify([])); // Iestata tukšu vēsturi
    refreshHistory(); // Atjauno vēsturi lapā
});
