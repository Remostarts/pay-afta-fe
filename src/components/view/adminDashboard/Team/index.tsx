'use client';

import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import StatsSection from './StatsSection';
import { TeamDataTable } from './TeamDataTable';
import { RolesDataTable } from './RolesDataTable';
import FilterSection from './FilterSection';
import SuccessfulCard from './SuccessfulCard';

type TeamMember = {
  userId: string;
  name: string;
  role: string;
  action: string;
};

type Roles = {
  roleId: string;
  title: string;
  teamMembers: string;
  access: string;
  action: string;
};

type TabType = 'Role' | 'Team Members';

const columns: ColumnDef<TeamMember>[] = [
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
    cell({ row }) {
      const status = row.getValue('action') as string;

      const styles =
        {
          Active: 'bg-[#E9F5FB] text-[#0F973C] text-center py-1 text-sm font-medium font-inter',
          Pending: 'bg-[#E9F5FB] text-[#1F7EAD] text-center py-1 text-sm font-medium font-inter',
          Suspended: 'bg-[#FCE9E9] text-[#D42620] text-center py-1 text-sm font-medium font-inter',
        }[status] || '';

      return <div className={styles}>{status}</div>;
      //   console.log(status);
    },
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
    cell({ row }) {
      const status = row.getValue('action') as string;

      const styles =
        {
          Active: 'bg-[#E9F5FB] text-[#0F973C] text-center py-1 text-sm font-medium font-inter',
          Pending: 'bg-[#E9F5FB] text-[#1F7EAD] text-center py-1 text-sm font-medium font-inter',
          Suspended: 'bg-[#FCE9E9] text-[#D42620] text-center py-1 text-sm font-medium font-inter',
        }[status] || '';

      return <div className={styles}>{status}</div>;
      //   console.log(status);
    },
  },
];

const teamMemberData = [
  {
    userId: 'US-123456789',
    name: 'John Doe',
    role: 'Product',
    action: 'Pending',
  },
  {
    userId: 'US-123456789',
    name: 'Abram Lipshutz',
    role: 'Product',
    action: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Tiana Bergson',
    role: 'Product',
    action: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Cristofer Dias',
    role: 'Services',
    action: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Kadin Workman',
    role: 'Services',
    action: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Wilson Aminoff',
    role: 'Services',
    action: 'Suspended',
  },
  {
    userId: 'US-123456789',
    name: 'Phillip Passaquindici Arcand',
    role: 'Product',
    action: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Kianna Bator',
    role: 'Product',
    action: 'Suspended',
  },
  {
    userId: 'US-123456789',
    name: 'Tiana Levin',
    role: 'Product',
    action: 'Active',
  },
];

const teamRolesData = [
  {
    roleId: 'US-123456789',
    title: 'John Doe',
    teamMembers: '00',
    access: 'View Only Access',
    action: 'Pending',
  },
  {
    roleId: 'US-123456789',
    title: 'Abram Lipshutz',
    teamMembers: '00',
    access: 'View & Edit Access',
    action: 'Active',
  },
  {
    roleId: 'US-123456789',
    title: 'Tiana Bergson',
    teamMembers: '00',
    access: 'View Only Access',
    action: 'Active',
  },
  {
    roleId: 'US-123456789',
    title: 'Cristofer Dias',
    teamMembers: '00',
    access: 'View & Edit Access',
    action: 'Active',
  },
  {
    roleId: 'US-123456789',
    title: 'Kadin Workman',
    teamMembers: '00',
    access: 'View Only Access',
    action: 'Active',
  },
  {
    roleId: 'US-123456789',
    title: 'Wilson Aminoff',
    teamMembers: '00',
    access: 'View & Edit Access',
    action: 'Suspended',
  },
  {
    roleId: 'US-123456789',
    title: 'Phillip Passaquindici Arcand',
    teamMembers: '00',
    access: 'View & Edit Access',
    action: 'Active',
  },
  {
    roleId: 'US-123456789',
    title: 'Kianna Bator',
    teamMembers: '00',
    access: 'View Only Access',
    action: 'Suspended',
  },
  {
    roleId: 'US-123456789',
    title: 'Tiana Levin',
    teamMembers: '00',
    access: 'View Only Access',
    action: 'Active',
  },
];

export default function Team() {
  const [selectedTab, setSelectedTab] = useState<TabType>('Team Members');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [filteredTeamData, setFilteredTeamData] = useState<TeamMember[]>(teamMemberData);

  useEffect(() => {
    const filteredData = selectedStatus
      ? teamMemberData.filter((item) => item.role === selectedStatus)
      : teamMemberData;
    setFilteredTeamData(filteredData);
  }, [selectedStatus]);

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
          <TeamDataTable columns={columns} data={filteredTeamData} />
        ) : (
          <RolesDataTable columns={rolesColumns} data={teamRolesData} />
        )}
      </div>
    </section>
  );
}
