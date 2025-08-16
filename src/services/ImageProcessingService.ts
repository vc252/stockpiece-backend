import sharp from "sharp";
import path from "node:path";
import { logger } from "../utils/logger.js";
import { getApiError } from "../common/HttpResponse.js";
import Container from "../container/Container.js";
import { BaseService } from "./BaseService.js";

export default class ImageProcessingService extends BaseService {
  constructor(container: Container) {
    super(container);
  }

  public readonly processImage = async (
    inputPath: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
    }
  ): Promise<string> => {
    try {
      const { width, height, quality } = options;

      const outputPath = this.generateProcessedPath(inputPath, "webp");

      let sharpInstance = sharp(inputPath);

      if (width && height) {
        sharpInstance = sharpInstance.resize(width, height, {
          fit: "cover",
        });
      }

      await sharpInstance
        .webp({
          quality: quality || 80,
        })
        .toFile(outputPath);

      logger.info("image processed successfully", {
        inputPath,
        outputPath,
        resized: width && height,
        width,
        height,
      });

      return outputPath;
    } catch (err) {
      throw getApiError("INTERNAL_SERVER_ERROR", err);
    }
  };

  private readonly generateProcessedPath = (
    inputPath: string,
    format: string,
    suffix: string = "processed"
  ): string => {
    const parsed = path.parse(inputPath);

    return path.join(parsed.dir, `${parsed.name}_${suffix}.${format}`);
  };
}
