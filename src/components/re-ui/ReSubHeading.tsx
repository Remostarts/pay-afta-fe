interface ReSubHeadingProps {
  subHeading: string;
  className?: string;
}

export default function ReSubHeading({ subHeading, className }: ReSubHeadingProps) {
  return <p className={`mt-1 text-gray-600 ${className}`}>{subHeading}</p>;
}
