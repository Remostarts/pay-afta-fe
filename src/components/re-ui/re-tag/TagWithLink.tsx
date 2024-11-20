import Link from 'next/link';

import ReTag from './ReTag';

interface Props {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}

const TagWithLink = ({ _id, name, totalQuestions, showCount }: Props) => {
  return (
    <Link href={`/tags/${_id}`} className="flex justify-between gap-2">
      <ReTag name={name} totalQuestions={totalQuestions} showCount={showCount} />
    </Link>
  );
};

export default TagWithLink;
