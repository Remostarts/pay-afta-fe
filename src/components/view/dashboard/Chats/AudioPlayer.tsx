import { Pause, Play } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  className?: string;
}

export function AudioPlayer({ audioUrl, isPlaying, onPlayPause, className }: AudioPlayerProps) {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    // Reset error and loading states
    setIsLoading(true);
    setHasError(false);

    // Initialize WaveSurfer instance if it hasn't been created
    if (waveformRef.current) {
      try {
        wavesurfer.current = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: '#cccccc',
          progressColor: '#4F4A85',
          barWidth: 2,
          height: 50,
          cursorWidth: 0,
          barGap: 3,
          barRadius: 30,
          hideScrollbar: true,
        });

        wavesurfer.current.load(audioUrl);

        // Handle successful loading
        wavesurfer.current.on('ready', () => {
          setDuration(wavesurfer.current?.getDuration() || 0);
          setIsLoading(false);
        });

        // Update current time as the audio progresses
        wavesurfer.current.on('audioprocess', () => {
          setCurrentTime(wavesurfer.current?.getCurrentTime() || 0);
        });

        // Reset play state on audio finish
        wavesurfer.current.on('finish', () => {
          setCurrentTime(0);
          onPlayPause();
        });
      } catch (error) {
        setHasError(true);
        console.error('Error loading audio:', error);
      }
    }

    return () => {
      // Cleanup WaveSurfer instance on component unmount
      wavesurfer.current?.destroy();
      wavesurfer.current = null;
    };
  }, [audioUrl, duration, onPlayPause]);

  // Play or pause audio based on the `isPlaying` prop
  useEffect(() => {
    if (wavesurfer.current) {
      isPlaying ? wavesurfer.current.play() : wavesurfer.current.pause();
    }
  }, [isPlaying]);

  // Format time for display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('flex items-center gap-3 rounded-lg bg-white shadow p-3', className)}>
      <Button
        size="icon"
        variant="ghost"
        className="size-8 rounded-full bg-[#F8F8F8] text-white hover:bg-[#F8F8F8]"
        onClick={onPlayPause}
        disabled={isLoading || hasError}
      >
        {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
      </Button>
      <div className="flex flex-1 flex-col gap-1.5">
        <div ref={waveformRef} className="h-10 cursor-pointer"></div>
        <div className="text-sm font-medium text-gray-600">
          {hasError
            ? 'Error loading audio'
            : `${formatTime(currentTime)} / ${formatTime(duration)}`}
        </div>
      </div>
    </div>
  );
}
