/* Suara: efek bunyi (WebAudio) dan bacaan.
   Bacaan memakai suara bawaan HP. Untuk suara yang lebih natural, isi CLIPS dengan
   rekaman (lihat README, bagian "Suara yang lebih natural"). */

export const settings = { sound: true };

let ac = null;
export function ctx() {
  try {
    if (!ac) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (C) ac = new C();
    }
    if (ac && ac.state === 'suspended') ac.resume();
  } catch (e) {}
  return ac;
}

function tone(freq, t0, dur, type, vol) {
  const a = ctx();
  if (!a || !settings.sound) return;
  try {
    const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + t0;
    o.type = type || 'triangle';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol || 0.18, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(a.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  } catch (e) {}
}

export const sfx = {
  pop() { tone(660, 0, .12); },
  ok() { tone(523, 0, .15); tone(659, .12, .15); tone(784, .24, .32); },
  no() { tone(300, 0, .18, 'sine', .14); tone(240, .15, .25, 'sine', .14); },
  win() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * .13, .35)); }
};

let voice = null;
function pickVoice() {
  try { voice = speechSynthesis.getVoices().find(v => /^id/i.test(v.lang)) || null; } catch (e) {}
}
if ('speechSynthesis' in window) {
  pickVoice();
  try { speechSynthesis.onvoiceschanged = pickVoice; } catch (e) {}
}

/* Rekaman suara (opsional). Kunci = kalimat persis seperti yang diucapkan game,
   nilai = alamat berkas audio. Contoh:
     'Coba lagi ya!': 'assets/audio/coba-lagi.mp3'
   Kalimat yang tidak terdaftar tetap dibacakan suara HP. */
export const CLIPS = {};

let clip = null;
export function stopVoice() {
  try { if (clip) { clip.pause(); clip = null; } } catch (e) {}
  try { speechSynthesis.cancel(); } catch (e) {}
}

export function say(text) {
  if (!settings.sound) return;
  stopVoice();
  if (CLIPS[text]) {
    try { clip = new Audio(CLIPS[text]); clip.play().catch(() => {}); return; } catch (e) {}
  }
  if (!('speechSynthesis' in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'id-ID';
    if (voice) u.voice = voice;
    u.rate = .85;
    u.pitch = 1.2;
    speechSynthesis.speak(u);
  } catch (e) {}
}
