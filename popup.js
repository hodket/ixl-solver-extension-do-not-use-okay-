document.getElementById("startRecord").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "startRecord" });
        console.log("▶ startRecord sent");
    });
});

document.getElementById("stopRecord").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "stopRecord" });
        console.log("⏹ stopRecord sent");
    });
});

document.getElementById("playMacro").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "playMacro" });
        console.log("🎬 playMacro sent");
    });
});

document.getElementById("clearMacro").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "clearMacro" });
        console.log("🧹 clearMacro sent");
    });
});
