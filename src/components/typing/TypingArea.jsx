import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

import { getCharClasses, resolveCharClass } from '@/utils/typing/charClasses';

const TypingArea = memo(
  forwardRef(function TypingArea({ onNativeInput, onFocusArea, isDark = false, isMobile = false }, ref) {
    const containerRef = useRef(null);
    const textLayerRef = useRef(null);
    const inputRef = useRef(null);
    const caretRef = useRef(null);

    const charElsRef = useRef([]); 
    const charWrappersRef = useRef([]); 
    const targetRef = useRef('');
    const inputRefValue = useRef('');

    const rafRef = useRef(null);

    const classesRef = useRef(getCharClasses(isDark));
    classesRef.current = getCharClasses(isDark);

    // ----------------------------
    // POSICIONAMENTO DO CURSOR
    // ----------------------------
    const positionCaret = useCallback((index) => {
      const layer = textLayerRef.current;
      const caret = caretRef.current;

      if (!layer || !caret) return;

      const isAtEnd = index >= charWrappersRef.current.length;
      
      const wrapEl = isAtEnd 
        ? charWrappersRef.current[charWrappersRef.current.length - 1] 
        : charWrappersRef.current[index];
      
      const innerEl = isAtEnd
        ? charElsRef.current[charElsRef.current.length - 1]
        : charElsRef.current[index];

      if (!wrapEl || !innerEl) return;

      let x = wrapEl.offsetLeft;
      const y = wrapEl.offsetTop; 

      if (isAtEnd) {
        x += wrapEl.offsetWidth;
      }

      caret.style.height = `${innerEl.offsetHeight}px`;
      caret.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }, []);

    const scheduleCaretUpdate = useCallback((index) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        positionCaret(index);
      });
    }, [positionCaret]);

    // ----------------------------
    // SCROLL AUTOMÁTICO DE LINHA
    // ----------------------------
    const ensureCaretVisibility = useCallback((index) => {
      const container = containerRef.current;
      const localIndex = Math.min(index, charWrappersRef.current.length - 1);
      const wrapEl = charWrappersRef.current[localIndex];
      
      if (!container || !wrapEl) return;

      const currentLineTop = wrapEl.offsetTop;
      const containerHeight = container.clientHeight;
      const lineHeight = wrapEl.offsetHeight || 28;

      if (currentLineTop > containerHeight - lineHeight * 2) {
        container.scrollTop = currentLineTop - lineHeight;
      } else if (currentLineTop < container.scrollTop) {
        container.scrollTop = currentLineTop;
      }
    }, []);

    // ----------------------------
    // PATCH CHAR RANGE
    // ----------------------------
    const patchCharRange = useCallback((from, to, input, target) => {
      const classes = classesRef.current;

      for (let i = from; i < to; i++) {
        const el = charElsRef.current[i];
        if (!el) continue;

        try {
          el.className = resolveCharClass(i, input, target, classes);
        } catch (e) {
          el.className = '';
        }
      }
    }, []);

    // ----------------------------
    // CONSTRUÇÃO COMPLETA DO TEXTO
    // ----------------------------
    const buildWindow = useCallback((target) => {
      const layer = textLayerRef.current;
      if (!layer) return;

      const classes = classesRef.current;

      layer.replaceChildren();
      charElsRef.current = [];
      charWrappersRef.current = [];

      const fragment = document.createDocumentFragment();
      let currentWordSpan = null;

      for (let i = 0; i < target.length; i++) {
        const ch = target[i];

        if (!currentWordSpan || i === 0 || target[i - 1] === ' ') {
          currentWordSpan = document.createElement('span');
          currentWordSpan.className = 'qd-word-block';
          fragment.appendChild(currentWordSpan);
        }

        const wrap = document.createElement('span');
        wrap.className = 'qd-char-wrapper'; 

        const inner = document.createElement('span');

        try {
          inner.className = resolveCharClass(i, inputRefValue.current, target, classes);
        } catch (e) {
          inner.className = '';
        }

        inner.textContent = ch === ' ' ? '\u00a0' : ch;

        wrap.appendChild(inner);
        currentWordSpan.appendChild(wrap);

        charElsRef.current[i] = inner;
        charWrappersRef.current[i] = wrap;
      }

      layer.appendChild(fragment);
    }, []);

    // ----------------------------
    // API EXTERNA DO COMPONENTE
    // ----------------------------
    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus();
      },
      mountTarget(text) {
        targetRef.current = text;
        inputRefValue.current = '';
        buildWindow(text);
        if (inputRef.current) inputRef.current.value = '';
        setTimeout(() => {
          scheduleCaretUpdate(0);
        }, 50); 
      },
      applyInput(value) {
        const target = targetRef.current;
        const prev = inputRefValue.current;
        const prevLen = prev.length;
        const nextLen = value.length;

        if (nextLen > target.length) return;

        inputRefValue.current = value;

        if (nextLen < prevLen) {
          patchCharRange(nextLen, prevLen, value, target);
        } else {
          patchCharRange(prevLen, nextLen, value, target);
        }

        scheduleCaretUpdate(nextLen);
        ensureCaretVisibility(nextLen);
      },
      resetInput() {
        const target = targetRef.current;
        inputRefValue.current = '';
        if (inputRef.current) inputRef.current.value = '';

        patchCharRange(0, target.length, '', target);
        if (containerRef.current) containerRef.current.scrollTop = 0;
        scheduleCaretUpdate(0);
      },
    }));

    useEffect(() => {
      const target = targetRef.current;
      const input = inputRefValue.current;
      if (target.length) {
        patchCharRange(0, target.length, input, target);
      }
    }, [isDark, patchCharRange]);

    useEffect(() => {
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, []);

    return (
      <div
        ref={containerRef}
        className="qd-typing-area"
        onClick={onFocusArea}
      >
        <style>{`
          /* Caixa de teste padrão */
          .qd-typing-area {
            position: relative !important;
            display: block !important;
            width: 100% !important;
            max-width: 1000px !important;
            height: ${isMobile ? '390px' : '340px'} !important;
            overflow-y: hidden !important; 
            overflow-x: hidden !important;
            margin: 0 auto !important;
            padding: ${isMobile ? '28px' : '24px'} !important;
            box-sizing: border-box !important;
            text-align: left !important;
            
            border: 2px solid ${isDark ? '#cbd5e1' : '#e2e8f0'} !important;
            border-radius: 12px !important;
            background-color: ${isDark ? '#e8eaed' : '#ffffff'} !important; 
            transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease !important;
            cursor: text !important;
          }

          .qd-typing-area:focus-within {
            border-color: #3b82f6 !important; 
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15) !important; 
          }

          .qd-input {
            position: absolute !important;
            opacity: 0.01 !important;
            pointer-events: none !important;
            width: 1px !important;
            height: 1px !important;
            z-index: -1 !important;
            font-size: 16px !important;
          }

          .qd-text-layer {
            position: relative !important;
            display: block !important;
            width: 100% !important;
            white-space: normal !important; 
            font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
            font-size: ${isMobile ? '1.35rem' : '1.45rem'} !important;
            line-height: 1.6 !important;
            letter-spacing: -0.01em !important;
            color: ${isDark ? '#000000' : '#94a3b8'} !important;
            user-select: none !important;
          }

          .qd-word-block {
            display: inline-block !important;
            white-space: nowrap !important;
          }

          .qd-char-wrapper {
            display: inline-block !important;
            position: relative !important;
          }

          /* O Cursor customizado */
          .qd-caret {
            position: absolute !important;
            width: 2px !important;
            background-color: #3b82f6 !important; 
            left: 0 !important;
            top: 0 !important;
            pointer-events: none !important;
            z-index: 99 !important;
            opacity: 0.1;
            transition: transform 0.07s cubic-bezier(0.215, 0.610, 0.355, 1), opacity 0.2s ease !important;
            will-change: transform !important;
          }

          /* Acende e pisca o cursor quando a caixa está selecionada */
          .qd-typing-area:focus-within .qd-caret {
            opacity: 1 !important;
            animation: qdPulsar 1s infinite alternate !important;
          }

          @keyframes qdPulsar {
            0% { opacity: 1; }
            100% { opacity: 0.2; }
          }
        `}</style>

        <input
          ref={inputRef}
          type="text"
          onInput={onNativeInput}
          className="qd-input"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          inputMode="text"
          spellCheck={false}
        />
        <div ref={textLayerRef} className="qd-text-layer">
          <div ref={caretRef} className="qd-caret" />
        </div>
      </div>
    );
  }),
);

export default TypingArea;