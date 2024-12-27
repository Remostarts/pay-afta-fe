/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, {
  createContext,
  useContext,
  useState,
  cloneElement,
  ReactElement,
  ReactNode,
} from 'react';

import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// Context Types
interface DialogContextType {
  openNames: string[];
  open: (name: string) => void;
  close: (name: string) => void;
}

interface DialogProviderProps {
  children: ReactNode;
}

interface OpenProps {
  children: ReactElement<any>;
  opens: string;
}

interface WindowProps {
  children?: ReactNode;
  name: string;
  title: ReactNode | string;
  description?: ReactNode | string; // Optional description for more context
  className?: string;
}

// Context
const DialogContext = createContext<DialogContextType | undefined>(undefined);

// Dialog Provider
function DialogProvider({ children }: DialogProviderProps) {
  const [openNames, setOpenNames] = useState<string[]>([]);

  const open = (name: string) => setOpenNames((prev) => [...prev, name]);
  const close = (name: string) => setOpenNames((prev) => prev.filter((n) => n !== name));

  return (
    <DialogContext.Provider value={{ openNames, open, close }}>{children}</DialogContext.Provider>
  );
}

// Custom Hook
function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}

// Dialog Open Component
function Open({ children, opens: opensWindowName }: OpenProps) {
  const { open } = useDialog();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (children.props.onClick) {
      children.props.onClick(event);
    }
    open(opensWindowName);
  };

  return cloneElement(children, { onClick: handleClick });
}

// Dialog Window Component
function Window({ children, name, title, description, className }: WindowProps) {
  const { openNames, close } = useDialog();
  const isOpen = openNames.includes(name);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : close(name))}>
      <DialogContent className={`w-full max-w-[660px] bg-white ${className}`}>
        <div className="relative">
          <DialogTitle className="text-xl font-bold text-gray-800">{title}</DialogTitle>
          {description && (
            <DialogDescription className="mt-2 text-sm text-gray-500">
              {description}
            </DialogDescription>
          )}

          <div className="mt-4">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Assigning sub-components
DialogProvider.Open = Open;
DialogProvider.Window = Window;

export { DialogProvider, useDialog };
