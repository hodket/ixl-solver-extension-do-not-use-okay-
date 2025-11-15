const recordBtn = document.getElementById('recordBtn');
const action = btn.dataset.action;
if (action === 'select') {
selectedMacroId = id;
highlightSelected();
} else if (action === 'rename') {
const newNm = prompt('اكتب اسم جديد للماكرو:');
if (!newNm) return;
chrome.storage.local.get(['macros'], res => {
const macros = res.macros || {};
if (!macros[id]) return alert('غير موجود');
macros[id].name = newNm;
chrome.storage.local.set({macros}, () => loadList());
});
} else if (action === 'delete') {
if (!confirm('تحذف هذا الماكرو؟')) return;
chrome.storage.local.get(['macros'], res => {
const macros = res.macros || {};
delete macros[id];
chrome.storage.local.set({macros}, () => {
if (selectedMacroId === id) selectedMacroId = null;
loadList();
});
});
}
});


saveAsBtn.addEventListener('click', () => {
const nm = (newName.value || '').trim();
if (!nm) return alert('اكتب اسم للحفظ');
// request last exported macro from content script
chrome.runtime.sendMessage({action: 'requestLastExport'}, (resp) => {
if (!resp || !resp.macro) return alert('لا يوجد تسجيل حديث');
const id = Date.now().toString(36);
chrome.storage.local.get(['macros'], res => {
const macros = res.macros || {};
const m = resp.macro;
m.name = nm;
macros[id] = m;
chrome.storage.local.set({macros}, () => { newName.value=''; loadList(); alert('تم الحفظ'); });
});
});
});


function highlightSelected() {
Array.from(macroList.querySelectorAll('.macro')).forEach(div => {
div.style.background = div.querySelector('[data-action="select"]')?.dataset.id === selectedMacroId ? '#eef' : 'transparent';
});
}


function loadList(){
chrome.storage.local.get(['macros'], res => {
renderList(res.macros || {});
});
}


// initial load
loadList();


// listen for external updates
chrome.runtime.onMessage.addListener((msg) => {
if (msg.action === 'updateList') loadList();
});
