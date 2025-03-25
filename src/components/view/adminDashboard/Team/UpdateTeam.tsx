import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';

import ReInput from '@/components/re-ui/re-input/ReInput';
import RePassInput from '@/components/re-ui/re-input/RePassInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReSelect from '@/components/re-ui/ReSelect';
import { Form } from '@/components/ui/form';

const defaultValues = {
  role: '',
  fullName: '',
  email: '',
};

const updateTeamSchema = z.object({
  role: z.string().min(1, 'Select an option.'),
  fullName: z.string().min(1, 'Enter the full name'),
  email: z.string().min(1, 'Enter the email.'),
});

type TUpdateTeam = z.infer<typeof updateTeamSchema>;

type IUpdateTeam = {
  onNext: () => void;
};

export default function UpdateTeam({ onNext }: IUpdateTeam) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const form = useForm<TUpdateTeam>({
    resolver: zodResolver(updateTeamSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const { formState, handleSubmit } = form;
  const { errors, isSubmitting } = formState;

  const onSubmit = async (data: TUpdateTeam) => {
    console.log(data);
    // onNext();
    if (closeButtonRef.current) {
      closeButtonRef.current.click();
    }
  };

  return (
    <section>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <ReHeading heading="Edit Team Member" size={'2xl'} className="mb-5" />
            <div>
              <ReHeading heading="Role" size={'base'} />
              <ReSelect
                name="role"
                options={[
                  { label: 'Super Admin', value: 'Super Admin' },
                  { label: 'Admin', value: 'Admin' },
                ]}
              />
            </div>
            <div>
              <ReHeading heading="Full Name" size={'base'} />
              <ReInput name="fullName" />
            </div>
            <div>
              <ReHeading heading="Email" size={'base'} />
              <ReInput name="email" />
            </div>
            <div className=" flex items-end justify-end">
              <ReButton
                ref={closeButtonRef}
                isSubmitting={isSubmitting}
                className="mt-3 w-fit bg-[#1F7EAD] text-white hover:bg-[#1F7EAD]"
                type="submit"
              >
                Save Changes
              </ReButton>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
}
