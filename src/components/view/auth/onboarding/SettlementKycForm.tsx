'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { TSettlementKyc, settlementKycSchema } from '@/lib/validations/onboarding.validation';
import {
  addSettlementBankAccount,
  getPillaBanks,
} from '@/lib/actions/onboarding/onboarding.actions';
import { useGeneral } from '@/context/generalProvider';
import { SearchableSelect } from '@/components/re-ui/SearchableSelect';

interface SettlementKycFormProps {
  onComplete?: (data: TSettlementKyc) => void;
}

type Bank = { name: string; code: string };

const defaultValues: TSettlementKyc = {
  bankName: '',
  accountNumber: '',
  bankCode: '',
  isDefaultPayout: false,
};

export default function SettlementKycForm({ onComplete }: SettlementKycFormProps) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const { loadUserData } = useGeneral();

  const form = useForm<TSettlementKyc>({
    resolver: zodResolver(settlementKycSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, control, watch, setValue, formState } = form;
  const { isSubmitting, errors } = formState;
  const selectedBankName = watch('bankName');

  useEffect(() => {
    async function fetchBanks() {
      try {
        setLoadingBanks(true);
        const res = await getPillaBanks();
        setBanks(res?.data || []);
      } catch {
        toast.error('Failed to load bank list');
        setBanks([]);
      } finally {
        setLoadingBanks(false);
      }
    }
    fetchBanks();
  }, []);

  useEffect(() => {
    if (selectedBankName && banks.length > 0) {
      const selected = banks.find((b) => b.name === selectedBankName);
      if (selected) setValue('bankCode', selected.code, { shouldValidate: true });
    } else {
      setValue('bankCode', '');
    }
  }, [selectedBankName, banks, setValue]);

  async function onSubmit(data: TSettlementKyc) {
    try {
      const result = await addSettlementBankAccount(data);
      if (result.success) {
        toast.success(result.message);
        await loadUserData();
        onComplete?.(data);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update bank info');
    }
  }

  return (
    <section>
      <h1 className="mb-7 text-2xl font-bold text-zinc-800">Settlement KYC</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <ReHeading heading="Select your bank name" size="base" className="mb-3" />
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

          <FormField
            control={control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <ReInput
                  label="Enter 10-digit account number"
                  placeholder="4234....."
                  type="number"
                  {...field}
                />
              </FormItem>
            )}
          />

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
                    Set this as my default payout account
                  </span>
                </FormItem>
              )}
            />
          </div>

          <div className="mt-3 flex justify-end">
            <ReButton
              className="w-2/5 rounded-full bg-[#03045B] py-6 text-white sm:py-4"
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
