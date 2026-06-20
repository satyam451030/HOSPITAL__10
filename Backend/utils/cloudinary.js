import dotenv from 'dotenv';
import {v2 as cloudinary} from "cloudinary";
import fs from 'fs';

dotenv.config({ override: true });

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// to upload files to cloudinary
export async function uploadToCloudinary(filePath, folder="Doctor") {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: "image",
        });

        // remove the local file after upload
        fs.unlinkSync(filePath);
        return result;
    }
    catch(error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }   
}

// to delete files from cloudinary
export async function deleteFromCloudinary(publicId) {
    try {
        if (!publicId) return;
        await cloudinary.uploader.destroy(publicId);
    }
    catch(error) {
        console.error("Error deleting from Cloudinary:", error);
        throw error;
    }
}

export default cloudinary;