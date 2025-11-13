'use client';

import { useEffect } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ReInput from '@/components/re-ui/re-input/ReInput';
import { useGeneral } from '@/context/generalProvider';
import { userProfileUpdate } from '@/lib/actions/root/user.action';
import { ReButton } from '@/components/re-ui/ReButton';

// 🛠️ Validation schema
const socialSchema = z.object({
  instagram: z.string().nullable(),
  facebook: z.string().nullable(),
  twitter: z.string().nullable(),
  tiktok: z.string().nullable(),
});

type TSocialInputs = z.infer<typeof socialSchema>;

export default function Social() {
  const { user, loadUserData } = useGeneral();

  // ✅ Default values from user
  const defaultValues: TSocialInputs = {
    instagram: user?.profile?.instagram ?? '',
    facebook: user?.profile?.facebook ?? '',
    twitter: user?.profile?.twitter ?? '',
    tiktok: user?.profile?.tiktok ?? '',
  };

  const socialForm = useForm<TSocialInputs>({
    resolver: zodResolver(socialSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, register, formState } = socialForm;
  const { isSubmitting } = formState;

  const onSubmit: SubmitHandler<TSocialInputs> = async (data) => {
    try {
      const payload = {
        instagram: data.instagram || null,
        facebook: data.facebook || null,
        twitter: data.twitter || null,
        tiktok: data.tiktok || null,
      };

      const response = await userProfileUpdate(payload);

      if (response.success) {
        toast.success('Social profiles updated successfully');
        loadUserData();
      } else {
        toast.error(response.error || 'Failed to update social profiles');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong, please try again.'
      );
    }
  };

  // 🔄 Sync form values when user data changes
  useEffect(() => {
    socialForm.reset({
      instagram: user?.profile?.instagram ?? '',
      facebook: user?.profile?.facebook ?? '',
      twitter: user?.profile?.twitter ?? '',
      tiktok: user?.profile?.tiktok ?? '',
    });
  }, [user]);

  return (
    <div className="p-8">
      <h3 className="mb-4 text-xl font-semibold">Social</h3>
      <div className="mx-auto max-w-xl rounded-lg border bg-white p-8">
        <FormProvider {...socialForm}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <ReInput
                {...register('instagram')}
                name="instagram"
                label="Instagram Username"
                placeholder="www.instagram.com/"
              />
            </div>

            <div>
              <ReInput
                {...register('facebook')}
                name="facebook"
                label="Facebook Username"
                placeholder="www.facebook.com/"
              />
            </div>

            <div>
              <ReInput
                {...register('twitter')}
                name="twitter"
                label="Twitter Username"
                placeholder="www.twitter.com/"
              />
            </div>

            <div>
              <ReInput
                {...register('tiktok')}
                name="tiktok"
                label="Tiktok Username"
                placeholder="www.tiktok.com/"
              />
            </div>

            <div className="mt-6 flex justify-end">
              <ReButton
                disabled={isSubmitting || !user}
                className="w-full rounded-full bg-[#03045B] py-6 font-inter font-semibold text-white sm:py-7 sm:text-lg"
                type="submit"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </ReButton>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
