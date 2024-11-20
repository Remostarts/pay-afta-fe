'use client';

import { KeyboardEvent, useRef, useState } from 'react';

const TempArray = ['•', '•', '•', '•'];

interface RePinProps {
  count?: number;
  onChange?: (pin: string) => void;
  className?: string;
  name?: string;
}

export default function RePin({ count = 6, onChange, className, name }: RePinProps) {
  const [pin, setPin] = useState<string[]>([]);
  const [masking, setMasking] = useState<string[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleClick(index: number) {
    return (event: any) => {
      event.target.setSelectionRange(1, 1);
    };
  }

  function handleKeyUp(index: any) {
    return (event: KeyboardEvent<HTMLInputElement>) => {
      const key = event.key;
      // console.log(key)
      const oldPin = [...pin];
      const oldMasking = [...masking];

      if (key === 'Backspace') {
        oldPin[index] = '';
        oldMasking[index] = '';
        setPin(oldPin);
        setMasking(oldMasking);
        handleBackSpace(index);
        return;
      }

      if (key === 'ArrowRight') {
        // console.log("arrow right")
        handleArrowRight(index);
        return;
      }

      if (key === 'ArrowLeft') {
        handleArrowLeft(index);
        return;
      }

      if (isNaN(Number(key))) {
        return;
      }

      oldPin[index] = key;
      oldMasking[index] = TempArray[index];

      setPin(oldPin);
      setMasking(oldMasking);

      // Send the focus to next box if it available.
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }

      const pinToSend = oldPin.join('');
      if (pinToSend.length === count && onChange) {
        onChange(pinToSend);
      }
    };
  }

  function handleBackSpace(index: any) {
    if (inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleArrowRight(index: any) {
    if (inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleArrowLeft(index: any) {
    if (inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  //   console.log(pin);

  return (
    <div className={`flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 ${className}`}>
      {new Array(count).fill('').map((__, index) => (
        <input
          key={index}
          name={name}
          ref={(iRefs) => {
            inputRefs.current[index] = iRefs;
          }}
          type="text"
          className="size-10 rounded-md border border-gray-300 text-center font-spaceGrotesk text-lg transition-all duration-200 focus:border-[#03045B] focus:outline-none sm:size-12 sm:text-xl md:size-14 md:text-2xl"
          onKeyUp={handleKeyUp(index)}
          value={masking[index] ?? ''}
          onClick={handleClick(index)}
          inputMode="numeric"
          maxLength={1}
        />
      ))}
    </div>
  );
}
