'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CalendarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date, time: string) => void;
}

export function CalendarDialog({ isOpen, onClose, onConfirm }: CalendarDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');

  // Generate time slots (9:00 AM to 5:00 PM in 30-min intervals)
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    if (hour > 17) return null;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute} ${period}`;
  }).filter(Boolean) as string[];

  const handleConfirm = () => {
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }
    onConfirm(selectedDate, selectedTime);
    // Reset state after confirmation
    setSelectedDate(undefined);
    setSelectedTime('10:00 AM');
    onClose();
  };

  const handleClose = () => {
    // Reset state when closing
    setSelectedDate(undefined);
    setSelectedTime('10:00 AM');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Select Date & Time
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Calendar */}
          <div className="border rounded-md p-4 bg-gray-50 flex items-center justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border bg-white"
            />
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent className="w-full bg-white">
                <div className="max-h-48 overflow-y-auto">
                  <SelectGroup>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </div>
              </SelectContent>
            </Select>
          </div>

          {/* Selected DateTime Display */}
          {selectedDate && (
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
              <span className="font-medium">Selected:</span> {format(selectedDate, 'PPP')} at{' '}
              {selectedTime}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-[#03045B] hover:bg-[#02034a] text-white"
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
