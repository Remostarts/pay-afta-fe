'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Save, UserPlus, Briefcase, Calendar, CheckCircle, FileText } from 'lucide-react';

import ReForm from '@/components/re-ui/ReForm';
import ReInput from '@/components/re-ui/re-input/ReInput';
import ReSelect from '@/components/re-ui/ReSelect';
import { ReTextarea } from '@/components/re-ui/ReTextarea';
import ReDatePicker from '@/components/re-ui/ReDatePicker';
import { ReButton } from '@/components/re-ui/ReButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  referralSchema,
  referralDefaultValues,
  TReferralSchema,
} from '@/lib/validations/referral.validation';

// Options for select fields
const relationshipOptions = [
  { value: 'colleague', label: 'Colleague' },
  { value: 'former_colleague', label: 'Former Colleague' },
  { value: 'manager', label: 'Manager' },
  { value: 'friend', label: 'Friend' },
  { value: 'professional_network', label: 'Professional Network' },
  { value: 'mentor', label: 'Mentor' },
  { value: 'other', label: 'Other' },
];

const referralSourceOptions = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'job_board', label: 'Job Board' },
  { value: 'company_website', label: 'Company Website' },
  { value: 'employee_referral', label: 'Employee Referral' },
  { value: 'recruitment_agency', label: 'Recruitment Agency' },
  { value: 'networking_event', label: 'Networking Event' },
  { value: 'other', label: 'Other' },
];

const experienceOptions = [
  { value: '0-1', label: '0-1 years' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-7', label: '5-7 years' },
  { value: '7-10', label: '7-10 years' },
  { value: '10+', label: '10+ years' },
];

const statusOptions = [
  { value: 'pending', label: 'Pending Review' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'screening', label: 'Screening' },
  { value: 'interview_scheduled', label: 'Interview Scheduled' },
  { value: 'interviewed', label: 'Interviewed' },
  { value: 'offer_extended', label: 'Offer Extended' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

const hiringDecisionOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'offer_made', label: 'Offer Made' },
  { value: 'offer_accepted', label: 'Offer Accepted' },
  { value: 'offer_declined', label: 'Offer Declined' },
  { value: 'hired', label: 'Hired' },
];

export default function AddReferral() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: TReferralSchema) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Referral Data:', data);

      toast.success('Referral submitted successfully!', {
        description: `${data.refereeName} has been referred.`,
      });

      // Reset form or redirect as needed
    } catch (error) {
      toast.error('Failed to submit referral', {
        description: 'Please try again or contact support if the issue persists.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-8 max-w-7xl bg-white rounded-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-spaceGrotesk flex items-center gap-3">
          <UserPlus className="w-8 h-8 text-[#03045B]" />
          Add New Referral
        </h1>
        <p className="text-gray-600 mt-2 font-spaceGrotesk">
          Submit a comprehensive referral with all required information for effective candidate
          sourcing and relationship management.
        </p>
      </div>

      <ReForm
        submitHandler={handleSubmit}
        defaultValues={referralDefaultValues}
        resolver={zodResolver(referralSchema)}
        mode="onBlur"
      >
        <div className="space-y-6">
          {/* Referee Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-spaceGrotesk">
                <Briefcase className="w-5 h-5 text-[#03045B]" />
                Candidate Details
              </CardTitle>
              <CardDescription className="font-spaceGrotesk">
                Complete information about the candidate being referred
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReInput
                  name="refereeName"
                  label="Candidate Full Name"
                  placeholder="Jane Smith"
                  required
                />
                <ReInput
                  name="refereeEmail"
                  label="Candidate Email"
                  type="email"
                  placeholder="jane.smith@example.com"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReInput
                  name="refereeCurrentCompany"
                  label="Current Company"
                  placeholder="Tech Corp Inc."
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Referral Context Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-spaceGrotesk">
                <Calendar className="w-5 h-5 text-[#03045B]" />
                Referral Context
              </CardTitle>
              <CardDescription className="font-spaceGrotesk">
                Details about the position and referral source
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReSelect
                  name="referralSource"
                  label="Referral Source"
                  placeholder="Select source"
                  options={referralSourceOptions}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReDatePicker
                  name="referralDate"
                  label="Referral Date"
                  placeholder="Select date"
                  required
                  disableFuture
                />
              </div>
              <ReTextarea
                name="referralReason"
                label="Reason for Referral"
                placeholder="Explain why you believe this candidate would be a great fit for the position..."
                required
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
          <Separator className="my-6" />

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <ReButton
              type="submit"
              isSubmitting={isSubmitting}
              className="px-8 py-6 text-lg rounded-full"
            >
              <Save className="w-5 h-5 mr-2" />
              Submit Referral
            </ReButton>
          </div>
        </div>
      </ReForm>
    </section>
  );
}
