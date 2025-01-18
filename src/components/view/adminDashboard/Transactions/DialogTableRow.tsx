import React from 'react';
import { flexRender } from '@tanstack/react-table';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DialogTableRowProps<TData, TValue> {
  row: any;
  DialogComponent: React.ComponentType<any>;
  dialogProps?: object;
  onRowClick?: (row: any) => void;
  rowClassName?: string;
  cellClassName?: string;
}

export function DialogTableRow<TData, TValue>({
  row,
  DialogComponent,
  dialogProps = {},
  onRowClick,
  rowClassName,
  cellClassName,
}: DialogTableRowProps<TData, TValue>) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <TableRow
          className={cn('cursor-pointer hover:bg-muted/50', rowClassName)}
          data-state={row.getIsSelected() && 'selected'}
          onClick={() => onRowClick?.(row)}
        >
          {row.getVisibleCells().map((cell: any) => (
            <TableCell key={cell.id} className={cn('transition-colors', cellClassName)}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      </DialogTrigger>
      <DialogContent>
        <DialogComponent row={row} {...dialogProps} />
      </DialogContent>
    </Dialog>
  );
}
