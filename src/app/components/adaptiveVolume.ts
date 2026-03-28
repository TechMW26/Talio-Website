/**
 * Adaptive pop-sound volume — inversely proportional to estimated system volume.
 *
 * Scale range: 100 % (quiet system) → 40 % (loud system).
 *
 * Uses a sub-audible Web Audio API reference oscillator + AnalyserNode to
 * detect system-level volume changes.  Detection fidelity varies by
 * browser/platform; when detection is unavailable the pop volume stays at its
 * base value (no change).
 */

let _ctx: AudioContext | null = null;
let _analyser: AnalyserNode | null = null;
let _baseline = -1;
let _ratio = 1.0;
let _inited = false;
const _buf = new Float32Array(128);

function _init() {
  if (_inited) return;
  _inited = true;

  try {
    _ctx = new AudioContext();

    const osc = _ctx.createOscillator();
    const gain = _ctx.createGain();
    _analyser = _ctx.createAnalyser();
    _analyser.fftSize = 256;

    // 20 Hz — below audible range on most speakers
    osc.frequency.value = 20;
    // 0.0001 gain — essentially silent
    gain.gain.value = 0.0001;

    osc.connect(gain);
    gain.connect(_analyser);
    _analyser.connect(_ctx.destination);
    osc.start();

    // First measurement establishes the baseline
    setTimeout(_measure, 200);
    // Re-measure every 2 s to track volume changes
    setInterval(_measure, 2000);
  } catch {
    /* AudioContext unavailable — graceful fallback */
  }
}

function _measure() {
  if (!_analyser) return;

  _analyser.getFloatTimeDomainData(_buf);

  let sum = 0;
  for (let i = 0; i < _buf.length; i++) sum += _buf[i] * _buf[i];
  const rms = Math.sqrt(sum / _buf.length);

  if (_baseline < 0 && rms > 1e-10) {
    _baseline = rms; // calibrate baseline on first valid reading
  } else if (_baseline > 1e-10) {
    _ratio = rms / _baseline;
  }
}

/**
 * Returns `baseVolume` scaled inversely to estimated system volume.
 *
 * - System quiet  → scale = 1.0  (100 %)
 * - System loud   → scale = 0.4  (40 %)
 */
export function adaptiveVolume(baseVolume: number): number {
  _init();

  // ratio ≤ 1 ⇒ system same or quieter than baseline → full pop volume
  // ratio > 1 ⇒ system louder → reduce pop proportionally, floor at 40 %
  const scale = _ratio <= 1.0 ? 1.0 : Math.max(0.4, 1.0 / _ratio);
  return baseVolume * scale;
}
