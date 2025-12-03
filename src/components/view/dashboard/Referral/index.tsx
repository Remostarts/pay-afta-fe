'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Copy, Send } from 'lucide-react';

import ReForm from '@/components/re-ui/ReForm';
import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { z } from 'zod';
import { useGeneral } from '@/context/generalProvider';
import { inviteCounterParty } from '@/lib/actions/root/user.action';

const inviteSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

type InviteSchema = z.infer<typeof inviteSchema>;

export default function ReferralPage() {
  const { user } = useGeneral();

  const [copied, setCopied] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);

  const referralLink = `https://www.getpayafta.com/sign-up?ref=${user?.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 1500);
  };

  const sendInvite = async (data: InviteSchema) => {
    try {
      setInviteLoading(true);
      const result = await inviteCounterParty(data.email);
      if (result.success) {
        toast.success('Invite sent!', {
          description: `The invitation has been sent to ${data.email}.`,
        });
        setInviteLoading(false);
      } else {
        toast.error(result?.message || 'Invite failed, try again!');
      }
    } catch (error) {
      toast.error('Invite failed, try again!');
      setInviteLoading(false);
    }
  };

  return (
    <section className="max-w-lg mx-auto px-4 py-10">
      <Card className="shadow-sm border rounded-xl bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Referral</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Section Title */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Invite Someone to PayAfta</h2>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              Help someone start safer transactions on PayAfta. Share your unique link or send an
              invite directly.
            </p>
          </div>

          {/* Referral Link */}
          <div>
            <p className="font-medium text-gray-900 mb-2">Your Referral Link</p>

            <div className="flex items-center gap-2">
              <input
                readOnly
                value={referralLink}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Invite Form */}
          <div>
            <p className="font-medium text-gray-900 mb-2">Invite a Friend</p>

            <ReForm
              submitHandler={sendInvite}
              defaultValues={{ email: '' }}
              resolver={zodResolver(inviteSchema)}
            >
              <div className="space-y-4">
                <ReInput name="email" placeholder="Email Address" type="email" className="w-full" />

                <ReButton
                  type="submit"
                  className="w-full py-3 text-white bg-[#03045B] rounded-lg text-base flex items-center justify-center"
                  disabled={inviteLoading}
                >
                  {inviteLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Invite
                    </>
                  )}
                </ReButton>
              </div>
            </ReForm>
          </div>

          {/* Footer Text */}
          <p className="text-gray-600 text-sm leading-relaxed">
            Thank you for helping others discover secure escrow with PayAfta. Your invite helps us
            grow a safer, trusted community of buyers and sellers.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
