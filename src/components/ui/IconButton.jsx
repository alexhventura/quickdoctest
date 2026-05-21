import { memo } from 'react';

function IconButton({ onClick, style, className = '', children }) {
  return (
    <button type="button" onClick={onClick} style={style} className={className}>
      {children}
    </button>
  );
}

export default memo(IconButton);
