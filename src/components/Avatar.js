import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
  avatar,
  setAvatar,
}) {
  const supabase = useSupabaseClient();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatar(url);
    } catch (error) {
      console.log("Error downloading image: ", error);
    }
  }

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${uid}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert("Error uploading avatar!");
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full flex justify-center flex-col items-center mb-10 gap-6">
      {avatar ? (
        <Image
          src={avatar}
          alt="Avatar"
          className="avatar image rounded-full"
          width={size}
          height={size}
        />
      ) : (
        <div
          className="avatar bg-neutral-100 rounded-full flex justify-center items-center text-neutral-400"
          style={{ height: size, width: size }}
        >
          No Avatar
        </div>
      )}
      <div style={{ width: size }} className="flex justify-center">
        <label
          className="font-medium px-3 py-2 text-sm cursor-pointer rounded-lg bg-black text-white transition-all hover:bg-zinc-800 w-full text-center"
          htmlFor="single"
        >
          {uploading ? "Uploading ..." : "Upload"}
        </label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
