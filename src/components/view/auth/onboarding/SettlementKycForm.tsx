'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Assuming you have these components/utilities
import { Skeleton } from '@/components/ui/skeleton'; // 👈 IMPORT SKELETON
import { TSettlementKyc, settlementKycSchema } from '@/lib/validations/onboarding.validation';
import { getPillaBanks } from '@/lib/actions/onboarding/onboarding.actions';
import { useGeneral } from '@/context/generalProvider';
import { SearchableSelect } from '@/components/re-ui/SearchableSelect';

// Define the Bank type outside the component for clarity
type Bank = {
  name: string;
  code: string;
};

// Define the type for default values
type SettlementKycDefaults = {
  bankName: string;
  accountNumber: string;
  bankCode: string;
  isDefaultPayout: boolean;
};

const defaultValues: SettlementKycDefaults = {
  bankName: '',
  accountNumber: '',
  bankCode: '',
  isDefaultPayout: false,
};

export default function SettlementKycForm() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);

  const form = useForm<TSettlementKyc>({
    resolver: zodResolver(settlementKycSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, control, watch, setValue, formState } = form;
  const { isSubmitting, errors } = formState;
  const { loadUserData } = useGeneral();

  const selectedBankName = watch('bankName');

  useEffect(() => {
    async function fetchBanks() {
      try {
        setLoadingBanks(true);
        const res = await getPillaBanks();
        setBanks(res?.data || []);
      } catch (error) {
        toast.error('Failed to load bank list');
        setBanks([]);
      } finally {
        setLoadingBanks(false);
      }
    }
    fetchBanks();
  }, []);

  // Auto-fill bank code based on selected bank name
  useEffect(() => {
    if (selectedBankName && banks.length > 0) {
      const selected = banks.find((b) => b.name === selectedBankName);
      if (selected) {
        // Set the bankCode when a bank is selected
        setValue('bankCode', selected.code, { shouldValidate: true });
      }
    } else {
      // Clear bankCode if no bank is selected or bank list is empty
      setValue('bankCode', '');
    }
  }, [selectedBankName, banks, setValue]);

  // Handle Form Submission
  async function onSubmit(data: TSettlementKyc) {
    try {
      console.log(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update kyc bank information');
    }
  }

  // --- Rendering Bank List Content ---
  const BankListContent = () => {
    if (loadingBanks) {
      // 💡 Display skeleton loading state when banks are fetching
      return (
        <div className="p-1 space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      );
    }

    if (banks.length === 0) {
      return <div className="p-2 text-center text-sm text-gray-500">No banks found.</div>;
    }

    return (
      <div className="overflow-y-auto max-h-[280px]">
        {banks.map((bank, i) => (
          <SelectItem
            key={bank.code || `${bank.name}-${i}`}
            value={bank.name}
            className="cursor-pointer"
          >
            {bank.name}
          </SelectItem>
        ))}
      </div>
    );
  };
  // ------------------------------------

  return (
    <section>
      <h1 className="mb-7 font-inter text-2xl font-bold text-zinc-800">Settlement KYC</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Bank Name Field */}
          <div>
            <ReHeading heading="Select your bank name" size={'base'} className="mb-3" />
            <FormField
              control={control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <SearchableSelect
                    type="bank"
                    options={banks}
                    onChange={field.onChange}
                    loading={loadingBanks}
                    placeholder="Select bank"
                    limit={25}
                  />
                  {errors.bankName && (
                    <p className="text-sm text-red-500">{errors.bankName.message}</p>
                  )}
                </FormItem>
              )}
            />
          </div>

          {/* Account Number Field */}
          <FormField
            control={control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <ReInput
                  label="Enter 10 digit account number"
                  placeholder="4234....."
                  type="number"
                  {...field}
                />
              </FormItem>
            )}
          />

          {/* Default payout checkbox */}
          <div className="flex items-center font-inter">
            <FormField
              control={control}
              name="isDefaultPayout"
              render={({ field }) => (
                <FormItem className="flex items-center space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="mr-2"
                    />
                  </FormControl>
                  <span className="text-sm text-gray-600">
                    Set this account as my default payout method
                  </span>
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-3 flex justify-end">
            <ReButton
              className="w-2/5 rounded-full bg-[#03045B] py-6 font-inter text-white sm:py-4"
              type="submit"
              isSubmitting={isSubmitting}
            >
              Submit
            </ReButton>
          </div>
        </form>
      </Form>
    </section>
  );
}
