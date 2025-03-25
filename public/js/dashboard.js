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

// Folder Script
document.addEventListener("DOMContentLoaded", async function () {
    const section = document.getElementById("section1");
    const addSubjectBtn = document.querySelector(".floating-btn");
    const popupOverlay = document.querySelector(".popup-overlay");
    const popupInput = document.querySelector(".popup-input");
    const confirmBtn = document.querySelector(".popup-button.confirm");
    const cancelBtn = document.querySelector(".popup-button.cancel");
    let userId;
    let editFolderId = null;

    async function fetchFolders() {
        try {
            const userResponse = await fetch("/api/auth/user");
            const userData = await userResponse.json();
            userId = userData.userId; 
            const response = await fetch(`/api/folder/user/${userId}`);
            const data = await response.json();
            if (data.folders) {
                document.querySelectorAll(".folder").forEach(folder => folder.remove());
                data.folders.forEach(folder => addSubject(folder.name, folder._id));
            }
        } catch (error) {
            console.error("Error fetching folders:", error);
        }
    }

    function addSubject(name, folderId) {
        const folderDiv = document.createElement("div");
        folderDiv.classList.add("folder");
        folderDiv.dataset.id = folderId;
        folderDiv.innerHTML = `
            <span class="subject-name">${name}</span>
            <div class="icon-container">  
                <button class="add-card" data-folder-id="${folderId}"><ion-icon name="add-circle-outline" class="folder-icon"></ion-icon></button>
                <button class="open" data-folder-id="${folderId}"><ion-icon name="open-outline" class="folder-icon"></ion-icon></button>
                <button class="edit" data-folder-id="${folderId}"><ion-icon name="create-outline" class="folder-icon"></ion-icon></button>
                <button class="delete" data-folder-id="${folderId}"><ion-icon name="trash-outline" class="folder-icon"></ion-icon></button>
            </div>
        `;

        folderDiv.querySelector(".edit").addEventListener("click", function () {
            editFolderId = folderId;
            popupInput.value = name;
            popupOverlay.style.display = "flex"; // Show popup only when edit button is clicked
        });

        folderDiv.querySelector(".delete").addEventListener("click", async function () {
            const response = await fetch(`/api/folder/${folderId}`, { method: "DELETE" });
            if (response.ok) {
                section.removeChild(folderDiv);
            } else {
                alert("Failed to delete folder!");
            }
        });

        folderDiv.querySelector(".add-card").addEventListener("click", async function (event) {
            const folderId = event.currentTarget.dataset.folderId;
            const question = "New Question";
            const answer = "New Answer";
            try {
                const response = await fetch("/api/flashcard", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ question, answer, folderId: folderId })
                });
                if (response.ok) {
                    window.location.href = `/flashcard?folderId=${folderId}`;
                } else {
                    alert("Failed to create flashcard!");
                }
            } catch (error) {
                console.error("Error creating flashcard:", error);
            }
        });

        folderDiv.querySelector(".open").addEventListener("click", function (event) {
            const folderId = event.currentTarget.dataset.folderId;
            window.location.href = `/flashcard?folderId=${folderId}`;
        });

        section.appendChild(folderDiv);
    }

    addSubjectBtn.addEventListener("click", function () {
        editFolderId = null;
        popupInput.value = "";
        popupOverlay.style.display = "flex"; // Show popup only when floating button is clicked
    });

    cancelBtn.addEventListener("click", function () {
        popupOverlay.style.display = "none"; // Hide popup when cancel button is clicked
        popupInput.value = "";
    });

    confirmBtn.addEventListener("click", async function () {
        const folderName = popupInput.value.trim();
        if (!folderName) return;

        if (editFolderId) {
            try {
                const response = await fetch(`/api/folder/${editFolderId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: folderName })
                });
                if (response.ok) {
                    document.querySelector(`[data-id='${editFolderId}'] .subject-name`).textContent = folderName;
                } else {
                    alert("Failed to update folder!");
                }
            } catch (error) {
                console.error("Error updating folder:", error);
            }
        } else {
            try {
                const response = await fetch("/api/folder", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: folderName, user: userId })
                });
                const data = await response.json();
                if (response.ok) {
                    addSubject(data.folder.name, data.folder._id);
                } else {
                    alert("Failed to create folder!");
                }
            } catch (error) {
                console.error("Error creating folder:", error);
            }
        }
        popupOverlay.style.display = "none"; // Hide popup after confirmation
        popupInput.value = "";
    });

    await fetchFolders(); // Fetch folders on page load
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
