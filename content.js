// Content script: records clicks, key presses, scroll, and can replay.
// It stores the last recorded macro and can export it to popup for saving.
(function(){
let recording = false;
let events = [];
let startTime = 0;
let lastExport = null;


// overlay fake cursor for replay
let fakeCursor = null;
function ensureFakeCursor(){
if (fakeCursor) return;
fakeCursor = document.createElement('div');
fakeCursor.style.position='fixed';
fakeCursor.style.width='14px';
fakeCursor.style.height='14px';
fakeCursor.style.background='red';
fakeCursor.style.borderRadius='50%';
fakeCursor.style.zIndex = 999999999;
fakeCursor.style.pointerEvents = 'none';
fakeCursor.style.transform = 'translate(-50%,-50%)';
fakeCursor.style.display='none';
document.documentElement.appendChild(fakeCursor);
}


function recordEvent(e){
const t = Date.now() - startTime;
const base = {t};
if (e.type === 'click'){
events.push(Object.assign(base,{type:'click', x:e.clientX, y:e.clientY, button: e.button}));
} else if (e.type === 'keydown' || e.type === 'keyup'){
let key = e.key;
events.push(Object.assign(base,{type: e.type, key}));
} else if (e.type === 'scroll'){
events.push(Object.assign(base,{type:'scroll', x: window.scrollX, y: window.scrollY}));
} else if (e.type === 'mousemove'){
// capture but keep sparse: only record if enough time since last
const last = events.length ? events[events.length-1] : null;
if (!last || (t - last.t) > 80){
events.push(Object.assign(base,{type:'move', x:e.clientX, y:e.clientY}));
}
}
}


function startRecording(){
if (recording) return;
recording = true;
events = [];
startTime = Date.now();
window.addEventListener('click', recordEvent, true);
window.addEventListener('keydown', recordEvent, true);
window.addEventListener('keyup', recordEvent, true);
window.addEventListener('scroll', recordEvent, true);
window.addEventListener('mousemove', recordEvent, true);
console.log('recording started');
}


function stopRecording(){
if (!recording) return;
recording = false;
window.removeEventListener('click', recordEvent, true);
window.removeEventListener('keydown', recordEvent, true);
window.removeEventListener('keyup', recordEven
