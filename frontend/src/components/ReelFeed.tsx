"use client";

import { Heart, Bookmark } from "lucide-react"
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Video } from "@/types/video";

export interface ReelFeedProps {
  items: Video[];
  onLike: (video: Video) => void | Promise<void>;
  onSave: (video: Video) => void | Promise<void>;
  emptyMessage?: string;
}

export default function ReelFeed({
  items = [],
  onLike,
  onSave,
  emptyMessage = "No videos yet.",
}: ReelFeedProps) {
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (!(video instanceof HTMLVideoElement)) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => { });
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0, 0.25, 0.6, 0.9, 1] }
    );

    videoRefs.current.forEach((vid) => observer.observe(vid));
    return () => observer.disconnect();
  }, [items]);

  const setVideoRef = (id: string) => (el: HTMLVideoElement | null) => {
    if (!el) {
      videoRefs.current.delete(id);
      return;
    }
    videoRefs.current.set(id, el);
  };

  return (

    <div className="w-full h-screen overflow-y-scroll snap-y snap-mandatory">
      {items.length === 0 && (
        <div className="flex h-full items-center justify-center text-gray-400">
          <p>{emptyMessage}</p>
        </div>
      )}
      {items.map((item) => (
        <section
          key={item._id}
          className="relative h-screen w-full snap-start bg-black"
        >
          {/* Video */}
          <video
            ref={setVideoRef(item._id)}
            className="h-full w-full object-cover"
            src={item.video}
            muted
            playsInline
            loop
            preload="metadata"
          />

          {/* Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-transparent pb-20">
            {/* Right-side Actions */}
            <div className="absolute bottom-28 right-4 flex flex-col items-center gap-6">
              {/* Like */}
              <div className="flex flex-col items-center gap-1">
                <button onClick={onLike ? () => onLike(item) : undefined} className="text-white hover:scale-110 transition-transform">
                  {item.isLiked ? (
                    <Heart className="text-red-500 fill-red-500" size={28} />
                  ) : (
                    <Heart className="text-gray-200" size={28} />
                  )}
                </button>
                <span className="text-xs text-white font-medium">
                  {item.likeCount ?? 0}
                </span>
              </div>

              {/* Save */}
              <div className="flex flex-col items-center gap-1">
                <button onClick={onSave ? () => onSave(item) : undefined} className="text-white hover:scale-110 transition-transform">

                  {item.isSaved ? (
                    <Bookmark className="text-white fill-white" size={28} />
                  ) : (
                    <Bookmark className="text-gray-200" size={28} />
                  )}
                </button>
                <span className="text-xs text-white font-medium">
                  {item.savesCount ?? 0}
                </span>
              </div>

              {/* Comments */}
              <div className="flex flex-col items-center gap-1">
                <button className="text-white hover:scale-110 transition-transform">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                  </svg>
                </button>
                <span className="text-xs text-white font-medium">
                  {item.commentsCount ?? 0}
                </span>
              </div>
            </div>

            {/* Description + Partner CTA */}
            <div className="absolute bottom-20 left-4 w-[80%] text-white">
              {item.description && (
                <p
                  className="line-clamp-1 text-sm text-gray-200"
                  title={item.description}
                >
                  {item.description}
                </p>
              )}
              {item.foodPartner && (
                <Link
                  href={`/partner/profile/${item.foodPartner}`}
                  className="mt-2 inline-block rounded-lg bg-white/90 px-3 py-1 text-xs font-medium text-black hover:bg-white"
                >
                  Visit Store
                </Link>
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}