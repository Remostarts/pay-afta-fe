import { Bell, Search, Settings } from 'lucide-react';
import Image from 'next/image';

export default function AdminProfileHeader() {
  return (
    <section>
      <div className="flex items-center justify-between rounded-lg border-slate-300 bg-white p-4">
        <div>
          <span className="font-inter text-xl font-semibold">Dashboard</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative inline-block cursor-pointer">
            <Search />
          </div>
          <Image
            src="/assets/admin-dashboard/dashboard/user-profile.png"
            alt="user-profile"
            width={40}
            height={40}
          />
        </div>
      </div>{' '}
    </section>
  );
}
