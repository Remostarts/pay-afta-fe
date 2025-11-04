'use client';

import { useState } from 'react';

import ChangePasswordModal from './ChangePasswordModal';
import ChangeTransactionPinModal from './ChangeTransactionPinModal';

import { ReHeading } from '@/components/re-ui/ReHeading';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function Security() {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);

  return (
    <div className="grid gap-4 rounded-lg border-b bg-white p-3 pb-10 md:grid-cols-2">
      <div>
        <ReHeading heading="Security" className="mb-4 text-xl font-semibold" />
      </div>
      <div>
        <div>
          <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="mb-3 w-full">
                Change Password
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogDescription>
                  <ChangePasswordModal dialogClose={setPasswordDialogOpen} />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Dialog open={pinDialogOpen} onOpenChange={setPinDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mb-3 w-full" variant="outline">
                Change Transaction Pin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogDescription>
                  <ChangeTransactionPinModal dialogClose={setPinDialogOpen} />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
