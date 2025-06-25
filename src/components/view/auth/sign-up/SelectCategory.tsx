'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Truck } from 'lucide-react';
import { useState } from 'react';

import { Form } from '@/components/ui/form';
import { IUserCategory, userCategorySchema } from '@/lib/validations/userAuth.validations';
import ReRadioGroup from '@/components/re-ui/ReRadio';
import { ReButton } from '@/components/re-ui/ReButton';

type defaultVal = {
  user: string;
  logisticsUser: string;
};

const defaultValues: defaultVal = {
  user: '',
  logisticsUser: '',
};

interface ICategoryHandler {
  handleCategory: (value: any) => void;
}

export default function SelectCategory({ handleCategory }: ICategoryHandler) {
  const form = useForm<IUserCategory>({
    resolver: zodResolver(userCategorySchema),
    // defaultValues,
    mode: 'onChange',
  });

  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (value: any) => {
    setSelectedOption(value);
  };

  const handleProceed = () => {
    handleCategory(selectedOption);
  };

  return (
    <section>
      <div>
        <Image src="/Logo.svg" alt="Pay afta" width={176} height={64} />
      </div>
      <div>
        <h1 className="mt-5 font-inter text-2xl font-bold">Select your category</h1>
        <p className="font-inter">Which of these describe you?</p>
      </div>

      <div className="mt-10 flex flex-col gap-5">
        <button
          className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
            selectedOption === 'individual'
              ? 'border-[#12BA4A]'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleOptionChange('individual')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex size-10 items-center justify-center rounded-full">
                {selectedOption === 'individual' ? (
                  <Image alt="user" src="/assets/auth/userColorIcon.svg" width={40} height={40} />
                ) : (
                  <Image alt="user" src="/assets/auth/user.svg" width={40} height={40} />
                )}
              </div>
              <div className=" flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Individual</h3>
                <p className="text-sm text-gray-600">Choose this if you a buyer and seller</p>
              </div>
            </div>
            <div className="relative">
              <input
                type="radio"
                name="userType"
                value="individual"
                checked={selectedOption === 'individual'}
                onChange={() => handleOptionChange('individual')}
                className="sr-only"
              />
              <div
                className={`flex size-5 items-center justify-center rounded-full border-2 ${
                  selectedOption === 'individual'
                    ? 'border-[#12BA4A] bg-[#12BA4A]'
                    : 'border-gray-300'
                }`}
              >
                {selectedOption === 'individual' && (
                  <div className="size-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>
          </div>
        </button>

        {/* Logistic Partner Option */}
        <button
          className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
            selectedOption === 'logistic'
              ? 'border-[#12BA4A]'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleOptionChange('logistic')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex size-10 items-center justify-center rounded-full">
                {selectedOption === 'logistic' ? (
                  <Image
                    alt="logistic"
                    src="/assets/auth/logisticColorIcon.svg"
                    width={40}
                    height={40}
                  />
                ) : (
                  <Image alt="logistic" src="/assets/auth/logistic.svg" width={40} height={40} />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Logistic Partner</h3>
                <p className="text-sm text-gray-600">
                  Choose this if you are a third-party delivery company
                </p>
              </div>
            </div>
            <div className="relative">
              <input
                type="radio"
                name="userType"
                value="logistic"
                checked={selectedOption === 'logistic'}
                onChange={() => handleOptionChange('logistic')}
                className="sr-only"
              />
              <div
                className={`flex size-5 items-center justify-center rounded-full border-2 ${
                  selectedOption === 'logistic'
                    ? 'border-[#12BA4A] bg-[#12BA4A]'
                    : 'border-gray-300'
                }`}
              >
                {selectedOption === 'logistic' && (
                  <div className="size-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>
          </div>
        </button>

        {/* Proceed Button */}
        <ReButton
          className={`w-full rounded-full px-4 py-6 font-medium transition-all duration-200 ${
            selectedOption
              ? 'bg-[#03045B] text-white'
              : 'cursor-not-allowed bg-gray-400 text-gray-200'
          }`}
          disabled={!selectedOption}
          onClick={handleProceed}
        >
          Proceed
        </ReButton>
      </div>
    </section>
  );
}
