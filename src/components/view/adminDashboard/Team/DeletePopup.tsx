import Image from 'next/image';

import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { DialogClose } from '@/components/ui/dialog';

export default function DeletePopup() {
  return (
    <section>
      <div>
        <ReHeading heading="Delete Confirmation" size={'lg'} />
        <div className=" my-5 flex items-center gap-5 border-y-2 border-dotted border-[#95ACAA] py-5">
          <div>
            <Image
              src="/assets/admin-dashboard/team/delete-Icon.svg"
              alt="delete icon"
              width={76}
              height={76}
            />
          </div>
          <div>
            <ReHeading heading="Are you sure you want to delete Role" />
            <p>This action cannot be undone. this role will deleted forever</p>
          </div>
        </div>
        <div className="flex items-end justify-end">
          <DialogClose>
            <ReButton className="w-fit bg-[#010101] hover:bg-[#010101]">Delete Role</ReButton>
          </DialogClose>
        </div>
      </div>
    </section>
  );
}
