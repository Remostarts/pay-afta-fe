import { Phone, MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function ContactButtons() {
  return (
    <div className="flex items-center justify-between border-t pt-2">
      <span className="font-semibold text-gray-900">Contact Seller</span>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="bg-transparent p-2">
          <Phone className="size-4 text-blue-600" />
        </Button>
        <Button size="sm" variant="outline" className="bg-transparent p-2">
          <MessageCircle className="size-4 text-green-600" />
        </Button>
      </div>
    </div>
  );
}
