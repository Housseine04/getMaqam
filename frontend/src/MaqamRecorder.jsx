import { useState, useRef, useEffect } from 'react';

/* ─── Oud SVG ──────────────────────────────────────────────────────────────── */
function OudSVG({ stringsAnimating = false, style = {} }) {
  const BODY =
    `M 100,148
   C 72,148 18,185 10,240  
   C 0,295 0,355 16,395 
   C 30,428 62,450 100,453 
   C 138,450 170,428 184,395 
   C 200,355 200,295 190,240 
   C 182,185 128,148 100,148 Z`;
  const SH_CY = 310, SH_R = 46, STR_Y1 = 150, STR_Y2 = 408;
  const STR_MID = (STR_Y1 + STR_Y2) / 2;
  /*const stringXs = [85, 91, 97, 103, 109, 115];*/
  const stringXs = [92, 95, 98, 101, 104, 107];
  return (
    <svg viewBox="0 0 200 495" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', ...style }}>
      <defs>
        <radialGradient id="bG" cx="34%" cy="26%" r="72%">
          <stop offset="0%" stopColor="#f0b468" /><stop offset="20%" stopColor="#c07c2e" />
          <stop offset="55%" stopColor="#7a3e14" /><stop offset="100%" stopColor="#250e04" />
        </radialGradient>
        <radialGradient id="bS" cx="24%" cy="16%" r="50%">
          <stop offset="0%" stopColor="#fff8d0" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#fff8d0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#030100" /><stop offset="100%" stopColor="#140600" />
        </radialGradient>
        <linearGradient id="nG" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#381a06" /><stop offset="40%" stopColor="#8a5228" />
          <stop offset="65%" stopColor="#7a4820" /><stop offset="100%" stopColor="#261002" />
        </linearGradient>
        <linearGradient id="pG" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#220e08" /><stop offset="50%" stopColor="#562e0e" />
          <stop offset="100%" stopColor="#180a04" />
        </linearGradient>
        <filter id="oS" x="-22%" y="-6%" width="155%" height="120%">
          <feDropShadow dx="4" dy="14" stdDeviation="14" floodColor="#000" floodOpacity="0.60" />
        </filter>
        <clipPath id="bC"><path d={BODY} /></clipPath>
      </defs>
      <path d={BODY} fill="url(#bG)" filter="url(#oS)" />
      <path d={BODY} fill="url(#bS)" />
      <g clipPath="url(#bC)" stroke="#6e3808" strokeWidth="0.6" strokeOpacity="0.16" fill="none">
        <line x1="100" y1="148" x2="100" y2="455" />
        {[[-5, -12, -16], [5, 12, 16]].map(([a, b, c], s) =>
          [148, 152, 150, 149].map((y, i) => (
            <path key={`${s}${i}`} d={`M100,${y} C${100 + a * (i + 1)},${200 + i * 30} ${100 + b * (i + 1)},${320 + i * 20} ${100 + c * (i + 1)},455`} />
          ))
        )}
      </g>
      <path d={BODY} fill="none" stroke="#b87030" strokeWidth="2.0" />
      <path d={BODY} fill="none" stroke="#6a3610" strokeWidth="0.6" strokeOpacity="0.35" transform="scale(0.97) translate(3,7)" />
      <circle cx="100" cy={SH_CY} r={SH_R} fill="url(#hG)" />
      <circle cx="100" cy={SH_CY} r={SH_R + 1} fill="none" stroke="#b87030" strokeWidth="1.5" />
      <circle cx="100" cy={SH_CY} r={SH_R - 7} fill="none" stroke="#d09848" strokeWidth="0.5" strokeOpacity="0.48" />
      <circle cx="100" cy={SH_CY} r={SH_R - 18} fill="none" stroke="#b87030" strokeWidth="0.35" strokeOpacity="0.32" />
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2 - Math.PI / 2; return (
          <circle key={i} cx={100 + Math.cos(a) * (SH_R + 1)} cy={SH_CY + Math.sin(a) * (SH_R + 1)} r="1.5" fill="#d09848" opacity="0.6" />
        );
      })}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2, a2 = ((i + .5) / 8) * Math.PI * 2; return (
          <line key={i} x1={100 + Math.cos(a) * (SH_R - 9)} y1={SH_CY + Math.sin(a) * (SH_R - 9)}
            x2={100 + Math.cos(a2) * (SH_R - 22)} y2={SH_CY + Math.sin(a2) * (SH_R - 22)}
            stroke="#b87030" strokeWidth="0.5" strokeOpacity="0.42" />
        );
      })}
      {stringXs.map((x, i) => (
        <line key={i} x1={x} y1={STR_Y1} x2={x} y2={STR_Y2} stroke="#ddd090"
          strokeWidth={0.6 + i * 0.1} strokeOpacity="0.85"
          style={stringsAnimating ? {
            transformOrigin: `${x}px ${STR_MID}px`,
            animation: `sv ${0.082 + i * 0.009}s ${i * 0.06}s ease-in-out infinite alternate`
          } : {}} />
      ))}
      <path d="M72,406 Q100,400 128,406 L126,418 Q100,414 74,418 Z" fill="#582e0e" />
      <path d="M72,406 Q100,401 128,406" fill="none" stroke="#b87030" strokeWidth="1.0" />
      <path d="M75,407 Q100,402 125,407" fill="none" stroke="#ddd090" strokeWidth="1.2" strokeOpacity="0.5" />
      <rect x="96" y="418" width="8" height="10" rx="2" fill="#3e1c06" />
      <path d="M91,152 C90,128 90,78 92,20 L108,20 C110,78 110,128 109,152 Z" fill="url(#nG)" />
      <path d="M93,152 C92,126 92,80 93,22 L107,22 C108,80 108,126 107,152 Z" fill="#100800" />
      {[62, 86, 110].map((y, i) => <circle key={i} cx="100" cy={y} r="1.2" fill="#6e4018" opacity="0.48" />)}
      <rect x="91" y="16" width="18" height="5" rx="1.5" fill="#ddd090" />
      <g transform="rotate(-88, 100, 18)">
        <rect x="88" y="-24" width="24" height="54" rx="4" fill="url(#pG)" />
        <rect x="92" y="-22" width="16" height="50" rx="2" fill="#0c0400" fillOpacity="0.6" />
        <path d="M88,-24 Q94,-38 100,-42 Q106,-38 112,-24" fill="#280e04" stroke="#402408" strokeWidth="0.8" />
        <circle cx="100" cy="-34" r="4" fill="#583414" /><circle cx="100" cy="-34" r="1.8" fill="#2c1606" />
        {[0, 1, 2, 3].map(i => (
          <g key={`l${i}`}>
            <line x1="88" y1={-12 + i * 12} x2="80" y2={-12 + i * 12} stroke="#4c2608" strokeWidth="1.6" />
            <ellipse cx="77" cy={-12 + i * 12} rx="4.8" ry="3" fill="#784618" stroke="#b87030" strokeWidth="0.6" />
          </g>
        ))}
        {[0, 1, 2, 3].map(i => (
          <g key={`r${i}`}>
            <line x1="112" y1={-6 + i * 12} x2="120" y2={-6 + i * 12} stroke="#4c2608" strokeWidth="1.6" />
            <ellipse cx="123" cy={-6 + i * 12} rx="4.8" ry="3" fill="#784618" stroke="#b87030" strokeWidth="0.6" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ─── Confidence Arc ───────────────────────────────────────────────────────── */
function ConfidenceArc({ score }) {
  const r = 52, circ = 2 * Math.PI * r, arc = circ * Math.min(score, 100) / 100;
  return (
    <div className="conf-wrap">
      <svg viewBox="0 0 130 130" width="110" height="110">
        <defs>
          <linearGradient id="aG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b87830" /><stop offset="100%" stopColor="#e8c060" />
          </linearGradient>
        </defs>
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(184,120,48,0.1)" strokeWidth="3.5" />
        <circle cx="65" cy="65" r={r} fill="none" stroke="url(#aG)" strokeWidth="3.5"
          strokeLinecap="round" strokeDasharray={`${arc} ${circ}`}
          transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dasharray 1.6s cubic-bezier(0.22,1,0.36,1)' }} />
        <text x="65" y="60" textAnchor="middle" dy="0.35em"
          fontFamily="'DM Mono',monospace" fontWeight="400" fontSize="26" fill="#e8c060">{score}</text>
        <text x="65" y="78" textAnchor="middle"
          fontFamily="'DM Sans',sans-serif" fontSize="6" letterSpacing="3"
          fill="#b87830" opacity="0.6">CONFIDENCE</text>
      </svg>
    </div>
  );
}

/* ─── Stage constants ──────────────────────────────────────────────────────── */
const STAGE = {
  LANDING: 'landing', TRANSITIONING: 'transitioning',
  RECORDING: 'recording', ANALYZING: 'analyzing', RESULTS: 'results',
};

/* ─── Main ─────────────────────────────────────────────────────────────────── */
export default function MaqamRecorder() {
  const [stage, setStage] = useState(STAGE.LANDING);
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);
  const waveRef = useRef(null);
  const rafRef = useRef(null);

  /* Live waveform — Web Audio API drives bar heights at 60 fps */
  useEffect(() => {
    if (!isRecording || !analyserRef.current || !waveRef.current) return;
    const analyser = analyserRef.current;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const bars = waveRef.current?.children;
      if (bars) {
        for (let i = 0; i < bars.length; i++) {
          const idx = Math.round(i * data.length / bars.length);
          const v = (data[idx] || 0) / 255;
          bars[i].style.height = `${6 + v * 66}px`;
          bars[i].style.opacity = String(0.28 + v * 0.72);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(rafRef.current);
  }, [isRecording]);

  /* ── Handlers ────────────────────────────────────────────────────────────── */
  const handleOudClick = () => {
    if (stage !== STAGE.LANDING) return;
    setStage(STAGE.TRANSITIONING);
    setTimeout(() => setStage(STAGE.RECORDING), 900);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, autoGainControl: false, noiseSuppression: false }
      });
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.82;
      src.connect(analyser);
      analyserRef.current = analyser;
      audioCtxRef.current = ctx;

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = e => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        sendToBackend(new Blob(audioChunksRef.current));
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError(null);
    } catch {
      setError('Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      cancelAnimationFrame(rafRef.current);
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      audioCtxRef.current?.close();
      setStage(STAGE.ANALYZING);
    }
  };

  const sendToBackend = async (blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'recording.webm');
    try {
      const response = await fetch('http://getmaqam.railway.internal/analyze-audio', {
        method: 'POST', body: formData,
      });
      const data = await response.json();
      if (data.status === 'success') setResults(data.results);
      else setError(data.error || 'Could not identify the Maqam.');
    } catch {
      setError('Failed to connect to the analysis server. Is Python running?');
    } finally {
      setTimeout(() => setStage(STAGE.RESULTS), 600);
    }
  };

  const reset = () => {
    setStage(STAGE.LANDING);
    setResults(null);
    setError(null);
    setIsRecording(false);
  };

  /* Search again → back to the record page (not the landing page) */
  const searchAgain = () => {
    setResults(null);
    setError(null);
    setIsRecording(false);
    setStage(STAGE.RECORDING);
  };

  /* Oud CSS class drives the whole position state-machine */
  const oudClass = {
    [STAGE.LANDING]: 'o-land',
    [STAGE.TRANSITIONING]: 'o-trans',
    [STAGE.RECORDING]: 'o-corner',
    [STAGE.ANALYZING]: 'o-analyze',
    [STAGE.RESULTS]: 'o-fade',
  }[stage];

  const primary = results?.[0];

  return (
    <>
      <style>{CSS}</style>
      <div className="shell">

        {/* Noise grain */}
        <div className="grain" aria-hidden />

        {/* ═══════════════════════════════════ LANDING ═══ */}
        {stage === STAGE.LANDING && (
          <div className="land-split" onClick={handleOudClick}
            role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && handleOudClick()}>
            {/* Left panel — empty, oud is fixed over here */}
            <div className="land-left" aria-hidden />
            {/* Thin vertical divider */}
            <div className="land-div" aria-hidden />
            {/* Right panel — editorial title block */}
            <div className="land-right">
              <h1 className="land-h1">Maqam<br />Finder</h1>
              <div className="land-rule" />
              <p className="land-desc">
                An instrument for identifying<br />Arabic musical scales
              </p>
              <p className="land-cta">
                Touch the oud to begin
                <span className="cta-arrow">→</span>
              </p>
            </div>
          </div>
        )}

        {/* Buy-me-a-coffee — bottom-right, label rolls out left on hover */}
        {stage === STAGE.LANDING && (
          <a
            className="coffee-fab"
            href="https://paypal.me/Housseine23"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Donate"
          >
            <span className="coffee-text">Buy me a coffee if the application helps :)</span>
            <span className="coffee-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 8.5h12.5v5.5a4.5 4.5 0 0 1-4.5 4.5H8.5A4.5 4.5 0 0 1 4 14V8.5Z"
                  stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M16.5 9.5h2.25a2.25 2.25 0 0 1 0 4.5H16.5"
                  stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M7.5 2.5c-.6.8-.6 1.7 0 2.5M11 2.5c-.6.8-.6 1.7 0 2.5"
                  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
              </svg>
            </span>
          </a>
        )}

        {/* ═══════════════════════════════════ RECORDING ═══ */}
        {stage === STAGE.RECORDING && (
          <div className="rec-panel">
            {/* Back to landing */}
            <button className="back-btn" onClick={reset} aria-label="Back to start">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M14.5 5.5 8 12l6.5 6.5" stroke="currentColor"
                  strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="rec-header">
              <span className="tag">Ready to record · The oud listens</span>
              <h2 className="rec-h2">Sing, hum<br />or play</h2>
            </div>

            {/* Real-time frequency waveform */}
            <div className="wave-scene">
              <div ref={waveRef} className={`wave-bars${isRecording ? ' live' : ''}`}>
                {Array.from({ length: 38 }, (_, i) => (
                  <span key={i} className="wb" style={{ animationDelay: `${i * 0.042}s` }} />
                ))}
              </div>
              <div className="wave-center-line" />
            </div>

            <div className="rec-footer">
              {!isRecording ? (
                <button className="btn-rec" onClick={startRecording}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginRight: 8 }}>
                    <rect x="4.5" y="1" width="5" height="8" rx="2.5" fill="currentColor" />
                    <path d="M1.5 7a5.5 5.5 0 0 0 11 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    <line x1="7" y1="12.5" x2="7" y2="14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  Start Recording
                </button>
              ) : (
                <button className="btn-stop" onClick={stopRecording}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginRight: 8 }}>
                    <rect x="2" y="2" width="8" height="8" rx="2" fill="currentColor" />
                  </svg>
                  Stop &amp; Analyze
                </button>
              )}
              {isRecording && (
                <div className="live-row">
                  <span className="live-dot" /><span className="live-txt">Live</span>
                </div>
              )}
            </div>
            {error && <p className="err">{error}</p>}
          </div>
        )}

        {/* ═══════════════════════════════════ ANALYZING ═══ */}
        {stage === STAGE.ANALYZING && (
          <div className="analyze-ui">
            <span className="tag">Processing</span>
            <p className="analyze-label">Identifying your Maqam</p>
            <div className="pulse-row">
              {[12, 24, 38, 18, 32, 12, 26].map((h, i) => (
                <span key={i} className="pd" style={{ height: h, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════ RESULTS ═══ */}
        {stage === STAGE.RESULTS && (
          <div className="results">

            {!primary && error ? (
              <div className="res-err">
                <p>{error}</p>
                <button className="btn-ghost" onClick={searchAgain}>Try Again</button>
              </div>
            ) : primary ? (
              <div className="res-body">

                {/* ── Huge maqam name block ── */}
                <div className="res-name-block">
                  <span className="tag" style={{ marginBottom: 20 }}>Primary Match</span>
                  <h2 className="res-name">
                    {primary.possible_maqamat?.[0]?.name || primary.base_jins}
                  </h2>
                  {primary.possible_maqamat?.[0]?.familyName && (
                    <p className="res-family">
                      {primary.possible_maqamat[0].familyName} <span className="res-family-sep">·</span> Family
                    </p>
                  )}
                </div>

                {/* ── Horizontal rule ── */}
                <div className="res-rule" />

                {/* ── Metrics row ── */}
                <div className="res-metrics">
                  <ConfidenceArc score={primary.confidence_score || 0} />
                  <div className="res-pills">
                    {primary.hypothesized_tonic_id !== undefined && (
                      <div className="pill">
                        <svg width="9" height="9" viewBox="0 0 9 9" style={{ marginRight: 6 }}>
                          <circle cx="4.5" cy="4.5" r="3.2" fill="none" stroke="#b87830" strokeWidth="1.4" />
                          <circle cx="4.5" cy="4.5" r="1.4" fill="#b87830" />
                        </svg>
                        Root · {primary.root_solfege}
                      </div>
                    )}
                    <div className="pill">
                      <svg width="9" height="9" viewBox="0 0 9 9" style={{ marginRight: 6 }}>
                        <circle cx="4.5" cy="4.5" r="3.2" fill="none" stroke="#b87830" strokeWidth="1.4" />
                      </svg>
                      {primary.confidence_score}% Match
                    </div>
                  </div>
                </div>

                {/* ── Possible maqamat ── 
                {primary.possible_maqamat?.length > 0 && (
                  <div className="res-section">
                    <p className="sec-label">Possible Maqamat</p>
                    <div className="maqam-grid">
                      {primary.possible_maqamat.map((m, i) => (
                        <div key={m.id || i} className="maqam-chip"
                          style={{ animationDelay: `${i * 0.07}s` }}>
                          <span className="chip-name">Maqam {m.name}</span>
                          <span className="chip-dot">·</span>
                          <span className="chip-fam">{m.familyName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                */}

                {/* ── Other possibilities ── */}
                {results.length > 1 && (
                  <div className="res-section">
                    <p className="sec-label">Other Possibilities</p>
                    {results.slice(1, 4).map((alt, i) => (
                      <div key={i} className="alt-row" style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
                        <span className="alt-name">
                          {alt.possible_maqamat?.[0]?.name || alt.base_jins}
                        </span>
                        <div className="alt-bar-track">
                          <div className="alt-bar-fill"
                            style={{
                              '--w': `${alt.confidence_score || 0}%`,
                              animationDelay: `${0.45 + i * 0.08}s`
                            }} />
                        </div>
                        <span className="alt-pct">{alt.confidence_score}%</span>
                      </div>
                    ))}
                  </div>
                )}

                <button className="btn-ghost" onClick={searchAgain} style={{ marginTop: 44 }}>
                  Search Again
                </button>
              </div>
            ) : (
              <div className="res-err">
                <p>No maqam identified. Try a clearer recording.</p>
                <button className="btn-ghost" onClick={searchAgain}>Try Again</button>
              </div>
            )}
          </div>
        )}

        {/* ═══ OUD — persistent, CSS class drives position ═══ */}
        {stage !== STAGE.RESULTS && (
          <div className={`oud ${oudClass}`}
            onClick={stage === STAGE.LANDING ? handleOudClick : undefined}>
            {stage === STAGE.LANDING && <div className="oud-aura" />}
            <OudSVG stringsAnimating={stage === STAGE.ANALYZING} style={{ width: '100%', height: '100%' }} />
          </div>
        )}

      </div>
    </>
  );
}

/* ─── CSS ──────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:    #0b0907;
  --sur:   #141009;
  --amber: #c4913a;
  --gold:  #e8c060;
  --cream: #ede6d2;
  --dim:   rgba(237,230,210,0.38);
  --line:  rgba(196,145,58,0.14);
}

html, body { width: 100%; height: 100%; overflow: hidden; }

.shell {
  position: fixed; inset: 0;
  background:
    radial-gradient(ellipse 110% 70% at 20% 15%, #1c0e06 0%, transparent 52%),
    radial-gradient(ellipse 70%  90% at 85% 90%, #160a04 0%, transparent 50%),
    #0b0907;
  font-family: 'DM Sans', sans-serif;
  overflow: hidden;
}

/* Noise */
.grain {
  position: fixed; inset: 0; pointer-events: none; z-index: 999;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.034'/%3E%3C/svg%3E");
}

/* Shared typography atoms */
.tag {
  display: block;
  font-family: 'DM Mono', monospace;
  font-size: 9px; letter-spacing: 0.44em; text-transform: uppercase;
  color: var(--amber); opacity: 0.55;
  margin-bottom: 16px;
}
.tag.arabic {
  font-family: 'Playfair Display', serif;
  font-style: italic; font-size: 14px; letter-spacing: 0.1em;
  text-transform: none; opacity: 0.5; margin-bottom: 8px;
}

/* ═══════════════════════════════════ OUD POSITION STATE MACHINE ═══ */
.oud {
  position: fixed; z-index: 20;
  will-change: transform, left, top, bottom, width;
  pointer-events: none;
}

/* LANDING — sits in left panel, tilted */
.o-land {
  width: 240px; top: 50%; left: 27%;
  transform: translate(-50%, -50%) rotate(-7deg);
  cursor: pointer; pointer-events: all;
  transition: filter 0.35s;
}
.o-land:hover { filter: brightness(1.18) drop-shadow(0 0 24px rgba(232,192,96,0.22)); }

/* Breathing glow */
.oud-aura {
  position: absolute; inset: -50px; border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle, rgba(196,145,58,0.09) 0%, transparent 65%);
  animation: aura 4s ease-in-out infinite;
}
@keyframes aura { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }

/* TRANSITIONING */
.o-trans {
  animation: toCorner 0.9s cubic-bezier(0.77,0,0.18,1) forwards;
}
@keyframes toCorner {
  0%   { top:50%; left:27%; width:240px; transform:translate(-50%,-50%) rotate(-7deg); opacity:1; }
  100% { top:auto; bottom:-50px; left:-62px; width:276px; transform:rotate(0deg); opacity:0.55; }
}

/* RECORDING — parked in corner */
.o-corner {
  bottom: -50px; left: -62px; width: 276px;
  opacity: 0.55; filter: brightness(0.55) saturate(0.55);
}

/* ANALYZING — glides from the corner to just-below-centre, lying horizontal.
   Element: 122px wide × 302px tall (200:495 ratio).
   rotate(-90deg) → visually ~302px wide × ~122px tall, centred on its box. */
.o-analyze {
  top: 50%; left: 50%; width: 122px;
  transform: translate(-50%, calc(-50% + 100px)) rotate(-90deg);
  opacity: 0.68; filter: brightness(0.78) saturate(0.72);
  animation: toCenterH 0.9s cubic-bezier(0.34,1.1,0.64,1) both;
}
@keyframes toCenterH {
  0%   { top: calc(100% - 292px); left: 76px; width: 276px;
         transform: translate(-50%, -50%) rotate(0deg);
         opacity: 0.55; filter: brightness(0.55) saturate(0.55); }
  100% { top: 50%; left: 50%; width: 122px;
         transform: translate(-50%, calc(-50% + 100px)) rotate(-90deg);
         opacity: 0.68; filter: brightness(0.78) saturate(0.72); }
}

/* RESULTS — fades from the same horizontal-bottom position */
.o-fade {
  bottom: 5%; left: 50%; width: 122px;
  transform: translateX(-50%) rotate(-90deg);
  opacity: 0.68;
  animation: bloomFade 0.75s ease forwards;
}
@keyframes bloomFade {
  0%   { opacity:0.68; transform:translateX(-50%) rotate(-90deg) scale(1);    filter:blur(0); }
  100% { opacity:0;    transform:translateX(-50%) rotate(-90deg) scale(1.18);  filter:blur(12px); }
}

/* String vibration */
@keyframes sv {
  0%   { transform:skewX(0) scaleX(1); }
  50%  { transform:skewX(2.5deg) scaleX(1.018); }
  100% { transform:skewX(-2deg) scaleX(0.985); }
}

/* ═══════════════════════════════════ LANDING ═══ */
.land-split {
  position: fixed; inset: 0; display: flex;
  align-items: stretch; cursor: pointer; z-index: 5;
}
.land-left  { flex: 0 0 54%; } /* oud floats here via fixed positioning */
.land-div   {
  flex-shrink: 0; width: 1px;
  background: linear-gradient(to bottom, transparent 5%, rgba(196,145,58,0.28) 30%, rgba(196,145,58,0.28) 70%, transparent 95%);
  align-self: stretch;
}
.land-right {
  flex: 1; display: flex; flex-direction: column; justify-content: center;
  padding: 0 7% 0 6%; animation: fadeUp 1s ease both;
}
.land-h1 {
  font-family: 'Playfair Display', serif; font-style: italic; font-weight: 700;
  font-size: clamp(54px, 7.5vw, 96px); color: var(--gold); line-height: 0.9;
  letter-spacing: -0.025em; margin-bottom: 28px;
  text-shadow: 0 0 80px rgba(232,192,96,0.18);
}
.land-rule {
  width: 48px; height: 1px;
  background: linear-gradient(90deg, rgba(196,145,58,0.55), transparent);
  margin-bottom: 24px;
}
.land-desc {
  font-size: 13px; color: var(--dim); line-height: 1.7;
  font-weight: 300; letter-spacing: 0.01em; margin-bottom: 36px;
  transform: translate(22px, -14px); /* nudged up & a touch right */
}
.land-cta {
  font-size: 10px; font-weight: 500; letter-spacing: 0.26em;
  text-transform: uppercase; color: var(--amber); opacity: 0.5;
  display: flex; align-items: center; gap: 10px;
  animation: ctaPulse 2.8s ease-in-out infinite;
}
.cta-arrow { font-size: 12px; letter-spacing: 0; opacity: 0.7; }
@keyframes ctaPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }

/* ── Buy me a coffee (bottom-right) ── */
.coffee-fab {
  position: fixed; bottom: 26px; right: 26px; z-index: 30;
  display: flex; align-items: center; justify-content: flex-end;
  cursor: pointer; color: var(--amber);
  font-family: 'DM Mono', monospace;
  text-decoration: none;
}
.coffee-icon {
  flex-shrink: 0;
  display: inline-flex; align-items: center; justify-content: center;
  width: 46px; height: 46px; border-radius: 50%;
  border: 1px solid rgba(196,145,58,0.28);
  background: rgba(196,145,58,0.06);
  color: var(--amber); opacity: 0.78;
  transition: opacity 0.25s, border-color 0.25s, background 0.25s, transform 0.25s;
}
.coffee-text {
  max-width: 0; overflow: hidden; white-space: nowrap;
  font-size: 10px; letter-spacing: 0.12em; color: var(--amber);
  opacity: 0; transform: translateX(8px);
  transition: max-width 0.45s cubic-bezier(0.22,1,0.36,1),
              opacity 0.35s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1),
              margin-right 0.45s cubic-bezier(0.22,1,0.36,1);
}
.coffee-fab:hover .coffee-text,
.coffee-fab:focus-visible .coffee-text {
  max-width: 320px; opacity: 0.85; transform: translateX(0); margin-right: 12px;
}
.coffee-fab:hover .coffee-icon,
.coffee-fab:focus-visible .coffee-icon {
  opacity: 1; border-color: rgba(196,145,58,0.5);
  background: rgba(196,145,58,0.1); transform: translateY(-1px);
}
.coffee-fab:focus-visible { outline: none; }

/* ── Back arrow (recording page, top-left) ── */
.back-btn {
  position: fixed; top: 22px; left: 22px; z-index: 25;
  display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: 50%;
  border: 1px solid rgba(196,145,58,0.18);
  background: rgba(196,145,58,0.04);
  color: var(--amber); opacity: 0.55; cursor: pointer;
  transition: opacity 0.22s, border-color 0.22s, background 0.22s, transform 0.22s;
}
.back-btn:hover {
  opacity: 1; border-color: rgba(196,145,58,0.45);
  background: rgba(196,145,58,0.08); transform: translateX(-2px);
}
.back-btn:focus-visible { outline: none; }


/* ═══════════════════════════════════ RECORDING ═══ */
.rec-panel {
  position: fixed; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 0 24px; z-index: 10;
  animation: fadeUp 0.5s ease both;
}
.rec-header { text-align: center; margin-bottom: 0; }
.rec-h2 {
  font-family: 'Playfair Display', serif; font-style: italic; font-weight: 700;
  font-size: clamp(44px, 7vw, 78px); color: var(--gold);
  line-height: 0.92; margin-bottom: 10px; text-align: center;
}
.rec-sub {
  font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--amber); opacity: 0.38; margin-bottom: 0; text-align: center;
}

/* Waveform scene */
.wave-scene {
  position: relative; width: min(440px, 90vw);
  margin: 36px 0 40px; display: flex; flex-direction: column; align-items: center;
}
.wave-bars {
  display: flex; align-items: flex-end; justify-content: center;
  gap: 4px; height: 80px; width: 100%; overflow: visible;
}
.wb {
  display: block; position: relative;
  width: 6px; height: 6px; border-radius: 3px 3px 1px 1px;
  background: linear-gradient(to top, var(--amber) 0%, var(--gold) 100%);
  opacity: 0.28; transform-origin: bottom center;
  animation: idleWave 2s ease-in-out infinite alternate;
  transition: height 0.05s linear, opacity 0.05s linear;
}
/* Automatic reflection via ::after — tracks bar height with no extra JS */
.wb::after {
  content: ''; position: absolute; top: 100%; left: 0;
  width: 100%; height: 60%;
  background: linear-gradient(to bottom, rgba(196,145,58,0.3), transparent);
  border-radius: 0 0 3px 3px; pointer-events: none;
}
.wave-bars.live .wb { animation: none; }
@keyframes idleWave {
  0%   { transform: scaleY(0.12); opacity: 0.22; }
  100% { transform: scaleY(0.52); opacity: 0.4; }
}
.wave-center-line {
  width: 1px; height: 24px; margin-top: 4px;
  background: linear-gradient(to bottom, rgba(196,145,58,0.3), transparent);
}

/* Buttons */
.rec-footer { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.btn-rec, .btn-stop {
  display: inline-flex; align-items: center;
  font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600;
  letter-spacing: 0.2em; text-transform: uppercase;
  padding: 15px 46px; border-radius: 50px; border: none; cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-rec {
  background: linear-gradient(135deg, #cc8c2e 0%, #8a5a14 100%);
  color: #0e0802; box-shadow: 0 4px 32px rgba(196,145,58,0.45);
}
.btn-rec:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(196,145,58,0.6); }
.btn-stop {
  background: linear-gradient(135deg, #c03030 0%, #861818 100%);
  color: #fff; box-shadow: 0 4px 22px rgba(192,48,48,0.45);
}
.btn-stop:hover { transform: translateY(-2px); }

.live-row {
  display: flex; align-items: center; gap: 9px;
  font-family: 'DM Mono', monospace; font-size: 9px;
  letter-spacing: 0.38em; color: #d06820; text-transform: uppercase;
}
.live-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #d06820;
  animation: blink 1.0s ease-in-out infinite;
  box-shadow: 0 0 0 0 rgba(208,104,32,0.5);
}
@keyframes blink {
  0%,100%{ opacity:1; box-shadow:0 0 0 0 rgba(208,104,32,0.5); }
  50%    { opacity:0.4; box-shadow:0 0 0 6px rgba(208,104,32,0); }
}
.live-txt { font-size: 9px; font-weight: 400; letter-spacing: 0.38em; }
.err {
  font-family: 'DM Mono', monospace; font-size: 11px; color: #c06060;
  text-align: center; margin-top: 22px; padding: 12px 18px;
  background: rgba(192,48,48,0.08); border: 1px solid rgba(192,48,48,0.2);
  border-radius: 8px; max-width: 420px;
}

/* ═══════════════════════════════════ ANALYZING ═══ */
.analyze-ui {
  position: fixed; top: 50%; left: 0; right: 0;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
  z-index: 16; pointer-events: none;
  transform: translateY(calc(-50% - 100px));
  animation: analyzeIn 0.5s ease both;
}
@keyframes analyzeIn {
  from { opacity: 0; transform: translateY(calc(-50% - 86px)); }
  to   { opacity: 1; transform: translateY(calc(-50% - 100px)); }
}
.analyze-label {
  font-family: 'Playfair Display', serif; font-style: italic; font-weight: 400;
  font-size: clamp(24px, 3.8vw, 40px); color: var(--gold); opacity: 0.92;
}
.pulse-row { display: flex; align-items: flex-end; gap: 5px; height: 42px; }
.pd {
  display: block; width: 4px; border-radius: 2px;
  background: linear-gradient(to top, var(--amber), var(--gold));
  animation: bounce 0.85s ease-in-out infinite alternate;
}
@keyframes bounce { from{transform:scaleY(.2);opacity:.35} to{transform:scaleY(1);opacity:1} }

/* ═══════════════════════════════════ RESULTS ═══ */
.results {
  position: fixed; inset: 0; overflow-y: auto; z-index: 10;
  display: flex; flex-direction: column; align-items: center;
  padding: 0 24px 80px; animation: fadeIn 0.6s ease both;
}
.results::-webkit-scrollbar { width: 3px; }
.results::-webkit-scrollbar-thumb { background: rgba(196,145,58,0.18); border-radius: 2px; }
.results::-webkit-scrollbar-track { background: transparent; }

.res-body {
  width: 100%; max-width: 580px; padding-top: 64px;
  display: flex; flex-direction: column; align-items: center;
}

/* Name block — editorial, centered */
.res-name-block { width: 100%; margin-bottom: 0; text-align: center; }
.res-name {
  font-family: 'Playfair Display', serif; font-style: italic; font-weight: 700;
  font-size: clamp(66px, 12vw, 124px); color: var(--gold);
  line-height: 0.9; letter-spacing: -0.03em;
  text-shadow: 0 0 120px rgba(232,192,96,0.18);
  animation: nameIn 0.9s cubic-bezier(0.34,1.1,0.64,1) both;
}
@keyframes nameIn {
  from { opacity:0; transform:translateY(18px) scale(0.96); }
  to   { opacity:1; transform:none; }
}
.res-family {
  font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 300;
  color: var(--dim); margin-top: 12px; letter-spacing: 0.08em;
}
.res-family-sep { margin: 0 6px; opacity: 0.5; }

/* Horizontal rule */
.res-rule {
  width: 100%; height: 1px; margin: 28px 0;
  background: linear-gradient(90deg, rgba(196,145,58,0.3) 0%, rgba(196,145,58,0.08) 60%, transparent 100%);
}

/* Metrics row */
.res-metrics {
  display: flex; align-items: center; gap: 28px; margin-bottom: 8px;
  animation: fadeUp 0.5s 0.1s ease both;
}
.conf-wrap { flex-shrink: 0; }
.res-pills { display: flex; flex-direction: column; gap: 10px; }
.pill {
  display: inline-flex; align-items: center;
  padding: 7px 16px;
  background: rgba(196,145,58,0.06); border: 1px solid rgba(196,145,58,0.15);
  border-radius: 50px; font-family: 'DM Mono', monospace; font-size: 11px;
  color: var(--amber); letter-spacing: 0.06em;
}

/* Sections */
.res-section { width: 100%; margin-top: 8px; animation: fadeUp 0.5s ease both; }
.sec-label {
  font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.44em;
  text-transform: uppercase; color: var(--amber); opacity: 0.44;
  padding: 24px 0 12px; border-top: 1px solid var(--line);
  text-align: center;
}

/* Possible maqamat chips */
.maqam-grid { display: flex; flex-wrap: wrap; gap: 8px; padding-bottom: 4px; justify-content: center; }
.maqam-chip {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 16px;
  background: rgba(196,145,58,0.04); border: 1px solid rgba(196,145,58,0.1);
  border-radius: 8px; transition: border-color 0.22s;
  animation: chipIn 0.38s ease both;
}
.maqam-chip:hover { border-color: rgba(196,145,58,0.25); }
@keyframes chipIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
.chip-name {
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 18px; color: var(--cream); opacity: 0.85;
}
.chip-dot { color: var(--amber); opacity: 0.35; font-size: 14px; }
.chip-fam {
  font-family: 'DM Mono', monospace; font-size: 9px;
  color: var(--amber); opacity: 0.4; letter-spacing: 0.06em;
}

/* Alt rows */
.alt-row {
  display: grid; grid-template-columns: 140px 1fr 44px;
  align-items: center; gap: 16px; padding: 10px 0;
  border-bottom: 1px solid var(--line);
  animation: fadeUp 0.38s ease both;
}
.alt-name {
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 17px; color: var(--cream); opacity: 0.52;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.alt-bar-track {
  height: 1.5px; background: rgba(196,145,58,0.1); border-radius: 1px; overflow: hidden;
}
.alt-bar-fill {
  height: 100%; border-radius: 1px;
  background: linear-gradient(90deg, var(--amber), var(--gold));
  animation: fillBar 1.2s ease both;
}
@keyframes fillBar { from{width:0} to{width:var(--w,0%)} }
.alt-pct {
  font-family: 'DM Mono', monospace; font-size: 10px;
  color: var(--amber); opacity: 0.4; text-align: right;
}

/* Ghost button */
.btn-ghost {
  font-family: 'DM Mono', monospace; font-size: 9.9px; letter-spacing: 0.36em;
  text-transform: uppercase; padding: 12px 33px; border-radius: 50px;
  border: 1px solid rgba(196,145,58,0.2); background: transparent;
  color: var(--amber); cursor: pointer; opacity: 0.55;
  transition: all 0.22s; align-self: center;
}
.btn-ghost:hover {
  opacity: 1; border-color: rgba(196,145,58,0.48);
  background: rgba(196,145,58,0.06); transform: translateY(-1px);
}

/* Error */
.res-err {
  display: flex; flex-direction: column; align-items: center; gap: 24px;
  text-align: center; padding: 80px 24px;
  font-family: 'DM Mono', monospace; font-size: 12px; color: #b86060;
}

/* Shared animations */
@keyframes fadeUp {
  from { opacity:0; transform:translateY(14px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes fadeIn {
  from { opacity:0; } to { opacity:1; }
}

/* Responsive */
@media (max-width: 640px) {
  .o-land { left: 50%; width: 180px; top: 36%; }
  @keyframes toCorner {
    0%   { top:36%; left:50%; width:180px; transform:translate(-50%,-50%) rotate(-7deg); opacity:1; }
    100% { top:auto; bottom:-50px; left:-62px; width:276px; transform:rotate(0deg); opacity:0.55; }
  }
  .land-split  { flex-direction: column; }
  .land-left   { flex: 0 0 50vh; }
  .land-div    { width: 50%; height: 1px; align-self: center;
                 background: linear-gradient(to right, transparent, rgba(196,145,58,0.28), transparent); }
  .land-right  { padding: 28px 32px; align-items: center; text-align: center; }
  .land-h1     { font-size: clamp(44px, 13vw, 68px); }
  .land-rule   { margin-left: auto; margin-right: auto; }
  .res-metrics { flex-direction: column; align-items: center; }
  .alt-row     { grid-template-columns: 110px 1fr 38px; }
  .maqam-grid  { flex-direction: column; }
}
`;