import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useSearchParamsHandler = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearchParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(key, value);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, searchParams, router]
  );

  return handleSearchParams;
};
