'use client';

import Link from 'next/link';

import { ReHeading } from '@/components/re-ui/ReHeading';
import { DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function Compliance() {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-lg bg-white p-3 pb-10">
      <div>
        <ReHeading heading="Legal & Compliance" className="mb-4 text-xl font-semibold" />
      </div>
      <div>
        <div>
          <Link href="/refund-policy">
            <Button className="mb-3 w-full" variant="outline">
              User Agreemnt
            </Button>
          </Link>
        </div>
        <div>
          <Link href="/privacy-policy">
            <Button className="mb-3 w-full" variant="outline">
              Privacy Policy
            </Button>
          </Link>
        </div>
        <div>
          <Link href="/terms-and-condition">
            <Button className="w-full" variant="outline">
              Terms of service
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
