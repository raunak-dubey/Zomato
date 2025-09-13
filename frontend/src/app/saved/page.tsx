"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ReelFeed from "@/components/ReelFeed";
import { Video } from "@/types/video";
import { SavedFoodRes } from "@/types/savedFoodRes";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

export default function Saved() {
  const [videos, setVideos] = useState<Video[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food/save", { withCredentials: true })
      .then((response) => {
        const savedFoods: Video[] = (response.data.savedFoods as SavedFoodRes[]).map(
          (item) => ({
            _id: item.food._id,
            video: item.food.video,
            description: item.food.description,
            likeCount: item.food.likeCount,
            savesCount: item.food.savesCount,
            commentsCount: item.food.commentsCount,
            foodPartner: item.food.foodPartner,
            isLiked: item.food.isLiked ?? false, 
            isSaved: item.food.isSaved ?? true,
          })
        );
        setVideos(savedFoods);
      })
      .catch((err) => console.error("Error fetching saved foods:", err));
  }, []);

  const removeSaved = (item: Video) => {
    axios.post(
      "http://localhost:3000/api/food/save",
      { foodId: item._id },
      { withCredentials: true }
    )
      .then(() => {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === item._id
              ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 1) - 1), isSaved: false }
              : v
          )
        );
      })
      .catch((err) => {
        console.error("Failed to remove saved video:", err);
      });
  };
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <ReelFeed
        items={videos}
        onLike={likeVideo}
        onSave={removeSaved}
        emptyMessage="No videos available."
      />

      <BottomNav />
    </div>
  );
}
