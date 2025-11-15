// Start Recording
document.getElementById("recordBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "startRecord" });
        console.log("▶ startRecord sent");
    });

    document.getElementById("recordBtn").disabled = true;
    document.getElementById("stopBtn").disabled = false;
});

// Stop Recording
document.getElementById("stopBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "stopRecord" });
        console.log("⏹ stopRecord sent");
    });

    document.getElementById("recordBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;
});

// Play Macro
document.getElementById("playBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "playMacro" });
        console.log("🎬 playMacro sent");
    });
});

// Save Macro (NEW)
document.getElementById("saveAsBtn").addEventListener("click", () => {
    const name = document.getElementById("newName").value.trim();
    if (!name) return alert("اكتب اسم للماكرو");

    chrome.storage.local.set({ savedMacroName: name }, () => {
        console.log("💾 Saved macro name:", name);
        alert("تم حفظ الاسم");
    });
});
