import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';

import { Marquee } from '@/components/custom-ui/marquee';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    testimonial:
      'I doubled my income without working nights. The platform sends me clients who actually value my expertise.',
    name: 'David R.',
    avatar: '/assets/root/home/testimonials/david.jpg',
    role: 'SBusiness Attorney',
  },
  {
    testimonial:
      'I avoided a $10K lawsuit thanks to PocketLawyers’ contract review. The Lawyer spotted risks I missed, explained everything in plain English and help me re-draft a more suitable contract.',
    name: 'Sarah J',
    avatar: '/assets/root/home/testimonials/sarah.jpg',
    role: 'Freelance Full stack Developer',
  },
  {
    testimonial:
      'The Lawyer i found on PocketLawyers not only secured my brand’s IP rights in record time but also broke down complex regulations into actionable steps.',
    name: 'Tunde O.',
    avatar: '/assets/root/home/testimonials/tunde.jpg',
    role: 'Tech Startup Founder',
  },
  {
    testimonial:
      'Before PocketLawyers, I struggled with finding and managing clients. Now, the platform’s smart system let me take on meaningful cases aligned with my expertise– it’s transformed how I practice law.',
    name: 'Amina K',
    avatar: '/assets/root/home/testimonials/amina.jpg',
    role: 'Intellectual Property Attorney',
  },
];

export function Testimonials() {
  return (
    <section className="py-10 mx-auto max-w-9xl">
      <div className="mx-4 px-4 sm:mx-6 sm:px-6 lg:mx-8 lg:px-8 xl:mx-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold lg:text-7xl text-[#03045B] font-playfair">
            Why our customers loves us
          </h2>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:20s]">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonials={testimonial} />
            ))}
          </Marquee>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background sm:w-1/5 lg:w-1/4"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background sm:w-1/5 lg:w-1/4"></div>
        </div>
      </div>
    </section>
  );
}

const TestimonialCard = ({
  testimonials,
}: {
  testimonials: {
    testimonial: string;
    name: string;
    avatar: string;
    role: string;
  };
}) => (
  <>
    <Card className="mx-2 size-full max-w-xs rounded-3xl border-2 shadow-lg sm:mx-3 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl">
      <CardContent className="flex h-full flex-col p-4 sm:p-6 lg:p-8">
        {/* Profile section - now at bottom */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Avatar className="flex size-12 items-center justify-center sm:size-14 lg:size-16">
            <AvatarImage
              src={testimonials?.avatar}
              alt={testimonials?.name}
              className="rounded-xl"
            />
            <AvatarFallback className="rounded-xl text-xs sm:text-sm">
              {testimonials?.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-foreground sm:text-base lg:text-lg">
              {testimonials?.name}
            </h3>
            <p className="truncate text-xs text-muted-foreground sm:text-sm lg:text-base">
              {testimonials?.role}
            </p>
          </div>
        </div>

        <div className="flex-1">
          {/* Quote marks */}
          <div className="mb-4 sm:mb-6">
            <svg
              width="12"
              height="11"
              viewBox="0 0 14 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="sm:h-[13px] sm:w-[14px]"
            >
              <path
                d="M12.672 0L13.632 2.304C11.84 2.56 11.008 2.944 11.008 4.608V5.44H13.376V12.992H8.32V5.184C8.32 2.048 9.344 0.447998 12.672 0ZM4.352 0L5.312 2.304C3.52 2.56 2.688 2.944 2.688 4.608V5.44H5.056V12.992H0V5.184C0 2.048 1.024 0.447998 4.352 0Z"
                fill="#2494A8"
              />
            </svg>
          </div>

          {/* Testimonial text */}
          <p className="mb-6 text-pretty text-sm font-normal leading-relaxed text-muted-foreground sm:mb-8 sm:text-base md:text-lg lg:text-xl">
            {testimonials?.testimonial}
          </p>
        </div>
      </CardContent>
    </Card>
  </>
);
