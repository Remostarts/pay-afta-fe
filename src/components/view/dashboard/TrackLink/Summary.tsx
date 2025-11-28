import { UserRole } from './TransactionsSummaryBase';

interface SummaryProps {
  showActions?: boolean;
  userRole: UserRole;
  name: string;
  paymentMethod: string;
  deliveryDate: string;
  item: string;
  quantity: number;
  price: number;
}

export default function Summary({
  showActions,
  userRole,
  name,
  paymentMethod,
  deliveryDate,
  item,
  quantity,
  price,
}: SummaryProps) {
  return (
    <div className="w-full rounded-2xl bg-card shadow-sm border border-border p-8 bg-white">
      <h2 className="mb-8 text-3xl font-bold text-foreground tracking-tight">
        Transaction Summary
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 pb-6 border-b border-border">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Name</p>
            <p className="text-lg font-semibold text-foreground">{name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pb-6 border-b border-border">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Payment Method</p>
            <p className="text-lg font-semibold text-foreground">{paymentMethod}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pb-6 border-b border-border">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Delivery Date</p>
            <p className="text-lg font-semibold text-foreground">{deliveryDate}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground mb-4">Item</p>
          <div className="rounded-lg bg-secondary/50 p-6 border border-border/50">
            <div className="mb-6">
              <p className="text-base font-medium text-foreground">{item}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border/30">
                <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                <p className="text-sm font-semibold text-foreground">{quantity}</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <p className="text-sm font-medium text-muted-foreground">Price</p>
                <p className="text-lg font-bold text-primary">₦{price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
