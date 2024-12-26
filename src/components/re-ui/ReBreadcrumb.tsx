import { ChevronRightIcon, HomeIcon } from 'lucide-react';
import Link from 'next/link';

type BreadcrumbItem = {
  label: string;
  link: string;
};

type ReBreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function ReBreadcrumb({ items = [] }: ReBreadcrumbProps) {
  return (
    <div className="w-full border-t-2">
      <div className="border-stroke dark:border-dark-3 border-b p-4">
        <ul className="flex">
          <li className="flex items-center">
            <Link
              href="/dashboard-home"
              className="hover:text-primary dark:text-dark-6 dark:hover:text-primary text-body-color flex items-center text-base font-medium"
            >
              <HomeIcon size={20} />
            </Link>
            {items.length > 0 && (
              <span className="text-body-color dark:text-dark-6 px-3">
                <ChevronRightIcon size={20} />
              </span>
            )}
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <Link
                href={item.link}
                className="text-body-color dark:text-dark-6 dark:hover:text-primary hover:text-primary text-base font-medium"
              >
                {item.label}
              </Link>
              {index < items.length - 1 && (
                <span className="text-body-color dark:text-dark-6 px-3">
                  <ChevronRightIcon size={20} />
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
