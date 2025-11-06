export const metadata = {
  title: 'Track Your Order - PayAfta',
  description: 'Track your delivery status in real-time with PayAfta logistics service',
};

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
