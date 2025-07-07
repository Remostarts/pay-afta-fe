'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@radix-ui/react-dialog';

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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="mb-3 w-full">
                User Agreemnt
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>User Agreemnt </DialogTitle>
                <DialogDescription>
                  Lorem ipsum dolor sit amet consectetur. Felis sed nulla nisi et dolor sed aenean.
                  Leo ornare nulla porta consectetur iaculis et lacus pellentesque. Fermentum
                  maecenas suspendisse nisi quis adipiscing quisque lobortis. Natoque tincidunt
                  pretium feugiat euismod sed commodo amet est.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-3 w-full" variant="outline">
                Privacy Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Privacy Policy</DialogTitle>
                <DialogDescription>
                  Lorem ipsum dolor sit amet consectetur. Felis sed nulla nisi et dolor sed aenean.
                  Leo ornare nulla porta consectetur iaculis et lacus pellentesque. Fermentum
                  maecenas suspendisse nisi quis adipiscing quisque lobortis. Natoque tincidunt
                  pretium feugiat euismod sed commodo amet est.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                Terms of service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Terms of service</DialogTitle>
                <DialogDescription>
                  Lorem ipsum dolor sit amet consectetur. Felis sed nulla nisi et dolor sed aenean.
                  Leo ornare nulla porta consectetur iaculis et lacus pellentesque. Fermentum
                  maecenas suspendisse nisi quis adipiscing quisque lobortis. Natoque tincidunt
                  pretium feugiat euismod sed commodo amet est.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
