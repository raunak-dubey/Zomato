"use client";

import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import ReelFeed from "@/components/ReelFeed";
import BottomNav from "@/components/BottomNav";
import { Video } from "@/types/video";

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food", { withCredentials: true })
      .then((response) => {
        setVideos(response.data.foodItems);
      })
      .catch((error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          router.push("/auth/userLogin");
        }
      });
  }, [router]);

  async function likeVideo(item: Video) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/like",
        { foodId: item._id },
        { withCredentials: true }
      );

      if (response.data.like) {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === item._id ? { ...v, likeCount: v.likeCount + 1, isLiked: true } : v
          )
        );
      } else {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === item._id ? { ...v, likeCount: v.likeCount - 1, isLiked: false } : v
          )
        );
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          router.push("/auth/userLogin");
        }
      }
    }
  }

  async function saveVideo(item: Video) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/save",
        { foodId: item._id },
        { withCredentials: true }
      );

      if (response.data.save) {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === item._id ? { ...v, savesCount: v.savesCount + 1, isSaved: true } : v
          )
        );
      } else {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === item._id ? { ...v, savesCount: v.savesCount - 1, isSaved: false } : v
          )
        );
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          router.push("/auth/userLogin");
        }
      }
    }
  }

  return ( 
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <ReelFeed
        items={videos}
        onLike={likeVideo}
        onSave={saveVideo}
        emptyMessage="No videos available."
      />

      <BottomNav />
    </div>
  );
}
