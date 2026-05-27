import { memo } from 'react';

function TypingHUD({ wpmRef, accRef, timerRef, labels, compact = false }) {
  return (
    <div className={`qd-hud ${compact ? 'qd-hud--mobile' : ''}`} role="status" aria-live="polite">
      <div className="qd-hud-item">
        <span className="qd-hud-label">{labels.hudWpm}</span>
        <span ref={wpmRef} className="qd-hud-value qd-hud-value--accent">
          0
        </span>
      </div>
      <div className="qd-hud-item">
        <span className="qd-hud-label">{labels.hudAcc}</span>
        <span ref={accRef} className="qd-hud-value">
          100
        </span>
      </div>
      <div className="qd-hud-item">
        <span className="qd-hud-label">{labels.hudTime}</span>
        <span ref={timerRef} className="qd-hud-value">
          —
        </span>
      </div>
    </div>
  );
}

export default memo(TypingHUD);
