'use client';

// import { stat } from 'fs';

import Image from 'next/image';
import { CirclePlus } from 'lucide-react';
import { useState } from 'react';

import CreateTeam from './CreateTeam';
import CreateRole from './CreateRole';
import SuccessfulCard from './SuccessfulCard';

import { ReButton } from '@/components/re-ui/ReButton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function StatsSection() {
  const [teamMemberDialogSteper, setTeamMemberDialogSteper] = useState<number>(1);
  const [rolesDialogSteper, setRolesDialogSteper] = useState<number>(1);

  const onNextStep = () => {
    setTeamMemberDialogSteper(2);
  };

  const onNext = () => {
    setRolesDialogSteper(2);
  };

  const onClosedStep = () => {
    setTimeout(() => {
      setTeamMemberDialogSteper(1);
      setRolesDialogSteper(1);
    }, 300);
  };

  return (
    <div className="mt-5 grid w-full md:grid-cols-2">
      <div className="ml-2 mt-2 flex items-center justify-between gap-5 rounded-lg border bg-white p-8">
        <div className="flex items-center gap-5">
          <div>
            <Image src="/assets/admin-dashboard/team/team.svg" alt="team" width={40} height={40} />
          </div>
          <div>
            <p className="font-inter text-sm text-gray-600">Team Members</p>
            <p className="font-inter text-lg font-semibold">8</p>
          </div>
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <ReButton className="flex items-center gap-3 bg-[#E9F5FB] text-[#1F7EAD] hover:bg-[#E9F5FB]">
                <CirclePlus />
                New Member
              </ReButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              {teamMemberDialogSteper === 1 && <CreateTeam onNext={onNextStep} />}
              {teamMemberDialogSteper === 2 && (
                <SuccessfulCard
                  onClosed={onClosedStep}
                  heading={'Team Member Added'}
                  desc={'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus, nobis!'}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="ml-2 mt-2 flex items-center justify-between gap-5 rounded-lg border bg-white p-8">
        <div className="flex items-center gap-5">
          <div>
            <Image
              src="/assets/admin-dashboard/team/roles.svg"
              alt="roles"
              width={40}
              height={40}
            />
          </div>
          <div>
            <p className="font-inter text-sm text-gray-600">Roles</p>
            <p className="font-inter text-lg font-semibold">5</p>
          </div>
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <ReButton className="flex items-center gap-3 bg-[#E9F5FB] text-[#1F7EAD] hover:bg-[#E9F5FB]">
                <CirclePlus />
                New Role
              </ReButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              {rolesDialogSteper === 1 && <CreateRole onNext={onNext} />}
              {rolesDialogSteper === 2 && (
                <SuccessfulCard
                  onClosed={onClosedStep}
                  heading="Role Created"
                  desc={'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus, nobis!'}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
