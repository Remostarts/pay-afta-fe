'use client';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TransactionModalProps {
  // isOpen: boolean;
  // onClose: () => void;
  transaction: {
    id: string;
    userId: string;
    fullName: string;
    status: 'Successful' | 'Failed' | 'Pending';
    type: string;
    amount: string;
    senderBank: string;
    senderAccount: string;
    senderName: string;
    reference: string;
    date: string;
  };
  row: any;
}

export default function TransactionModal({ transaction, row }: TransactionModalProps) {
  console.log(row);
  return (
    <section>
      <div className="space-y-6 rounded-md bg-white p-6">
        <div className="space-y-4">
          <h3 className="font-medium">User Details</h3>
          <div className="flex items-start gap-3">
            <Avatar className="size-12">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">#{transaction.userId}</div>
              <div className="font-medium">{transaction.fullName}</div>
              <p className="text-sm text-blue-500 hover:underline">View Profile</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-[120px,1fr] items-center gap-4 text-sm">
            <div className="text-gray-500">Status</div>
            <Badge className="w-fit bg-green-100 text-green-700">{transaction.status}</Badge>
          </div>

          <div className="grid grid-cols-[120px,1fr] items-center gap-4 text-sm">
            <div className="text-gray-500">Transaction Type</div>
            <div>{transaction.type}</div>
          </div>

          <div className="grid grid-cols-[120px,1fr] items-center gap-4 text-sm">
            <div className="text-gray-500">Amount</div>
            <div className="font-medium">{transaction.amount}</div>
          </div>

          <div className="grid grid-cols-[120px,1fr] items-center gap-4 text-sm">
            <div className="text-gray-500">Sender Bank</div>
            <div>{transaction.senderBank}</div>
          </div>

          <div className="grid grid-cols-[120px,1fr] items-center gap-4 text-sm">
            <div className="text-gray-500">Sender Acct No.</div>
            <div>{transaction.senderAccount}</div>
          </div>

          <div className="grid grid-cols-[120px,1fr] items-center gap-4 text-sm">
            <div className="text-gray-500">Sender Name</div>
            <div>{transaction.senderName}</div>
          </div>

          <div className="grid grid-cols-[120px,1fr] items-center gap-4 text-sm">
            <div className="text-gray-500">Transaction ID</div>
            <div>#{transaction.id}</div>
          </div>

          <div className="grid grid-cols-[120px,1fr] items-center gap-4 text-sm">
            <div className="text-gray-500">Reference ID</div>
            <div className="break-all">{transaction.reference}</div>
          </div>

          <div className="grid grid-cols-[120px,1fr] items-center gap-4 text-sm">
            <div className="text-gray-500">Date</div>
            <div>{transaction.date}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
