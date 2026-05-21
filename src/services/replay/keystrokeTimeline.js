/**
 * Keystroke timeline for replay, analytics, anti-cheat and multiplayer sync.
 * All timestamps are relative to session start (performance.now).
 */

export const KEYSTROKE_TYPES = {
  CHAR: 'char',
  BACKSPACE: 'backspace',
  PASTE: 'paste',
  COMPLETE: 'complete',
  SESSION_END: 'session_end',
};

export function createKeystrokeTimeline() {
  const events = [];
  let sessionStart = null;
  let sessionMeta = {};

  return {
    start(meta = {}) {
      sessionStart = performance.now();
      sessionMeta = { ...meta, startedAt: Date.now() };
      events.length = 0;
    },

    record(event) {
      if (sessionStart === null) return;
      events.push({
        t: Math.round((event.timestamp ?? performance.now()) - sessionStart),
        type: event.type,
        index: event.index ?? -1,
        char: event.char ?? null,
        correct: event.correct ?? null,
        inputLength: event.inputLength ?? 0,
      });
    },

    recordChar({ index, char, correct, timestamp, inputLength }) {
      this.record({
        type: KEYSTROKE_TYPES.CHAR,
        index,
        char,
        correct,
        timestamp,
        inputLength,
      });
    },

    recordBackspace({ index, timestamp, inputLength }) {
      this.record({
        type: KEYSTROKE_TYPES.BACKSPACE,
        index,
        timestamp,
        inputLength,
      });
    },

    getEvents() {
      return [...events];
    },

    getSessionStart() {
      return sessionStart;
    },

    getMeta() {
      return { ...sessionMeta };
    },

    exportSnapshot(extra = {}) {
      return {
        version: 1,
        ...sessionMeta,
        ...extra,
        sessionStart,
        events: this.getEvents(),
      };
    },

    reset() {
      events.length = 0;
      sessionStart = null;
      sessionMeta = {};
    },
  };
}
