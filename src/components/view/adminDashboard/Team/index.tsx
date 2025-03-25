'use client';

import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { FilePenLine, Trash2 } from 'lucide-react';
import Image from 'next/image';

import { useDialog } from '../../../../hooks/useDialog';

import StatsSection from './StatsSection';
import { TeamDataTable } from './TeamDataTable';
import { RolesDataTable } from './RolesDataTable';
import FilterSection from './FilterSection';
import UpdateTeam from './UpdateTeam';
import UpdateRole from './UpdateRole';
import DeletePopup from './DeletePopup';
import SuccessfulCard from './SuccessfulCard';

import { ReDialog } from '@/components/re-ui/ReDialog';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { ReButton } from '@/components/re-ui/ReButton';

type TeamMember = {
  userId: string;
  name: string;
  role: string;
  // action: string;
};

type Roles = {
  roleId: string;
  title: string;
  teamMembers: string;
  access: string;
  // action: string;
};

type TabType = 'Role' | 'Team Members';

const teamMemberData = [
  {
    userId: 'US-123456789',
    name: 'John Doe',
    role: 'Super Admin',
    // action: 'Pending',
  },
  {
    userId: 'US-123456789',
    name: 'Abram Lipshutz',
    role: 'Super Admin',
    // action: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Tiana Bergson',
    role: 'Admin',
    // action: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Cristofer Dias',
    role: 'Admin',
    // action: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Kadin Workman',
    role: 'Admin',
    // action: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Wilson Aminoff',
    role: 'Super Admin',
    // action: 'Suspended',
  },
  {
    userId: 'US-123456789',
    name: 'Phillip Passaquindici Arcand',
    role: 'Admin',
    // action: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Kianna Bator',
    role: 'Admin',
    // action: 'Suspended',
  },
  {
    userId: 'US-123456789',
    name: 'Tiana Levin',
    role: 'Admin',
    // action: 'Active',
  },
];

const teamRolesData = [
  {
    roleId: 'US-123456789',
    title: 'John Doe',
    teamMembers: '00',
    access: 'View Only Access',
    // action: 'Pending',
  },
  {
    roleId: 'US-123456789',
    title: 'Abram Lipshutz',
    teamMembers: '00',
    access: 'View & Edit Access',
    // action: 'Active',
  },
  {
    roleId: 'US-123456789',
    title: 'Tiana Bergson',
    teamMembers: '00',
    access: 'View Only Access',
    // action: 'Active',
  },
  {
    roleId: 'US-123456789',
    title: 'Cristofer Dias',
    teamMembers: '00',
    access: 'View & Edit Access',
    // action: 'Active',
  },
  {
    roleId: 'US-123456789',
    title: 'Kadin Workman',
    teamMembers: '00',
    access: 'View Only Access',
    // action: 'Active',
  },
  {
    roleId: 'US-123456789',
    title: 'Wilson Aminoff',
    teamMembers: '00',
    access: 'View & Edit Access',
    // action: 'Suspended',
  },
  {
    roleId: 'US-123456789',
    title: 'Phillip Passaquindici Arcand',
    teamMembers: '00',
    access: 'View & Edit Access',
    // action: 'Active',
  },
  {
    roleId: 'US-123456789',
    title: 'Kianna Bator',
    teamMembers: '00',
    access: 'View Only Access',
    // action: 'Suspended',
  },
  {
    roleId: 'US-123456789',
    title: 'Tiana Levin',
    teamMembers: '00',
    access: 'View Only Access',
    // action: 'Active',
  },
];

export default function Team() {
  const [selectedTab, setSelectedTab] = useState<TabType>('Team Members');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [filteredTeamData, setFilteredTeamData] = useState<TeamMember[]>(teamMemberData);
  // const { currentStep, nextStep } = useDialog(1, 2);
  const [TeamData, setTeamData] = useState<TeamMember[]>([]);
  const [rolesData, setRolesData] = useState<Roles[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleDelete = (item: any) => {
    console.log(item);
  };

  const handleEdit = (item: any) => {
    console.log(item);
  };

  // function onNextForTeamDialog() {
  //   setCurrentStepForTeamDialog(2);
  // }

  // function onClosedForTeamDialog() {
  //   setCurrentStepForTeamDialog(1);
  // }

  // const renderTeamDialogContent = () => {
  //   switch (currentStepForTeamDialog) {
  //     case 1:
  //       return <UpdateTeam onNext={onNextForTeamDialog} />;
  //     case 2:
  //       return (
  //         <SuccessfulCard
  //           desc="Team dialog Content"
  //           heading="Team"
  //           onClosed={onClosedForTeamDialog}
  //         />
  //       );
  //     default:
  //       return null;
  //   }
  // };

  // const renderRolesDialogContent = () => {
  //   switch (currentStep) {
  //     case 1:
  //       return <UpdateRole onNext={nextStep} />;
  //     case 2:
  //       return <SuccessfulCard desc="Roles dialog content" heading="Roles" onClosed={nextStep} />;
  //     default:
  //       return null;
  //   }
  // };

  const teamColumns: ColumnDef<TeamMember>[] = [
    {
      accessorKey: 'userId',
      header: 'USER ID',
    },
    {
      accessorKey: 'name',
      header: 'FULL NAME',
    },
    {
      accessorKey: 'role',
      header: 'ROLE',
    },
    {
      accessorKey: 'action',
      header: 'ACTION',
      cell: ({ row }) => (
        <div className="flex items-center gap-10">
          <ReDialog
            DialogComponent={DeletePopup}
            btnLabel={<Trash2 color="#D42620" size={20} />}
            onClick={() => handleDelete(row.original)}
            classNames="w-fit lg:px-2 bg-[#FCE9E9]"
          />

          <ReDialog
            DialogComponent={UpdateTeam}
            // componentProps={{ onNext: onNextForTeamDialog }}
            btnLabel={<FilePenLine color="#010101" size={20} />}
            onClick={() => handleEdit(row.original)}
            classNames="w-fit lg:px-2 bg-[#F2F2F2]"
          />
        </div>
      ),
    },
  ];

  const rolesColumns: ColumnDef<Roles>[] = [
    {
      accessorKey: 'roleId',
      header: 'ROLE ID',
    },
    {
      accessorKey: 'title',
      header: 'TITLE',
    },
    {
      accessorKey: 'teamMembers',
      header: 'TEAM MEMBERS',
    },
    {
      accessorKey: 'access',
      header: 'ACCESS',
    },
    {
      accessorKey: 'action',
      header: 'ACTION',
      cell: ({ row }) => (
        <div className="flex items-center gap-10">
          <ReDialog
            DialogComponent={DeletePopup}
            btnLabel={<Trash2 color="#D42620" size={20} />}
            onClick={() => handleDelete(row.original)}
            classNames="w-fit lg:px-2 bg-[#FCE9E9]"
          />

          <ReDialog
            DialogComponent={UpdateRole}
            btnLabel={<FilePenLine color="#010101" size={20} />}
            onClick={() => handleEdit(row.original)}
            classNames="w-fit lg:px-2 bg-[#F2F2F2]"
          />
        </div>
      ),
    },
  ];

  function handlePageChange(pageNumber: any) {
    try {
      console.log(pageNumber);
      setTimeout(() => {
        setTeamData(teamMemberData);
        setRolesData(teamRolesData);
        setIsLoading(false);
      }, 5000);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handlePageChange(1);
  }, []);

  // useEffect(() => {
  //   const filteredData = selectedStatus
  //     ? teamMemberData.filter((item) => item.role === selectedStatus)
  //     : teamMemberData;
  //   setFilteredTeamData(filteredData);
  // }, [selectedStatus]);

  // console.log(selectedTab);

  return (
    <section>
      <StatsSection />
      <div className="mt-3">
        <FilterSection
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          onStatusChange={setSelectedStatus}
        />
      </div>
      <div className="container mx-auto rounded-md bg-white p-5">
        {selectedTab === 'Team Members' ? (
          <TeamDataTable
            columns={teamColumns}
            data={TeamData}
            isLoading={isLoading}
            onPageChange={handlePageChange}
          />
        ) : (
          <RolesDataTable
            columns={rolesColumns}
            data={rolesData}
            isLoading={isLoading}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
}
