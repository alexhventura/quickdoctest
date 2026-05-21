import { memo } from 'react';

function TypingChar({ char, index, userInput, isDark }) {
  let colorClass = isDark ? 'text-zinc-600' : 'text-slate-400';

  if (index < userInput.length) {
    colorClass =
      userInput[index] === char
        ? isDark
          ? 'text-zinc-200 font-semibold'
          : 'text-slate-900 font-semibold'
        : 'bg-red-200/70 text-red-800 rounded';
  }

  const showCaret = index === userInput.length;

  return (
    <span className="relative">
      {showCaret && (
        <span className="absolute -left-[1px] top-[2px] w-[2px] h-[1.2em] bg-blue-600 animate-pulse">
          |
        </span>
      )}
      {char === ' ' ? (
        <span className={colorClass}>&nbsp;</span>
      ) : (
        <span className={colorClass}>{char}</span>
      )}
    </span>
  );
}

export default memo(TypingChar);
