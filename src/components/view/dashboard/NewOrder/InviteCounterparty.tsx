'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import ReInput from '@/components/re-ui/re-input/ReInput';
import { inviteCounterParty } from '@/lib/actions/root/user.action';

// Validation schema
const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface InviteCounterpartyProps {
  onHandleEmailChange?: (email: string) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function InviteCounterparty({
  onSuccess,
  onCancel,
  onHandleEmailChange,
}: InviteCounterpartyProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
    },
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: InviteFormData) => {
    setIsSubmitting(true);

    try {
      const response = await inviteCounterParty(data.email);

      if (response.success) {
        onHandleEmailChange?.(data.email);
        toast.success(response.message || 'Invite sent successfully!');
        reset();
        onSuccess?.();
      } else {
        toast.error(response.message || 'Failed to send invite.');
      }
    } catch (error: any) {
      console.error('Error inviting counterparty:', error);
      toast.error(error?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel?.();
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
            <Button
              type="button"
              onClick={handleCancel}
              className="w-full border border-gray-300 rounded-full hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full bg-black text-white rounded-full hover:bg-gray-900 disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Invite & Continue'}
            </Button>
          </div>
        </form>
      </section>
    </FormProvider>
  );
}
