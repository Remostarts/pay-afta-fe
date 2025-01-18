import React from 'react';

interface TypingIndicatorProps {
  position: 'left' | 'right';
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ position }) => {
  const containerClasses =
    position === 'left'
      ? 'flex items-start justify-start gap-3'
      : 'flex items-end justify-end gap-3';

  return (
    <div className={containerClasses}>
      <div className="max-w-[50px] rounded-lg bg-gray-200 p-2">
        <div className="flex items-center gap-1">
          <div className="size-2 animate-bounce rounded-full bg-gray-400" />
          <div className="size-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]" />
          <div className="size-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
};
