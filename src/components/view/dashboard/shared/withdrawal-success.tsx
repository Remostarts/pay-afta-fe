import { MessageNotification } from '@/types/messageNotification.type';

interface WithdrawalProps {
  notification: MessageNotification;
}

export function WithdrawalSuccess({ notification }: WithdrawalProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Withdrawal Details</h2>
      <p>{notification.message}</p>
      <div className="rounded-md bg-green-100 p-4">
        <h3 className="font-medium text-green-800">Agenda:</h3>
        <ol className="mt-2 list-inside list-decimal text-green-700">
          <li>Project updates</li>
          <li>Blockers and challenges</li>
          <li>Next sprint planning</li>
          <li>Q&A</li>
        </ol>
      </div>
      <button className="rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600">
        Join Meeting
      </button>
    </div>
  );
}
