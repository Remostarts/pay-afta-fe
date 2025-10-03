import { MessageNotification } from '@/types/messageNotification.type';

interface MilestoneDetailsProps {
  notification: MessageNotification;
}

export function MilestoneDetails({ notification }: MilestoneDetailsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Milestone Details</h2>
      <p>{notification.message}</p>
      <div className="rounded-md bg-orange-100 p-4">
        <h3 className="font-medium text-orange-800">Next Steps:</h3>
        <ul className="mt-2 list-inside list-disc text-orange-700">
          <li>Review project timeline</li>
          <li>Update stakeholders</li>
          <li>Prepare progress report</li>
        </ul>
      </div>
    </div>
  );
}
