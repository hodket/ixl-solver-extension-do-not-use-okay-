console.log("content.js LOADED!!!");

// ==========================
// SIMPLE MACRO RECORDER
// ==========================

// Stores recorded events
let recordedEvents = [];
let isRecording = false;

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "startRecord") {
        recordedEvents = [];
        isRecording = true;
        console.log("📌 Recording Started...");
    }

    if (msg.action === "stopRecord") {
        isRecording = false;
        console.log("🛑 Recording Stopped");
    }

    if (msg.action === "playMacro") {
        console.log("▶ Playing Macro...", recordedEvents);
        playMacro();
    }

    if (msg.action === "clearMacro") {
        recordedEvents = [];
        console.log("🧹 Macro Cleared");
    }
});

// Capture mouse clicks
document.addEventListener("click", (e) => {
    if (!isRecording) return;

    recordedEvents.push({
        type: "click",
        x: e.clientX,
        y: e.clientY
    });

    console.log("🖱️ Click saved:", e.clientX, e.clientY);
});

// Capture keyboard keys
document.addEventListener("keydown", (e) => {
    if (!isRecording) return;

    recordedEvents.push({
        type: "key",
        key: e.key
    });

    console.log("⌨️ Key saved:", e.key);
});

// ==========================
// PLAYBACK FUNCTION
// ==========================
function playMacro() {
    let i = 0;

    function next() {
        if (i >= recordedEvents.length) {
            console.log("✅ Finished Playback");
            return;
        }

        const ev = recordedEvents[i];

        if (ev.type === "click") {
            console.log("💥 Replaying click at", ev.x, ev.y);

            const elem = document.elementFromPoint(ev.x, ev.y);
            if (elem) elem.click();
        }

        if (ev.type === "key") {
            console.log("⌨️ Replaying key:", ev.key);

            const keyboardEvent = new KeyboardEvent("keydown", { key: ev.key });
            document.activeElement.dispatchEvent(keyboardEvent);
        }

        i++;
        setTimeout(next, 200); // delay between actions
    }

    next();
}
