"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import BottomNav from "@/components/BottomNav";
import Image from "next/image";

interface FoodItem {
  _id: string;
  video: string;
  thumbnail?: string;
}

interface FoodPartner {
  name: string;
  address: string;
  totalMeals: number;
  customersServed: number;
  foodItems: FoodItem[];
}

export default function ProfilePage() {
  const { id } = useParams() as { id: string };
  const [profile, setProfile] = useState<FoodPartner | null>(null);
  const [videos, setVideos] = useState<FoodItem[]>([]);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:3000/api/partner/${id}`, { withCredentials: true })
      .then((response) => {
        const foodPartner = response.data.foodPartner as FoodPartner;
        setProfile(foodPartner);
        setVideos(foodPartner.foodItems || []);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
      });
  }, [id]);

  return (
    <main className="min-h-screen bg-[#0a0d1a] text-white px-4 py-8">
      {/* Profile Header */}
      <section className="flex flex-col items-center">
        {/* Avatar */}
        <Image
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover border-2 border-purple-500 shadow-lg"
          src="/images/swiggy.png"
          alt="Business avatar"
        />

        {/* Name + Address */}
        <h1 className="mt-4 text-xl font-bold">{profile?.name ?? "Loading..."}</h1>
        <p className="text-gray-400 text-sm">{profile?.address}</p>

        {/* Stats */}
        <div className="flex gap-8 mt-6 text-center">
          <div>
            <span className="block text-lg font-semibold">{profile?.totalMeals ?? 0}</span>
            <span className="text-gray-400 text-sm">Meals</span>
          </div>
          <div>
            <span className="block text-lg font-semibold">{profile?.customersServed ?? 0}</span>
            <span className="text-gray-400 text-sm">Customers</span>
          </div>
          <div>
            <span className="block text-lg font-semibold">{videos.length}</span>
            <span className="text-gray-400 text-sm">Reels</span>
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="my-8 border-gray-800" />

      {/* Video Grid */}
      <section className="grid grid-cols-3 gap-1 sm:gap-2">
        {videos.length > 0 ? (
          videos.map((v) => (
            <div
              key={v._id}
              className="relative aspect-[9/12] bg-gray-900 overflow-hidden group"
            >
              <video
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                src={v.video}
                poster={v.thumbnail ?? undefined}
                muted
                playsInline
                preload="metadata"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-sm text-white font-medium">▶</span>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No reels uploaded yet.
          </p>
        )}
      </section>
      <BottomNav />
    </main>
  );
}
