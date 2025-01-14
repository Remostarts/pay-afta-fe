'use client';
import React, { KeyboardEvent, useRef, useState, useCallback, useEffect } from 'react';

interface RePinProps {
  count?: number;
  onChange?: (pin: string) => void;
  className?: string;
  name?: string;
  error?: boolean;
}

const DOT = '•';

export default function RePin({
  count = 4,
  onChange,
  className = '',
  name,
  error = false,
}: RePinProps) {
  const [pin, setPin] = useState<string[]>(Array(count).fill(''));
  const [masking, setMasking] = useState<string[]>(Array(count).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePinUpdate = useCallback(
    (newPin: string[]) => {
      const pinString = newPin.join('');
      if (onChange) {
        onChange(pinString);
      }
    },
    [onChange]
  );

  const moveFocus = useCallback(
    (currentIndex: number, direction: 1 | -1) => {
      const newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < count && inputRefs.current[newIndex]) {
        inputRefs.current[newIndex]?.focus();
      }
    },
    [count]
  );

  const handleInputChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;

      const newPin = [...pin];
      const newMasking = [...masking];

      newPin[index] = value;
      newMasking[index] = value ? DOT : '';

      setPin(newPin);
      setMasking(newMasking);
      handlePinUpdate(newPin);

      if (value && index < count - 1) {
        moveFocus(index, 1);
      }
    },
    [pin, masking, count, moveFocus, handlePinUpdate]
  );

  const handleKeyDown = useCallback(
    (index: number, event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Backspace' && !pin[index]) {
        event.preventDefault();
        moveFocus(index, -1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveFocus(index, -1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveFocus(index, 1);
      }
    },
    [pin, moveFocus]
  );

  const handlePaste = useCallback(
    (event: React.ClipboardEvent) => {
      event.preventDefault();
      const pastedData = event.clipboardData.getData('text');
      const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, count);

      if (pastedNumbers) {
        const newPin = [...pin];
        const newMasking = [...masking];

        [...pastedNumbers].forEach((num, index) => {
          if (index < count) {
            newPin[index] = num;
            newMasking[index] = DOT;
          }
        });

        setPin(newPin);
        setMasking(newMasking);
        handlePinUpdate(newPin);
      }
    },
    [count, pin, masking, handlePinUpdate]
  );

  return (
    <div className={`flex flex-wrap justify-center ${className}`}>
      {Array(count)
        .fill('')
        .map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            name={`${name}-${index}`}
            value={masking[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onClick={(e) => (e.target as HTMLInputElement).select()}
            className={`
            mr-3 size-12 rounded-md border text-center font-spaceGrotesk text-xl
            transition-all duration-200 focus:outline-none sm:size-14 sm:text-2xl
            ${
              error
                ? 'border-red-500 focus:border-red-600'
                : 'border-gray-300 focus:border-[#03045B]'
            }
          `}
          />
        ))}
    </div>
  );
}
