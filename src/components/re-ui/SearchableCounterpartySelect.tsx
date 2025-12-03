'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { SearchableSelect } from './SearchableSelect';
import { searchCounterParty } from '@/lib/actions/root/user.action';

type CounterpartyOption = {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
};

type SelectOption = {
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
};

// 🌐 Global cache – persists across component instances
const searchCache = new Map<string, SelectOption[]>();
// 🕒 Track last fetch time to avoid excessive revalidation
const lastFetchTime = new Map<string, number>();
const CACHE_TTL = 30_000; // 30 seconds

export const SearchableCounterpartySelect = ({
  onChange,
  placeholder = 'Search Counterparty',
  inviteCounterpartyEmail,
  onInviteSuccess,
}: {
  onChange: (email: string) => void;
  placeholder?: string;
  inviteCounterpartyEmail: string | undefined;
  onInviteSuccess?: (email: string) => void;
}) => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string>('');

  // Sync invite email
  useEffect(() => {
    if (inviteCounterpartyEmail) {
      setSelectedEmail(inviteCounterpartyEmail);
    }
  }, [inviteCounterpartyEmail]);

  const performSearch = useCallback(
    async (term: string) => {
      const trimmedTerm = term.trim().toLowerCase();
      if (!trimmedTerm) {
        setOptions([]);
        return;
      }

      // 🔥 STEP 1: Show cached result IMMEDIATELY (stale-while-revalidate)
      if (searchCache.has(trimmedTerm)) {
        setOptions(searchCache.get(trimmedTerm)!);
      }

      // 🔥 STEP 2: Only fetch if not recently fetched (avoid spamming)
      const now = Date.now();
      const lastFetched = lastFetchTime.get(trimmedTerm) || 0;
      if (now - lastFetched < CACHE_TTL) {
        // Skip API call if recently fetched
        return;
      }

      setLoading(true);
      try {
        const res = await searchCounterParty(trimmedTerm);

        const transformedOptions: SelectOption[] = (res.data || []).map((u: CounterpartyOption) => {
          const displayName =
            u.username ||
            `${u.firstName || ''} ${u.lastName || ''}`.trim() ||
            u.email ||
            u.phone ||
            'Unknown';

          return {
            name: displayName,
            email: u.email,
            phone: u.phone,
            avatar: u.profileImage,
          };
        });

        // 🔥 STEP 3: Update cache AND UI
        searchCache.set(trimmedTerm, transformedOptions);
        lastFetchTime.set(trimmedTerm, now);

        // Only update if user hasn't changed term
        if (searchTerm.trim().toLowerCase() === trimmedTerm) {
          setOptions(transformedOptions);
        }
      } catch (err) {
        console.error('Search error:', err);
        // Don't clear options on error — keep stale result
      } finally {
        setLoading(false);
      }
    },
    [searchTerm]
  ); // 🔥 Important: include searchTerm to avoid stale closure

  // Trigger search with very short debounce (150ms feels instant)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setOptions([]);
      return;
    }

    const handler = setTimeout(() => {
      performSearch(searchTerm);
    }, 150); // ⚡ Faster: 150ms

    return () => clearTimeout(handler);
  }, [searchTerm, performSearch]);

  const selectedOption = useMemo(() => {
    return options.find((o) => o.email === selectedEmail);
  }, [options, selectedEmail]);

  return (
    <SearchableSelect
      type="counterparty"
      loading={loading}
      options={options}
      value={selectedOption?.name || inviteCounterpartyEmail || ''}
      onChange={(val: string) => {
        const selected = options.find((o) => o.name === val);
        if (selected?.email) {
          setSelectedEmail(selected.email);
          onChange(selected.email);
        }
      }}
      inviteCounterParty={(email: string) => {
        setSelectedEmail(email);
        onChange(email);
        onInviteSuccess?.(email);
      }}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      placeholder={placeholder}
      searchPlaceholder="Type name, email or phone..."
      recentOptions={[]}
      showRecent={false}
      onInvite={() => console.log('Invite new counterparty')}
    />
  );
};
