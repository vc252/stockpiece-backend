import { v2 as cloudinary, UploadApiOptions } from "cloudinary";
import Container from "../container/Container.js";
import env from "../config/env.config.js";
import ImageProcessingService from "./ImageProcessingService.js";
import { logger } from "../utils/logger.js";
import fs from "node:fs";
import { getApiError } from "../common/HttpResponse.js";
import { extractPublicId } from "cloudinary-build-url";

export default class FileUploadService {
  private readonly imageProcessingService: ImageProcessingService;

  constructor(container: Container) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    this.imageProcessingService = container.resolve("ImageProcessingService");
  }

  private readonly deleteTempFile = async (
    localFilePath: string
  ): Promise<void> => {
    try {
      if (!localFilePath) {
        logger.debug("No file path provided for deletion");
        return;
      }

      logger.debug("Attempting to delete file at:", localFilePath);
      logger.debug("Exists before deletion:", fs.existsSync(localFilePath));

      await fs.promises.unlink(localFilePath);

      logger.debug("File deleted:", !fs.existsSync(localFilePath));
    } catch (error) {
      logger.error("Error deleting temp file:", error);
    }
  };

  public readonly uploadOnCloudinary = async (
    localFilePath: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      processImage?: boolean;
      displayName?: string;
      folder: string;
    }
  ): Promise<string> => {
    const {
      width,
      height,
      quality,
      processImage = true,
      displayName,
      folder = "miscellaneous",
    } = options;
    let finalFilePath = localFilePath;

    if (processImage) {
      finalFilePath = await this.imageProcessingService.processImage(
        localFilePath,
        {
          width,
          height,
          quality,
        }
      );
    }

    // Build upload options
    const uploadOptions: UploadApiOptions = {
      resource_type: "auto",
      asset_folder: folder,
      use_asset_folder_as_public_id_prefix: true,
    };

    // Add display_name if provided
    if (displayName) {
      uploadOptions.display_name = displayName;
    }

    try {
      const uploadResult = await cloudinary.uploader.upload(
        finalFilePath,
        uploadOptions
      );

      return uploadResult.secure_url;
    } catch (err) {
      throw getApiError("CLOUDINARY_UPLOAD_FAILED", err);
    }
  };

  public readonly deleteFromCloudinary = async (
    identifier: string,
    isUrl: boolean
  ): Promise<void> => {
    let publicId = identifier;

    if (isUrl) {
      publicId = extractPublicId(identifier);
      if (!publicId) {
        throw getApiError("INVALID_CLOUDINARY_URL");
      }
    }

    try {
      const destroyResult = await cloudinary.uploader.destroy(publicId);
      logger.debug("destroy result: ", destroyResult);
    } catch (err) {
      throw getApiError("CLOUDINARY_DESTROY_FAILED", err);
    }
  };
}
