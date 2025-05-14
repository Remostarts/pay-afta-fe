'use client';

import * as React from 'react';
import { format, addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  onApply?: (range: DateRange | undefined) => void;
  onCancel?: () => void;
}

export function DatePickerWithRange({ className, onApply, onCancel }: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const [currentMonth, setCurrentMonth] = React.useState(new Date());

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

  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const renderDateRangeText = () => {
    if (!date?.from) return '';

    const fromText = format(date.from, 'MMM d, yyyy');
    const toText = date.to ? format(date.to, 'MMM d, yyyy') : '';

    return (
      <div className="flex justify-center gap-8">
        <div className="w-[180px] rounded-md border border-gray-200 py-2 text-center">
          {fromText}
        </div>
        <div className="flex items-center">-</div>
        <div className="w-[180px] rounded-md border border-gray-200 py-2 text-center">{toText}</div>
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between pb-2">
        <button onClick={goToPreviousMonth} className="p-1">
          <ChevronLeft className="size-5" />
        </button>
        <div className="font-medium">{format(currentMonth, 'MMMM yyyy')}</div>
        <button onClick={goToNextMonth} className="p-1">
          <ChevronRight className="size-5" />
        </button>
      </div>
    );
  };

  const renderDayNames = () => {
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return (
      <div className="grid grid-cols-7 py-2 text-center">
        {dayNames.map((day, i) => (
          <div key={i} className="text-sm">
            {day}
          </div>
        ))}
      </div>
    );
  };

  // Get days in month with padding for previous/next month
  const getDaysInMonthWithPadding = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get first day of month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday

    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get days from previous month for padding
    const daysFromPrevMonth = [];
    if (firstDayOfWeek > 0) {
      const prevMonth = new Date(year, month, 0);
      const prevMonthDays = prevMonth.getDate();

      for (let i = prevMonthDays - firstDayOfWeek + 1; i <= prevMonthDays; i++) {
        daysFromPrevMonth.push({
          date: new Date(year, month - 1, i),
          currentMonth: false,
        });
      }
    }

    // Current month days
    const daysInCurrentMonth = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysInCurrentMonth.push({
        date: new Date(year, month, i),
        currentMonth: true,
      });
    }

    // Next month days for padding
    const combined = [...daysFromPrevMonth, ...daysInCurrentMonth];
    const nextMonthDays = [];
    const remainingCells = 42 - combined.length; // 6 rows of 7 days

    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDays.push({
        date: new Date(year, month + 1, i),
        currentMonth: false,
      });
    }

    return [...daysFromPrevMonth, ...daysInCurrentMonth, ...nextMonthDays];
  };
  // const isInRange = (date: Date) => {
  //   if (!date || !this.date?.from || !this.date?.to) return false;
  //   return date >= this.date.from && date <= this.date.to;
  // };

  // const isStartDate = (date: Date) => {
  //   if (!date || !this.date?.from) return false;
  //   return date.getTime() === this.date.from.getTime();
  // };

  // const isEndDate = (date: Date) => {
  //   if (!date || !this.date?.to) return false;
  //   return date.getTime() === this.date.to.getTime();
  // };

  const handleDateClick = (day: Date) => {
    if (!date?.from || date.to) {
      // No selection or both dates selected - start new selection
      setDate({ from: day, to: undefined });
    } else {
      // One date selected - complete the range
      if (day < date.from) {
        setDate({ from: day, to: date.from });
      } else {
        setDate({ from: date.from, to: day });
      }
    }
  };

  const renderCalendar = () => {
    const days = getDaysInMonthWithPadding();

    // Split into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="mt-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7">
            {week.map((day, dayIndex) => {
              const isToday = day.date.toDateString() === new Date().toDateString();
              const isSelected =
                date?.from && date?.to && day.date >= date.from && day.date <= date.to;
              const isStart = date?.from && day.date.toDateString() === date.from.toDateString();
              const isEnd = date?.to && day.date.toDateString() === date.to.toDateString();

              let bgClass = '';
              if (isSelected) bgClass = 'bg-blue-100';
              if (isStart) bgClass = 'bg-blue-600 text-white';
              if (isEnd) bgClass = 'bg-white border border-blue-600';

              return (
                <button
                  key={dayIndex}
                  className={cn(
                    'h-8 w-full flex items-center justify-center text-sm',
                    !day.currentMonth && 'text-gray-400',
                    isToday && !isSelected && 'font-bold',
                    bgClass
                  )}
                  onClick={() => handleDateClick(day.date)}
                  disabled={!day.currentMonth}
                >
                  {day.date.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {renderDateRangeText()}

      <div className="p-4">
        {renderHeader()}
        {renderDayNames()}
        {renderCalendar()}
      </div>

      <div className="flex gap-4 p-4">
        <Button
          onClick={handleCancel}
          variant="outline"
          className="flex-1 rounded-md border border-gray-300"
        >
          Cancel
        </Button>
        <Button onClick={handleApply} className="flex-1 rounded-md bg-black text-white">
          Apply
        </Button>
      </div>
    </div>
  );
}
