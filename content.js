console.log("content.js LOADED!!!");

let recordedEvents = [];
let isRecording = false;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    
    if (msg.action === "startRecord") {
        recordedEvents = [];
        isRecording = true;
        console.log("🎤 Recording Started...");
    }

    if (msg.action === "stopRecord") {
        isRecording = false;
        console.log("🛑 Recording Stopped");
        sendResponse(recordedEvents); // <-- نرسل الماكرو للـ popup
    }

    if (msg.action === "playMacro") {
        console.log("▶ Replaying macro...");
        playMacro(msg.data);
    }

    return true;
});

document.addEventListener("click", (e) => {
    if (!isRecording) return;

    recordedEvents.push({
        type: "click",
        x: e.clientX,
        y: e.clientY
    });

    console.log("📌 Click:", e.clientX, e.clientY);
});

function playMacro(events) {
    let i = 0;

    function next() {
        if (i >= events.length) {
            console.log("✅ Done");
            return;
        }

        const ev = events[i];

        if (ev.type === "click") {
            const elem = document.elementFromPoint(ev.x, ev.y);
            if (elem) elem.click();
        }

        i++;
        setTimeout(next, 200);
    }

    next();
}
