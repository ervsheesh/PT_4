// Updated word data with additional 5 words
const singularWords = ["cat", "dog", "fish", "mouse", "goose", "lion", "horse", "sheep", "child", "man"];
const pluralWords = ["cats", "dogs", "fish", "mice", "geese", "lions", "horses", "sheep", "children", "men"];
const jumbledWords = ["tac", "odg", "hfsi", "umose", "osego", "noil", "rseho", "pehes", "dhilc", "nma"];
let score = 0;

// Initialize the game on page load
window.onload = () => {
        createGame();
};

/**
 * Sets up the game by dynamically creating jumbled and target words
 */
function createGame() {
        const jumbledContainer = document.getElementById("jumbledWords");
        const targetContainer = document.getElementById("targetWords");

        // Clear containers to avoid duplication during reset
        jumbledContainer.innerHTML = "";
        targetContainer.innerHTML = "";

        // Shuffle jumbled words and create draggable elements
        const shuffledWords = jumbledWords
                .map((word, index) => ({ word, index }))
                .sort(() => Math.random() - 0.5);

        shuffledWords.forEach(({ word, index }) => {
                const box = document.createElement("div");
                box.className = "box";
                box.textContent = word;
                box.draggable = true;
                box.id = `jumbled-${index}`;
                box.addEventListener("dragstart", dragStart);
                jumbledContainer.appendChild(box);
        });

        // Create droppable zones for plural words
        pluralWords.forEach((word, index) => {
                const dropZone = document.createElement("div");
                dropZone.className = "droppable";
                dropZone.textContent = word;
                dropZone.id = `target-${index}`;
                dropZone.addEventListener("dragover", dragOver);
                dropZone.addEventListener("drop", dropToTarget);
                targetContainer.appendChild(dropZone);
        });

        // Set up the unjumble box with drag-and-drop functionality
        const unjumbleBox = document.getElementById("unjumbleBox");
        unjumbleBox.addEventListener("dragover", dragOver);
        unjumbleBox.addEventListener("drop", unjumbleWord);
}

/**
 * Starts drag event by setting the dragged element's ID
 * @param {Event} event - Drag start event
 */
function dragStart(event) {
        event.dataTransfer.setData("text", event.target.id);
        event.target.classList.add("dragging");
}

/**
 * Allows dragged elements to be dropped on target elements
 * @param {Event} event - Drag over event
 */
function dragOver(event) {
        event.preventDefault();
}

/**
 * Reveals the unjumbled word when dropped in the unjumble box
 * @param {Event} event - Drop event in unjumble box
 */
function unjumbleWord(event) {
        event.preventDefault();
        const draggedId = event.dataTransfer.getData("text");
        const draggedElement = document.getElementById(draggedId);
        const draggedIndex = parseInt(draggedId.split("-")[1]);

        // Change text to singular form and mark as unjumbled
        draggedElement.textContent = singularWords[draggedIndex];
        draggedElement.classList.add("unjumbled");
        draggedElement.classList.remove("dragging");
}

/**
 * Checks if the unjumbled word matches the plural target, updates the score
 * @param {Event} event - Drop event in target zone
 */
function dropToTarget(event) {
        event.preventDefault();
        const draggedId = event.dataTransfer.getData("text");
        const draggedElement = document.getElementById(draggedId);
        const targetId = event.target.id;
        const draggedIndex = parseInt(draggedId.split("-")[1]);
        const targetIndex = parseInt(targetId.split("-")[1]);

        // Check if match is correct and update score
        if (draggedElement.classList.contains("unjumbled") && draggedIndex === targetIndex) {
                draggedElement.classList.add("correct");
                event.target.classList.add("correct");
                updateScore(1);
        } else {
                draggedElement.classList.add("incorrect");
                updateScore(-1);
        }
}

/**
 * Updates the score display
 * @param {number} points - Points to add or subtract from the score
 */
function updateScore(points) {
        score += points;
        document.getElementById("scores").textContent = `Score: ${score}`;
}

/**
 * Resets the game state and score
 */
function resetGame() {
        score = 0;
        document.getElementById("scores").textContent = "Score: 0";
        createGame();
        document.getElementById("remarks").textContent = "Status: ";
}