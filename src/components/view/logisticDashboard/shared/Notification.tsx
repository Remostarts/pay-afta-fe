'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Notification = {
  id: string;
  title: string;
  meta: string;
  from?: string;
  showPresence?: boolean;
  cta?: 'view';
  priceTag?: string;
  countBadge?: number;
  unread: boolean;
};

const initialData: Notification[] = [
  {
    id: '1',
    title: 'Payment Request',
    meta: 'Today • 12:24pm',
    cta: 'view',
    unread: true,
  },
  {
    id: '2',
    title: 'Invoice Payment Milestone',
    meta: 'Today • 12:24pm',
    unread: true,
  },
  {
    id: '3',
    title: 'Service Accepted',
    meta: 'Cameron Williamson',
    from: 'Cameron Williamson',
    showPresence: true,
    priceTag: '12.30',
    countBadge: 5,
    unread: false,
  },
  {
    id: '4',
    title: 'Wallet Funding',
    meta: 'Today • 12:24pm',
    cta: 'view',
    unread: false,
  },
  {
    id: '5',
    title: 'Service Accepted',
    meta: 'Today • 12:24pm',
    cta: 'view',
    unread: false,
  },
  {
    id: '5',
    title: 'Service Accepted',
    meta: 'Today • 12:24pm',
    cta: 'view',
    unread: false,
  },
  {
    id: '5',
    title: 'Service Accepted',
    meta: 'Today • 12:24pm',
    cta: 'view',
    unread: false,
  },
  {
    id: '5',
    title: 'Service Accepted',
    meta: 'Today • 12:24pm',
    cta: 'view',
    unread: false,
  },
  {
    id: '5',
    title: 'Service Accepted',
    meta: 'Today • 12:24pm',
    cta: 'view',
    unread: false,
  },
  {
    id: '5',
    title: 'Service Accepted',
    meta: 'Today • 12:24pm',
    cta: 'view',
    unread: false,
  },
  {
    id: '5',
    title: 'Service Accepted',
    meta: 'Today • 12:24pm',
    cta: 'view',
    unread: false,
  },
];

// Simple bell icon (no external deps)
function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm8-6c-1.5-1.5-2-3-2-6a6 6 0 1 0-12 0c0 3-0.5 4.5-2 6-.4.4-.6 1-.4 1.6.2.6.8 1 1.4 1h16c.6 0 1.2-.4 1.4-1 .2-.6 0-1.2-.4-1.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PresenceDot({ label = 'Online' }: { label?: string }) {
  return (
    <span className="inline-flex items-center">
      <span className="h-2.5 w-2.5 rounded-full bg-(--color-chart-2)" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

function NotificationRow({
  item,
  onToggleRead,
}: {
  item: Notification;
  onToggleRead: (id: string) => void;
}) {
  return (
    <li className={cn('flex items-center gap-3 py-4', !item.unread ? 'opacity-90' : '')}>
      {/* Icon */}
      <div
        className={cn(
          'relative grid h-10 w-10 place-items-center rounded-full bg-accent text-(--color-chart-5)'
        )}
        aria-hidden="true"
      >
        <BellIcon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className={cn('text-sm font-medium text-pretty', item.unread ? '' : 'font-normal')}>
            {item.title}
          </p>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {item.priceTag ? (
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-(--color-accent) px-2 py-1 text-xs font-semibold text-(--color-chart-5)">
                  {item.priceTag}
                </span>
                {item.countBadge != null && (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-(--color-chart-5) text-(--color-primary-foreground) text-[10px] font-bold">
                    {item.countBadge}
                  </span>
                )}
              </div>
            ) : item.cta === 'view' ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-semibold tracking-wide"
                aria-label={`View "${item.title}"`}
              >
                VIEW
              </Button>
            ) : null}
          </div>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{item.meta}</span>
          {item.showPresence && (
            <>
              <PresenceDot />
            </>
          )}
        </div>
      </div>

      {/* Unread marker toggle */}
      <button
        className={cn(
          'ml-2 h-2.5 w-2.5 shrink-0 rounded-full',
          item.unread ? 'bg-(--color-chart-5)' : 'bg-transparent ring-1 ring-border'
        )}
        onClick={() => onToggleRead(item.id)}
        aria-label={item.unread ? 'Mark as read' : 'Mark as unread'}
        title={item.unread ? 'Mark as read' : 'Mark as unread'}
      />
    </li>
  );
}

export function NotificationsPanel() {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<Notification[]>(initialData);
  const unreadCount = React.useMemo(() => items.filter((i) => i.unread).length, [items]);
  const [tab, setTab] = React.useState<'all' | 'unread'>('all');

  const filtered = tab === 'all' ? items : items.filter((i) => i.unread);

  function toggleRead(id: string) {
    setItems((list) => list.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n)));
  }

  function markAllRead() {
    setItems((list) => list.map((n) => ({ ...n, unread: false })));
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between px-4 py-3">
        <div className="text-left">
          <h1 className="text-xl font-inter font-semibold">Notifications</h1>
        </div>
        {/* <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs">
              Mark all read
            </Button>
          )}
        </div> */}
      </header>

      {/* Tabs */}
      <div className="px-4">
        <Tabs value={tab} onValueChange={(v) => setTab(v as 'all' | 'unread')}>
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="all"
              className={cn(
                'rounded-none border-b-2 border-transparent px-2 py-3 text-sm font-medium data-[state=active]:border-(--color-chart-5) data-[state=active]:text-foreground'
              )}
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className={cn(
                'group rounded-none border-b-2 border-transparent px-2 py-3 text-sm font-medium data-[state=active]:border-(--color-chart-5) data-[state=active]:text-foreground'
              )}
            >
              <span className="mr-2">Unread</span>
              <Badge
                variant="secondary"
                className="h-5 rounded-full px-2 text-[10px] group-data-[state=active]:bg-(--color-accent)"
                aria-label={`${unreadCount} unread`}
              >
                {unreadCount}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* <Separator /> */}

      {/* List */}
      <main className="flex-1 overflow-y-auto">
        <ul className="px-4 divide-y divide-border max-h-[400px] overflow-y-auto">
          {filtered.map((n, i) => (
            <NotificationRow key={n.id} item={n} onToggleRead={toggleRead} />
          ))}
          {filtered.length === 0 && (
            <li className="py-12 text-center text-sm text-muted-foreground">
              No notifications here.
            </li>
          )}
        </ul>
      </main>
    </div>
  );
}

export default NotificationsPanel;
