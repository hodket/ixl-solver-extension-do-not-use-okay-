let macros = [];
let selectedMacro = null;

// DOM
const list = document.getElementById("macroList");
const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const playBtn = document.getElementById("playBtn");
const saveAsBtn = document.getElementById("saveAsBtn");
const newName = document.getElementById("newName");

// Load saved macros عند فتح popup
chrome.storage.local.get("macros", (res) => {
    macros = res.macros || [];
    renderList();
});

// Start recording
recordBtn.addEventListener("click", () => {
    recordBtn.disabled = true;
    stopBtn.disabled = false;

    chrome.tabs.query({ active: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "startRecord" });
    });
});

// Stop recording
stopBtn.addEventListener("click", () => {
    stopBtn.disabled = true;
    recordBtn.disabled = false;

    chrome.tabs.query({ active: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "stopRecord" }, (events) => {

            if (!events || !events.length) {
                alert("مافي تسجيل!");
                return;
            }

            const name = "Macro " + (macros.length + 1);

            macros.push({ name, events });
            chrome.storage.local.set({ macros });

            renderList();
        });
    });
});

// Play selected macro
playBtn.addEventListener("click", () => {
    if (selectedMacro === null) return alert("اختر ماكرو!");

    const macro = macros[selectedMacro];

    chrome.tabs.query({ active: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "playMacro",
            data: macro.events
        });
    });
});

// Save macro name
saveAsBtn.addEventListener("click", () => {
    if (selectedMacro === null) return alert("اختر ماكرو!");
    if (!newName.value.trim()) return;

    macros[selectedMacro].name = newName.value.trim();
    chrome.storage.local.set({ macros });
    renderList();
});

// Render macro list
function renderList() {
    list.innerHTML = "";

    if (macros.length === 0) {
        list.innerHTML = "<div>لا يوجد ماكروز محفوظة.</div>";
        return;
    }

    macros.forEach((m, i) => {
        const div = document.createElement("div");
        div.className = "macro";
        div.innerHTML = `
            <div class="meta">${m.name}</div>
            <button data-id="${i}" class="selectBtn">اختيار</button>
            <button data-id="${i}" class="delBtn">🗑️</button>
        `;
        list.appendChild(div);
    });

    document.querySelectorAll(".selectBtn").forEach(btn => {
        btn.onclick = () => {
            selectedMacro = Number(btn.getAttribute("data-id"));
            console.log("selected macro =", selectedMacro);
        };
    });

    document.querySelectorAll(".delBtn").forEach(btn => {
        btn.onclick = () => {
            const id = Number(btn.getAttribute("data-id"));
            macros.splice(id, 1);
            chrome.storage.local.set({ macros });
            renderList();
        };
    });
}
