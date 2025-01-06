import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import ReInput from '@/components/re-ui/re-input/ReInput';
import RePassInput from '@/components/re-ui/re-input/RePassInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReSelect from '@/components/re-ui/ReSelect';
import { Form } from '@/components/ui/form';

interface ICreateTeam {
  role: string;
  fullName: string;
  email: string;
  createPassword: string;
}

const defaultValues = {
  role: '',
  fullName: '',
  email: '',
  createPassword: '',
};

const createTeamSchema = z.object({
  role: z.string().min(1, 'Select an option.'),
  fullName: z.string().min(1, 'Enter the full name'),
  email: z.string().min(1, 'Enter the email.'),
  createPassword: z.string().min(1, 'Create strong password.'),
});

type TCreateTeam = z.infer<typeof createTeamSchema>;

type ICreateTeamProps = {
  onNext: () => void;
};

export default function CreateTeam({ onNext }: ICreateTeamProps) {
  const form = useForm<TCreateTeam>({
    resolver: zodResolver(createTeamSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const { formState, handleSubmit } = form;
  const { errors, isSubmitting } = formState;

  const onSubmit = async (data: ICreateTeam) => {
    console.log(data);
    onNext();
  };

  return (
    <section>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <ReHeading heading="Add Team Member" size={'2xl'} />
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
            <div>
              <ReHeading heading="Create Password" size={'base'} />
              <RePassInput name="createPassword" />
            </div>
            <div>
              <ReButton className="mt-4 bg-[#1F7EAD] text-white hover:bg-[#1F7EAD]" type="submit">
                Create User
              </ReButton>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
}
