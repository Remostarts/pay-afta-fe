'use client';

import { useState, useEffect } from 'react';
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

export const SearchableCounterpartySelect = ({
  onChange,
  placeholder = 'Search counterparties...',
}: {
  onChange: (email: string) => void;
  placeholder?: string;
}) => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string>('');

  useEffect(() => {
    if (!searchTerm) {
      setOptions([]);
      return;
    }

    const handler = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchCounterParty(searchTerm);

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

        setOptions(transformedOptions);
      } catch (err) {
        console.error(err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Map selected email to corresponding name for the dropdown
  const selectedOption = options.find((o) => o.email === selectedEmail);

  return (
    <SearchableSelect
      type="counterparty"
      loading={loading}
      options={options}
      value={selectedOption?.name || ''}
      onChange={(val: string) => {
        // val is the name selected, find corresponding email
        const selected = options.find((o) => o.name === val);
        if (selected?.email) {
          setSelectedEmail(selected.email);
          onChange(selected.email); // send email to parent
        }
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
