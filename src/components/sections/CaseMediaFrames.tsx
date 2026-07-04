"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play } from "@phosphor-icons/react";
import { CURSOR, type CaseMedia } from "@/content/content";
import { GlassPanel } from "@/components/ui/GlassPanel";

function Chrome({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 border-b px-4 py-2.5 [border-color:var(--edge)]">
      <span className="size-2 rounded-full bg-[var(--edge)]" />
      <span className="size-2 rounded-full bg-[var(--edge)]" />
      <span className="size-2 rounded-full bg-[var(--edge)]" />
      <span className="ml-3 text-xs tracking-wide text-muted">{url}</span>
    </div>
  );
}

export function LiveFrame({ url, media }: { url: string; media: CaseMedia }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  };

  useEffect(() => {
    void videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <GlassPanel className="overflow-hidden">
      <Chrome url={url} />
      <div className="relative" data-cursor="play">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={media.poster}
          className="block w-full"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={media.webm} type="video/webm" />
          <source src={media.mp4} type="video/mp4" />
        </video>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause video" : "Play video"}
          data-cursor="play"
          data-cursor-label={CURSOR.labels.play}
          className="pressable absolute bottom-3 right-3 rounded-full bg-[var(--glass)] p-2.5 backdrop-blur-md"
        >
          {playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
        </button>
      </div>
      <a
        href={media.href}
        target="_blank"
        rel="noopener noreferrer"
        className="pressable group flex items-center justify-between px-5 py-4 text-sm"
      >
        Visit the live site
        <ArrowUpRight
          size={18}
          className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden
        />
      </a>
    </GlassPanel>
  );
}

export function ConfidentialFrame({ url }: { url: string }) {
  return (
    <GlassPanel>
      <Chrome url={url} />
      <div className="space-y-3 p-6" aria-label="Confidential work — abstract preview">
        <div className="h-24 rounded-lg bg-[var(--edge)] opacity-60" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-16 rounded-lg bg-[var(--edge)] opacity-40" />
          <div className="h-16 rounded-lg bg-[var(--edge)] opacity-40" />
          <div className="h-16 rounded-lg bg-[var(--edge)] opacity-40" />
        </div>
        <div className="h-3 w-2/3 rounded bg-[var(--edge)] opacity-40" />
        <div className="h-3 w-1/2 rounded bg-[var(--edge)] opacity-30" />
        <p className="pt-2 text-xs uppercase tracking-[0.16em] text-muted">
          Confidential
        </p>
      </div>
    </GlassPanel>
  );
}
