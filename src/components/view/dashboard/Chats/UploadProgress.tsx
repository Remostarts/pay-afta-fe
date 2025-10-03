'use client';

import React from 'react';
import { FileText, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  fileName: string;
  progress: number;
  onCancel: () => void;
}

export function UploadProgress({ fileName, progress, onCancel }: UploadProgressProps) {
  return (
    <div className="border-t bg-background p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          <span className="text-sm">{fileName}</span>
        </div>
        <Button variant="ghost" size="sm" className="size-6 p-0" onClick={onCancel}>
          <X className="size-4" />
        </Button>
      </div>
      <Progress value={progress} className="h-1" />
    </div>
  );
}
