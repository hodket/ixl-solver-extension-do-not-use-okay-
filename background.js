// Background used for popup <> content messaging when popup cannot reach content
chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {
if (msg.action === 'requestLastExport') {
// forward to active tab content script to get last exported macro
chrome.tabs.query({active:true,currentWindow:true}, tabs => {
if (!tabs[0]) { sendResp({}); return; }
chrome.tabs.sendMessage(tabs[0].id, {action: 'giveLastExport'}, (res) => {
sendResp(res || {});
});
});
// indicate we'll respond asynchronously
return true;
}
});
