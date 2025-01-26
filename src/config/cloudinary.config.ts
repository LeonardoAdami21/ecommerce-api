import { v2 as cloudinary } from "cloudinary";
import {
  cloudinaryApiKey,
  cloudinaryApiKeySecret,
  cloudinaryCloudName,
} from "../env/envoriment";

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiKeySecret
});

export default cloudinary;
