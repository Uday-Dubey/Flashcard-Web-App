// Siderbar Script
const body = document.querySelector("body");
const sidebar = body.querySelector(".sidebar");
const toggle = body.querySelector(".toggle");
const searchBtn = body.querySelector(".search-box");
const modeSwitch = body.querySelector(".toggle-switch");
const modeText = body.querySelector(".mode-text");

// Check localStorage for the current mode state
const currentMode = localStorage.getItem("mode");

// Apply the saved mode state on page load
if (currentMode === "dark") {
    body.classList.add("dark");
    modeText.innerText = "Light Mode";
} else {
    body.classList.remove("dark");
    modeText.innerText = "Dark Mode";
}

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});

modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");

    // Update the mode text and save the current state to localStorage
    if (body.classList.contains("dark")) {
        modeText.innerText = "Light Mode";
        localStorage.setItem("mode", "dark");
    } else {
        modeText.innerText = "Dark Mode";
        localStorage.setItem("mode", "light");
    }
});

// Flashcard Script
document.addEventListener("DOMContentLoaded", async function () {
    const container = document.querySelector(".container");
    const addFlashcardBtn = document.querySelector(".floating-btn");
    const popupOverlay = document.querySelector(".popup-overlay");
    const popupInputs = document.querySelectorAll(".popup-input");
    const confirmBtn = document.querySelector(".popup-button.confirm");
    const cancelBtn = document.querySelector(".popup-button.cancel");
    let userId;
    let folderId = new URLSearchParams(window.location.search).get("folderId");
    let editFlashcardId = null;

    if (!container || !folderId) return;

    async function getUserId() {
        try {
            const response = await fetch("/api/auth/user");
            const data = await response.json();
            userId = data.userId;
        } catch (error) {
            console.error("Error fetching user ID:", error);
        }
    }

    async function fetchFlashcards() {
        try {
            const response = await fetch(`/api/flashcard/folder/${folderId}`);
            const data = await response.json();
            if (data.flashcards) {
                container.innerHTML = "";
                data.flashcards.forEach(flashcard => addFlashcard(flashcard._id, flashcard.question, flashcard.answer));
            }
        } catch (error) {
            console.error("Error fetching flashcards:", error);
        }
    }

    function addFlashcard(id, question = "New Question", answer = "New Answer") {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card-container");
        cardDiv.dataset.id = id;
        cardDiv.innerHTML = `
            <div class="card">
                <div class="card-inner">
                    <div class="card-front">
                        <div class="image-container2"><h1>Question</h1></div>
                        <div class="text-container">
                            <p class="question-text">${question}</p> 
                            <button class="flip-btn">Flip Card</button>
                        </div>
                    </div>
                    <div class="card-back">
                        <div class="text-container">
                            <h1>Answer</h1>
                            <p class="answer-text">${answer}</p>
                            <button class="flip-btn">Flip Back</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="icon-container">
                <button class="edit"><ion-icon name="create-outline" class="card-icon"></ion-icon></button>
                <button class="delete"><ion-icon name="trash-outline" class="card-icon"></ion-icon></button>
            </div>
        `;
        container.appendChild(cardDiv);
    }

    container.addEventListener("click", async function (event) {
        const target = event.target;
        const cardContainer = target.closest(".card-container");
        if (!cardContainer) return;

        if (target.classList.contains("flip-btn")) {
            cardContainer.classList.toggle("flipped");
        }

        if (target.closest(".edit")) {
            editFlashcardId = cardContainer.dataset.id;
            popupInputs[0].value = cardContainer.querySelector(".question-text").textContent;
            popupInputs[1].value = cardContainer.querySelector(".answer-text").textContent;
            popupOverlay.style.display = "flex";
        }

        if (target.closest(".delete")) {
            try {
                const response = await fetch(`/api/flashcard/${cardContainer.dataset.id}`, {
                    method: "DELETE"
                });
                if (response.ok) {
                    cardContainer.remove();
                } else {
                    alert("Failed to delete flashcard!");
                }
            } catch (error) {
                console.error("Error deleting flashcard:", error);
            }
        }
    });

    addFlashcardBtn.addEventListener("click", function () {
        editFlashcardId = null;
        popupInputs[0].value = "";
        popupInputs[1].value = "";
        popupOverlay.style.display = "flex";
    });

    cancelBtn.addEventListener("click", function () {
        popupOverlay.style.display = "none";
    });

    confirmBtn.addEventListener("click", async function () {
        const question = popupInputs[0].value.trim();
        const answer = popupInputs[1].value.trim();
        if (!question || !answer) return;

        if (editFlashcardId) {
            try {
                const response = await fetch(`/api/flashcard/${editFlashcardId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ question, answer })
                });
                if (response.ok) {
                    document.querySelector(`[data-id='${editFlashcardId}'] .question-text`).textContent = question;
                    document.querySelector(`[data-id='${editFlashcardId}'] .answer-text`).textContent = answer;
                } else {
                    alert("Failed to update flashcard!");
                }
            } catch (error) {
                console.error("Error updating flashcard:", error);
            }
        } else {
            try {
                const response = await fetch("/api/flashcard", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ question, answer, folderId })
                });
                const data = await response.json();
                if (response.ok) {
                    addFlashcard(data.flashcard._id, data.flashcard.question, data.flashcard.answer);
                } else {
                    alert("Failed to create flashcard!");
                }
            } catch (error) {
                console.error("Error creating flashcard:", error);
            }
        }
        popupOverlay.style.display = "none";
    });

    await getUserId();
    await fetchFlashcards();
});



// Logout script
document.querySelectorAll('.logoutbtn').forEach(button => {
    button.addEventListener("click", async () => {
        try {
            const response = await fetch("/api/auth/logout", { method: "POST" });

            if (response.ok) {
                window.location.href = "/";
                console.log('Logged out Successfully');
            } else {
                alert("Logout Failed!");
            }
        } catch (error) {
            console.error("Error in logging out: ", error);
        }
    });
});