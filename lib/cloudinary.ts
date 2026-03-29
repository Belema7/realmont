import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
    file: string // base64 data URI
): Promise<string> {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: "real-estate",
            transformation: [
                { width: 1200, height: 800, crop: "limit" },
                { quality: "auto", fetch_format: "auto" },
            ],
        });
        return result.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error("Failed to upload image");
    }
}

export async function deleteImage(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary delete error:", error);
    }
}

export default cloudinary;
