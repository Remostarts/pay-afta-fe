'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import ReInput from '@/components/re-ui/re-input/ReInput';
import RePassInput from '@/components/re-ui/re-input/RePassInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { changePassword } from '@/lib/actions/auth/signup.actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,100}$/;

export const resetPasswordSchema = z
  .object({
    currentPassword: z.string({
      required_error: 'Current password is required',
    }),
    newPassword: z
      .string({
        required_error: 'New password is required',
      })
      .min(6, 'Password too short - should be 6 chars minimum')
      .max(100, 'Password too long - should be 100 chars maximum')
      .regex(
        passwordRegex,
        'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
      ),
    confirmNewPassword: z.string({
      required_error: 'Confirm password is required',
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

export type TChangePassInputs = z.infer<typeof resetPasswordSchema>;

const defaultValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

export default function Profile() {
  const form = useForm<TChangePassInputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, register, formState } = form;

  const { isSubmitting } = formState;

  const onSubmit: SubmitHandler<TChangePassInputs> = async (data) => {
    console.log(data);
  };

  return (
    <div className="rounded-lg bg-white p-3">
      {/* profile information  */}
      <div className="grid grid-cols-2 gap-4 border-b pb-10">
        <div>
          <ReHeading heading="Profile Information" className="mb-4 text-xl font-semibold" />
        </div>
        <div className="grid gap-4">
          <div className="col-span-2">
            <ReInput name="firstName" label="First Name" placeholder="Cameron" readonly={true} />
          </div>
          <div className="col-span-2">
            <ReInput name="lastName" label="Last Name" placeholder="Williamson" readonly={true} />
          </div>
          <div className="col-span-2">
            <ReInput
              name="phone"
              label="Phone Number"
              placeholder="+234-9033-2314-423"
              readonly={true}
            />
          </div>
          <div className="col-span-2">
            <ReInput
              name="email"
              label="Email"
              placeholder="Kelly.Heller@gmail.com"
              readonly={true}
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <ReInput name="DOB" label="Date of Birth" placeholder="12/04/2024" readonly={true} />
            </div>
            <div>
              <ReInput name="gender" label="Gender" placeholder="Male" readonly={true} />
            </div>
          </div>
          <div className="col-span-2">
            <ReButton className="mt-5 rounded-full lg:w-2/5" disabled={true}>
              {' '}
              Edit Information
            </ReButton>
          </div>
        </div>
      </div>

      {/* Settlement Account   */}
      <div className="grid grid-cols-2 gap-4 rounded-lg border-b bg-white p-3 pb-10">
        <div>
          <ReHeading heading="Profile Information" className="mb-4 text-xl font-semibold" />
        </div>
        <div>
          <div className="rounded-lg border-2 border-dashed border-gray-200 bg-slate-100 p-5">
            <div className="flex flex-col">
              <span>Sterling Bank</span>
              <span className="text-2xl font-black">01102254</span>
              <span>Pual Falade</span>
            </div>
          </div>
          <div>
            <ReButton className="mt-5 rounded-full lg:w-2/5"> Edit Bank Details</ReButton>
          </div>
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="grid grid-cols-2 gap-4 rounded-lg border-b bg-white p-3 pb-10">
        <div>
          <ReHeading heading="Security & Privacy" className="mb-4 text-xl font-semibold" />
        </div>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <RePassInput
                {...register('currentPassword')}
                name="currentPassword"
                label="Old Password"
                required
              />
            </div>
            <div>
              <RePassInput
                {...register('newPassword')}
                name="newPassword"
                label="New Password"
                required
              />
            </div>
            <div>
              <RePassInput
                {...register('confirmNewPassword')}
                name="confirmNewPassword"
                label="Confirm Password"
                required
              />
            </div>
            <ReButton
              disabled={isSubmitting}
              isSubmitting={isSubmitting}
              type="submit"
              className="rounded-full text-white lg:w-2/5"
            >
              Submit
            </ReButton>
          </form>
        </FormProvider>
      </div>

      {/* Legal & Compliance */}
      <div className="grid grid-cols-2 gap-4 rounded-lg bg-white p-3 pb-10">
        <div>
          <ReHeading heading="Legal & Compliance" className="mb-4 text-xl font-semibold" />
        </div>
        <div>
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mb-3 w-full">
                  User Agreemnt
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>User Agreemnt </DialogTitle>
                  <DialogDescription>
                    Lorem ipsum dolor sit amet consectetur. Felis sed nulla nisi et dolor sed
                    aenean. Leo ornare nulla porta consectetur iaculis et lacus pellentesque.
                    Fermentum maecenas suspendisse nisi quis adipiscing quisque lobortis. Natoque
                    tincidunt pretium feugiat euismod sed commodo amet est.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mb-3 w-full" variant="outline">
                  Privacy Policy
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Privacy Policy</DialogTitle>
                  <DialogDescription>
                    Lorem ipsum dolor sit amet consectetur. Felis sed nulla nisi et dolor sed
                    aenean. Leo ornare nulla porta consectetur iaculis et lacus pellentesque.
                    Fermentum maecenas suspendisse nisi quis adipiscing quisque lobortis. Natoque
                    tincidunt pretium feugiat euismod sed commodo amet est.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  Terms of service
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Terms of service</DialogTitle>
                  <DialogDescription>
                    Lorem ipsum dolor sit amet consectetur. Felis sed nulla nisi et dolor sed
                    aenean. Leo ornare nulla porta consectetur iaculis et lacus pellentesque.
                    Fermentum maecenas suspendisse nisi quis adipiscing quisque lobortis. Natoque
                    tincidunt pretium feugiat euismod sed commodo amet est.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}