'use client';

import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface PasswordRequirement {
  id: string;
  label: string;
  regex: RegExp;
  met: boolean;
}

export function PasswordStrengthIndicator() {
  const { watch } = useFormContext();
  const password = watch('password');
  const firstName = watch('firstName');
  const lastName = watch('lastName');

  const [isOpen, setIsOpen] = useState(false);

  const [requirements, setRequirements] = useState<PasswordRequirement[]>([
    {
      id: 'length',
      label: 'At least 8 characters long',
      regex: /.{8,}/,
      met: false,
    },
    {
      id: 'uppercase',
      label: 'Include at least one uppercase letter',
      regex: /[A-Z]/,
      met: false,
    },
    {
      id: 'lowercase',
      label: 'Include at least one lower case letter',
      regex: /[a-z]/,
      met: false,
    },
    {
      id: 'number',
      label: 'Include at least one number',
      regex: /[0-9]/,
      met: false,
    },
    {
      id: 'special',
      label: 'Include at least one special character',
      regex: /[!@#$%^&*(),.?":{}|<>]/,
      met: false,
    },
  ]);

  const [nameWarning, setNameWarning] = useState(false);

  useEffect(() => {
    if (!password) {
      setRequirements((prev) => prev.map((req) => ({ ...req, met: false })));
      setNameWarning(false);
      return;
    }

    // Check if password contains name
    const nameInPassword =
      (firstName && password.toLowerCase().includes(firstName.toLowerCase())) ||
      (lastName && password.toLowerCase().includes(lastName.toLowerCase()));

    setNameWarning(nameInPassword);

    // Check all requirements
    const updated = requirements.map((req) => ({
      ...req,
      met: req.regex.test(password),
    }));

    setRequirements(updated);
  }, [password, firstName, lastName]);

  const allMet = requirements.every((req) => req.met) && !nameWarning;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="mt-4 cursor-pointer">
          {/* Strength indicator preview */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  !password
                    ? 'w-0'
                    : allMet
                      ? 'w-full bg-green-500'
                      : requirements.filter((r) => r.met).length <= 2
                        ? 'w-1/3 bg-red-500'
                        : 'w-2/3 bg-yellow-500'
                }`}
              />
            </div>
            <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
              {!password
                ? 'Enter password'
                : allMet
                  ? 'Strong'
                  : requirements.filter((r) => r.met).length <= 2
                    ? 'Weak'
                    : 'Fair'}
            </span>
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 bg-white" align="start">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Your password must:</h3>
          <div className="space-y-2">
            {requirements.map((req) => (
              <div key={req.id} className="flex items-center gap-2">
                {req.met ? (
                  <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                ) : (
                  <X className="h-5 w-5 flex-shrink-0 text-red-500" />
                )}
                <span className={`text-sm ${req.met ? 'text-green-600' : 'text-red-600'}`}>
                  {req.label}
                </span>
              </div>
            ))}

            {/* Name warning */}
            <div className="flex items-center gap-2">
              {!nameWarning ? (
                <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
              ) : (
                <X className="h-5 w-5 flex-shrink-0 text-red-500" />
              )}
              <span className={`text-sm ${!nameWarning ? 'text-green-600' : 'text-red-600'}`}>
                Not contain your name
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
