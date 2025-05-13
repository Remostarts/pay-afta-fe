'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  onApply?: (range: DateRange | undefined) => void;
  onCancel?: () => void;
}

export function DatePickerWithRange({ className, onApply, onCancel }: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const handleApply = () => {
    if (onApply) {
      onApply(date);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <div className="flex justify-between p-4">
        <div className="text-center font-medium">
          {date?.from && format(date.from, 'MMM d, yyyy')}
          {' - '}
          {date?.to && format(date.to, 'MMM d, yyyy')}
        </div>
      </div>

      <Calendar
        initialFocus
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={setDate}
        numberOfMonths={1}
        className="bg-white"
      />

      <div className="flex w-full gap-4 p-4">
        <Button onClick={handleCancel} variant="outline" className="flex-1 rounded-md">
          Cancel
        </Button>
        <Button onClick={handleApply} className="flex-1 rounded-md bg-black text-white">
          Apply
        </Button>
      </div>
    </div>
  );
}
