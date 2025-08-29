// profileImage.ts
import { supabase } from "../js/components/request.tsx";
import imageCompression from "browser-image-compression";

export const updateProfileImage = async (
  file: File,
  userId: string,
  bucket: string = "REX333", // default bucket
) => {
  try {
    let uploadFile = file;

    // ✅ Only compress if larger than 300 KB
    if (file.size > 300 * 1024) {
      const options = {
        maxSizeMB: 0.3, // aim for ≤ 300 KB
        maxWidthOrHeight: 800, // resize if bigger than 800px
        useWebWorker: true,
      };

      uploadFile = await imageCompression(file, options);
    }

    // 1. Fetch current avatar_url from DB
    const { data: userData, error: fetchError } = await supabase
      .from("user")
      .select("avatar_url")
      .eq("api", userId)
      .single();

    if (fetchError) throw fetchError;

    const oldUrl = userData?.avatar_url;

    // 2. If old image exists, delete from bucket
    if (oldUrl) {
      const path = oldUrl.split(`/${bucket}/`)[1];
      if (path) {
        await supabase.storage.from(bucket).remove([path]);
      }
    }

    // 3. Create unique new path
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}-${Date.now()}.${fileExt}`;

    // 4. Upload file (compressed if >300KB, original otherwise)
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, uploadFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // 5. Get public URL of new file
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    const newUrl = data.publicUrl;

    // 6. Save new URL to DB
    const { error: dbError } = await supabase
      .from("user")
      .update({ avatar_url: newUrl })
      .eq("api", userId);

    if (dbError) throw dbError;

    return newUrl;
  } catch (err) {
    console.error("Error updating profile image:", err);
    return null;
  }
};


// Convert <img> src → File
export const imageElementToFile = async (
  imgEl: HTMLImageElement,
  fileName: string = "profile.jpg"
): Promise<File> => {
  const response = await fetch(imgEl.src); // fetch the data behind the image src
  const blob = await response.blob(); // turn into Blob
  const ext = blob.type.split("/")[1]; // e.g. "jpeg" or "png"

  return new File([blob], `${fileName}.${ext}`, { type: blob.type });
};


/*
const imgEl = document.getElementById("myProfileImage") as HTMLImageElement;

if (imgEl) {
  const file = await imageElementToFile(imgEl, "profile");
  const newUrl = await updateProfileImage(file, userId, "REX333");
  console.log("Updated avatar URL:", newUrl);
}

*/