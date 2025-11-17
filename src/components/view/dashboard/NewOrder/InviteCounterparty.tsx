'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ReInput from '@/components/re-ui/re-input/ReInput';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import { inviteCounterParty } from '@/lib/actions/root/user.action';

export default function InviteCounterparty() {
  const methods = useForm<{ email: string }>();
  const { handleSubmit } = methods;
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    try {
      const response = await inviteCounterParty(data.email);
      if (response.success) {
        toast.success(response.message || 'Invite sent successfully!');
      } else {
        toast.error(response.message || 'Failed to send invite.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <section className="mx-auto w-full max-w-md">
        <h1 className="font-inter text-xl font-bold text-gray-900">Invite Counterparty</h1>
        <p className="mt-1 font-inter text-sm text-gray-600 leading-relaxed">
          We need their contact information to send them a secure invitation.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <ReInput name="email" label="Email Address" placeholder="example@gmail.com" />

          <div className="flex justify-between gap-2 mt-5">
            <Button type="button" className="w-full border border-[#CCCCCC] rounded-full">
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full bg-black text-white rounded-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Invite & Continue'}
            </Button>
          </div>
        </form>
      </section>
    </FormProvider>
  );
}
