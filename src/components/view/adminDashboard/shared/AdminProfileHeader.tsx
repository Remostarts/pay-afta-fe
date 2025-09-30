import { Bell, BellDot, Search, Settings } from 'lucide-react';
import Image from 'next/image';
import { useParams, usePathname } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Notifications from '../../dashboard/shared/Notifications';

export default function AdminProfileHeader() {
  const pathName = usePathname();
  const pathArr = pathName.split('/');
  const headerName = pathArr[2];
  let dashboardName = '';

  if (headerName === 'users') {
    dashboardName = 'Users';
  } else if (headerName === 'transaction') {
    dashboardName = 'Transaction';
  } else if (headerName === 'payment-order') {
    dashboardName = 'Payment order';
  } else if (headerName === 'virtual-card') {
    dashboardName = 'Virtual card';
  } else if (headerName === 'team') {
    dashboardName = 'Team';
  } else if (headerName === 'setting') {
    dashboardName = 'Setting';
  }

  const handleNotificationBtn = () => {
    console.log('Notification button clicked at lawyer dashboard');
  };

  return (
    <section>
      <div className="flex items-center justify-between rounded-lg border-slate-300 bg-white p-4">
        <div>
          <span className="font-inter text-xl font-semibold">
            {(dashboardName || headerName) ?? 'Dashboard'}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative inline-block cursor-pointer">
            <Search />
          </div>
          <div className="relative inline-block cursor-pointer">
            <button>
              <Notifications handleNotificationBtn={handleNotificationBtn} />
            </button>
          </div>
          <Image
            src="/assets/admin-dashboard/users/prof-avatar.svg"
            alt="user-profile"
            width={40}
            height={40}
          />
        </div>
      </div>{' '}
    </section>
  );
}
