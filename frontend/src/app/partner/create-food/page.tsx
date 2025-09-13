"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreateFood() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoURL, setVideoURL] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [fileError, setFileError] = useState("");
  const [thumbError, setThumbError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const thumbInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!videoFile) {
      setVideoURL("");
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setVideoURL(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setVideoFile(null);
      setFileError("");
      return;
    }
    if (!file.type.startsWith("video/")) {
      setFileError("Please select a valid video file.");
      return;
    }
    setFileError("");
    setVideoFile(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setFileError("Please drop a valid video file.");
      return;
    }
    setFileError("");
    setVideoFile(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const openFileDialog = () => fileInputRef.current?.click();
  const openThumbDialog = () => thumbInputRef.current?.click();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      setFileError("Please select a video file.");
      return;
    }

    if (!thumbnailFile) {
      setThumbError("Please select a thumbnail image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);

    try {
      const response = await axios.post("http://localhost:3000/api/food", formData, {
        withCredentials: true,
      });
      console.log(response.data);
      router.push("/"); // Redirect after successful creation
    } catch (err) {
      console.error("Error creating food:", err);
    }
  };

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailURL("");
      return;
    }
    const url = URL.createObjectURL(thumbnailFile);
    setThumbnailURL(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);

  const onThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setThumbnailFile(null);
      setThumbError("");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setThumbError("Please select a valid image file for thumbnail.");
      return;
    }
    setThumbError("");
    setThumbnailFile(file);
  };

  const onThumbDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setThumbError("Please drop a valid image file.");
      return;
    }
    setThumbError("");
    setThumbnailFile(file);
  };

  const isDisabled = useMemo(() => !name.trim() || !videoFile || !thumbnailFile, [name, videoFile, thumbnailFile]);

  return (
  

       <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      <div className="w-full max-w-2xl bg-gray-900 shadow-lg rounded-2xl p-8 border border-gray-700">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-white">Create Food</h1>
          <p className="text-gray-400 mt-1">
            Upload a video, add a thumbnail, and describe your dish.
          </p>
        </header>

        <form className="space-y-6" onSubmit={onSubmit}>
          {/* Food Video */}
          <div>
            <label htmlFor="foodVideo" className="block text-sm font-medium text-gray-200 mb-2">
              Food Video
            </label>
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 transition"
              role="button"
              tabIndex={0}
              onClick={openFileDialog}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openFileDialog();
                }
              }}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <svg
                className="w-10 h-10 text-gray-500 mb-2"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16v-4m0 0V8m0 4h4m-4 0H8m-2 8h12a2 2 0
                  002-2V6a2 2 0 00-2-2H6a2 2 0
                  00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-300">
                <strong>Click to upload</strong> or drag & drop
              </p>
              <p className="text-xs text-gray-500">MP4, WebM, MOV • Up to ~100MB</p>
            </div>
            <input
              id="foodVideo"
              type="file"
              accept="video/*"
              ref={fileInputRef}
              onChange={onFileChange}
              className="hidden"
            />
            {fileError && <p className="text-sm text-red-500 mt-2">{fileError}</p>}
            {videoFile && (
              <div className="mt-3 flex items-center justify-between bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
                <span className="text-sm text-gray-200">{videoFile.name}</span>
                <div className="flex gap-3">
                  <button type="button" className="text-purple-400 text-sm" onClick={openFileDialog}>
                    Change
                  </button>
                  <button
                    type="button"
                    className="text-red-400 text-sm"
                    onClick={() => {
                      setVideoFile(null);
                      setFileError("");
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail */}
          <div>
            <label htmlFor="foodThumbnail" className="block text-sm font-medium text-gray-200 mb-2">
              Thumbnail Image
            </label>
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 transition"
              role="button"
              tabIndex={0}
              onClick={openThumbDialog}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openThumbDialog();
                }
              }}
              onDrop={onThumbDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <p className="text-sm text-gray-300">
                <strong>Click to upload</strong> or drag & drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG • Recommended 1280x720</p>
            </div>
            <input
              id="foodThumbnail"
              type="file"
              accept="image/*"
              ref={thumbInputRef}
              onChange={onThumbChange}
              className="hidden"
            />
            {thumbError && <p className="text-sm text-red-500 mt-2">{thumbError}</p>}
            {thumbnailFile && (
              <div className="mt-3 flex items-center justify-between bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
                <span className="text-sm text-gray-200">{thumbnailFile.name}</span>
                <div className="flex gap-3">
                  <button type="button" className="text-purple-400 text-sm" onClick={openThumbDialog}>
                    Change
                  </button>
                  <button
                    type="button"
                    className="text-red-400 text-sm"
                    onClick={() => {
                      setThumbnailFile(null);
                      setThumbError("");
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Video Preview */}
          {videoURL && (
            <div className="mt-4">
              <video
                src={videoURL}
                controls
                playsInline
                className="w-full rounded-lg border border-gray-700"
              />
            </div>
          )}

          {/* Thumbnail Preview */}
          {thumbnailURL && (
            <div className="mt-4">
              <Image
                src={thumbnailURL}
                alt="Thumbnail preview"
                width={1280}
                height={720}
                className="w-full rounded-lg border border-gray-700 object-contain"
              />
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="foodName" className="block text-sm font-medium text-gray-200">
              Name
            </label>
            <input
              id="foodName"
              type="text"
              placeholder="e.g., Spicy Paneer Wrap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="foodDesc" className="block text-sm font-medium text-gray-200">
              Description
            </label>
            <textarea
              id="foodDesc"
              rows={4}
              placeholder="Write a short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isDisabled}
              className={`px-5 py-2 rounded-md text-white font-medium transition ${
                isDisabled
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              Save Food
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
